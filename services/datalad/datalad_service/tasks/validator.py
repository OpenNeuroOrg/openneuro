import json
import os
import requests
import re

import gevent
from gevent import subprocess

from datalad_service.config import GRAPHQL_ENDPOINT
from datalad_service.common.elasticsearch import ValidationLogger


LEGACY_VALIDATOR_VERSION = json.load(
    open('package.json'))['dependencies']['bids-validator']
DENO_VALIDATOR_VERSION = 'v1.13.0'

LEGACY_METADATA = {
    'validator': 'legacy',
    'version': LEGACY_VALIDATOR_VERSION
}
DENO_METADATA = {
    'validator': 'schema',
    'version': DENO_VALIDATOR_VERSION
}


def escape_ansi(text):
    ansi_escape = re.compile(r'(?:\x1B[@-_]|[\x80-\x9F])[0-?]*[ -/]*[@-~]')
    return ansi_escape.sub('', text)


def setup_validator():
    """Install nodejs deps if they do not exist."""
    if not os.path.exists('./node_modules/.bin/bids-validator'):
        subprocess.run(['yarn'])


def run_and_decode(args, timeout, esLogger):
    """Run a subprocess and return the JSON output."""
    process = gevent.subprocess.Popen(args, stdout=subprocess.PIPE, stderr=subprocess.PIPE)
    try:
        process.wait(timeout=timeout)
    except subprocess.TimeoutExpired:
        process.kill()

    # Retrieve what we can from the process
    stdout, stderr = process.communicate()

    # If we have a whole JSON document from stdout, then return it
    # Otherwise, log the error and return None
    try:
        return json.loads(escape_ansi(stdout.decode('utf-8')))
    except json.decoder.JSONDecodeError as err:
        esLogger.log(stdout, stderr, err)


def validate_dataset_sync(dataset_path, ref, esLogger):
    """
    Synchronous dataset validation.

    Runs the bids-validator process and installs node dependencies if needed.
    """
    setup_validator()
    return run_and_decode(
        ['./node_modules/.bin/bids-validator', '--json', '--ignoreSubjectConsistency', dataset_path],
        timeout=300,
        esLogger=esLogger,
    )


def validate_dataset_deno_sync(dataset_path, ref, esLogger):
    """
    Synchronous dataset validation.

    Runs the deno bids-validator process.
    """
    return run_and_decode(
        ['deno', 'run', '-A',
         f'https://deno.land/x/bids_validator@{DENO_VALIDATOR_VERSION}/bids-validator.ts',
         '--json', dataset_path],
        timeout=300,
        esLogger=esLogger,
    )


def summary_mutation(dataset_id, ref, validator_output, validator_metadata):
    """
    Return the OpenNeuro mutation to update a dataset summary.
    """
    summary = validator_output['summary']
    summary['datasetId'] = dataset_id
    # Set the object id to the git sha256 ref
    summary['id'] = ref
    summary['validatorMetadata'] = validator_metadata
    return {
        'query': 'mutation ($summaryInput: SummaryInput!) { updateSummary(summary: $summaryInput) { id } }',
        'variables':
            {
                'summaryInput': summary,
            }
    }


def issues_mutation(dataset_id, ref, issues, validator_metadata):
    """
    Return the OpenNeuro mutation to update any validation issues.
    """
    for issue in issues:
        # Remove extra stats to keep collection size down
        if 'files' in issue:
            for f in issue['files']:
                if f.get('file'):
                    if f['file'].get('stats'):
                        del f['file']['stats']
    issues = {
        'datasetId': dataset_id,
        'id': ref,
        'issues': issues,
        'validatorMetadata': validator_metadata
    }
    return {
        'query': 'mutation ($issues: ValidationInput!) { updateValidation(validation: $issues) }',
        'variables':
            {
                'issues': issues,
            }
    }


def _validate_dataset_eventlet(dataset_id, dataset_path, ref, cookies=None, user=''):
    esLogger = ValidationLogger(dataset_id, user)
    validator_output = validate_dataset_sync(dataset_path, ref, esLogger)
    all_issues = validator_output['issues']['warnings'] + \
        validator_output['issues']['errors']
    if validator_output:
        if 'issues' in validator_output:
            r = requests.post(
                url=GRAPHQL_ENDPOINT, json=issues_mutation(dataset_id, ref, all_issues, LEGACY_METADATA), cookies=cookies)
            if r.status_code != 200 or 'errors' in r.json():
                raise Exception(r.text)
        if 'summary' in validator_output:
            r = requests.post(
                url=GRAPHQL_ENDPOINT, json=summary_mutation(dataset_id, ref, validator_output, LEGACY_METADATA), cookies=cookies)
            if r.status_code != 200 or 'errors' in r.json():
                raise Exception(r.text)
    else:
        raise Exception('Validation failed unexpectedly')

    # New schema validator second in case of issues
    validator_output_deno = validate_dataset_deno_sync(
        dataset_path, ref, esLogger)
    if validator_output_deno:
        if 'issues' in validator_output_deno:
            r = requests.post(
                url=GRAPHQL_ENDPOINT, json=issues_mutation(dataset_id, ref, validator_output_deno['issues'], DENO_METADATA), cookies=cookies)
            if r.status_code != 200 or 'errors' in r.json():
                raise Exception(r.text)
        if 'summary' in validator_output_deno:
            r = requests.post(
                url=GRAPHQL_ENDPOINT, json=summary_mutation(dataset_id, ref, validator_output_deno, DENO_METADATA), cookies=cookies)
            if r.status_code != 200 or 'errors' in r.json():
                raise Exception(r.text)


def validate_dataset(dataset_id, dataset_path, ref, cookies=None, user=''):
    return gevent.spawn(_validate_dataset_eventlet,
                        dataset_id, dataset_path, ref, cookies, user)
