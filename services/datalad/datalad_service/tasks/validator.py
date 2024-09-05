import asyncio
import json
import logging
import os
import re

import requests

from datalad_service.config import GRAPHQL_ENDPOINT

logger = logging.getLogger('datalad_service.' + __name__)

LEGACY_VALIDATOR_VERSION = json.load(
    open('package.json'))['dependencies']['bids-validator']
DENO_VALIDATOR_VERSION = 'v1.14.8'

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


async def setup_validator():
    """Install nodejs deps if they do not exist."""
    if not os.path.exists('./node_modules/.bin/bids-validator'):
        process = await asyncio.create_subprocess_exec('yarn')
        await process.wait()


async def run_and_decode(args, timeout, logger):
    """Run a subprocess and return the JSON output."""
    process = await asyncio.create_subprocess_exec(*args, stdout=asyncio.subprocess.PIPE, stderr=asyncio.subprocess.PIPE)
    try:
        await asyncio.wait_for(process.wait(), timeout=timeout)
    except asyncio.TimeoutError:
        logger.warning(f'Timed out while running `{" ".join(args)}`')
        process.kill()

    # Retrieve what we can from the process
    stdout, stderr = await process.communicate()

    # If we have a whole JSON document from stdout, then return it
    # Otherwise, log the error and return None
    try:
        return json.loads(escape_ansi(stdout.decode('utf-8')))
    except json.decoder.JSONDecodeError as err:
        logger.exception(err)
        logger.info(stdout)
        logger.error(stderr)


async def validate_dataset_call(dataset_path, ref, logger=logger):
    """
    Synchronous dataset validation.

    Runs the bids-validator process and installs node dependencies if needed.
    """
    await setup_validator()
    return await run_and_decode(
        ['./node_modules/.bin/bids-validator', '--json', '--ignoreSubjectConsistency', dataset_path],
        timeout=300,
        logger=logger,
    )


async def validate_dataset_deno_call(dataset_path, ref, logger=logger):
    """
    Synchronous dataset validation.

    Runs the deno bids-validator process.
    """
    return await run_and_decode(
        ['deno', 'run', '-A',
         f'https://deno.land/x/bids_validator@{DENO_VALIDATOR_VERSION}/bids-validator.ts',
         '--json', dataset_path],
        timeout=300,
        logger=logger
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


async def validate_dataset(dataset_id, dataset_path, ref, cookies=None, user=''):
    validator_output = await validate_dataset_call(dataset_path, ref)
    if validator_output:
        if 'issues' in validator_output:
            all_issues = validator_output['issues']['warnings'] + validator_output['issues']['errors']
            r = requests.post(
                url=GRAPHQL_ENDPOINT, json=issues_mutation(dataset_id, ref, all_issues, LEGACY_METADATA), cookies=cookies)
            if r.status_code != 200 or 'errors' in r.json():
                raise Exception(r.text)
        if 'summary' in validator_output:
            r = requests.post(
                url=GRAPHQL_ENDPOINT, json=summary_mutation(dataset_id, ref, validator_output, LEGACY_METADATA), cookies=cookies)
            if r.status_code != 200 or 'errors' in r.json():
                raise Exception(r.text)

    # New schema validator second in case of issues
    validator_output_deno = await validate_dataset_deno_call(dataset_path, ref)
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



