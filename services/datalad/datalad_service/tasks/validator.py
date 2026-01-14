import asyncio
from pathlib import Path
import json
import logging
import re

import requests

from datalad_service.config import GRAPHQL_ENDPOINT
from datalad_service.broker import broker

logger = logging.getLogger('datalad_service.' + __name__)

DENO_VALIDATOR_VERSION = '2.2.7'

DENO_METADATA = {'validator': 'schema', 'version': DENO_VALIDATOR_VERSION}


def escape_ansi(text):
    ansi_escape = re.compile(r'(?:\x1B[@-_]|[\x80-\x9F])[0-?]*[ -/]*[@-~]')
    return ansi_escape.sub('', text)


async def run_and_decode(args, logger):
    """Run a subprocess and return the JSON output."""
    process = await asyncio.create_subprocess_exec(
        *args, stdout=asyncio.subprocess.PIPE, stderr=asyncio.subprocess.PIPE
    )
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


async def validate_dataset_deno_call(dataset_path, ref, logger=logger):
    """
    Synchronous dataset validation.

    Runs the deno bids-validator process.
    """
    # Sync to packages/openneuro-app/src/scripts/workers/schema.worker.ts
    config_path = Path(__file__).parent / 'assets' / 'validator-config.json'
    # Use an extended schema with datacite.yml allowed for now
    schema_path = Path(__file__).parent / 'assets' / 'schema-1.1.1-datacite.json'
    return await run_and_decode(
        [
            'deno',
            'run',
            '-A',
            f'jsr:@bids/validator@{DENO_VALIDATOR_VERSION}',
            '--config',
            str(config_path),
            '--json',
            dataset_path,
            '--preferredRemote',
            's3-PUBLIC',
            '--blacklistModalities',
            'micr',
            '--datasetTypes',
            'raw,derivative',
            '--schema',
            f'file://{str(schema_path)}',
        ],
        logger=logger,
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
        'variables': {
            'summaryInput': summary,
        },
    }


def issues_mutation(dataset_id, ref, issues, validator_metadata):
    """
    Return the OpenNeuro mutation to update any validation issues.
    """
    # Workaround for bad "affects" values - drop them
    for issue in issues['issues']:
        if 'affects' in issue and not isinstance(issue['affects'], str):
            del issue['affects']
    validatorInput = {
        'datasetId': dataset_id,
        'id': ref,
        'issues': issues['issues'],
        'codeMessages': [
            {'code': key, 'message': value}
            for key, value in issues['codeMessages'].items()
        ],
        'validatorMetadata': validator_metadata,
    }
    return {
        'query': 'mutation ($issues: ValidatorInput!) { updateValidation(validation: $issues) }',
        'variables': {
            'issues': validatorInput,
        },
    }


@broker.task
async def validate_dataset(dataset_id, dataset_path, ref, cookies=None, user=''):
    # New schema validator second in case of issues
    validator_output_deno = await validate_dataset_deno_call(dataset_path, ref)
    if validator_output_deno:
        if 'issues' in validator_output_deno:
            r = requests.post(
                url=GRAPHQL_ENDPOINT,
                json=issues_mutation(
                    dataset_id, ref, validator_output_deno['issues'], DENO_METADATA
                ),
                cookies=cookies,
            )
            if r.status_code != 200 or 'errors' in r.json():
                raise Exception(r.text)
        if 'summary' in validator_output_deno:
            r = requests.post(
                url=GRAPHQL_ENDPOINT,
                json=summary_mutation(
                    dataset_id, ref, validator_output_deno, DENO_METADATA
                ),
                cookies=cookies,
            )
            if r.status_code != 200 or 'errors' in r.json():
                raise Exception(r.text)
