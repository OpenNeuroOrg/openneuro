import json
import os
import subprocess
import requests

from datalad_service.common.celery import app

# TODO - This is hardcoded because it is internal
# for docker-compose. May change for other deployment methods
GRAPHQL_ENDPOINT = 'http://server:8111/crn/graphql'


def setup_validator():
    """Install nodejs deps if they do not exist."""
    if not os.path.exists('./node_modules/.bin/bids-validator'):
        subprocess.run(['yarn'])


def validate_dataset_sync(dataset_path):
    """
    Synchronous dataset validation.

    Runs the bids-validator process and installs node dependencies if needed.
    """
    setup_validator()
    process = subprocess.run(
        ['./node_modules/.bin/bids-validator', '--json', dataset_path], stdout=subprocess.PIPE)
    return json.loads(process.stdout)


def summary_mutation(dataset_id, ref, validator_output):
    """
    Return the OpenNeuro mutation to update a dataset summary.
    """
    return {
        'datasetId': dataset_id,
        'ref': ref,
        'summary': validator_output['summary']
    }


def issues_mutation(dataset_id, ref, validator_output):
    """
    Return the OpenNeuro mutation to update any validation issues.
    """
    issues = validator_output['issues']['warnings'] + validator_output['issues']['errors']
    return {
        'issues': {
            'datasetId': dataset_id,
            'ref': ref,
            'issues': issues
        }
    }


@app.task
def validate_dataset(dataset_id, dataset_path, ref):
    validator_output = validate_dataset_sync(dataset_path)
    if validator_output:
        if 'issues' in validator_output:
            requests.post(
                url=GRAPHQL_ENDPOINT, json=issues_mutation(dataset_id, ref, validator_output))
        if 'summary' in validator_output:
            requests.post(
                url=GRAPHQL_ENDPOINT, json=summary_mutation(dataset_id, ref, validator_output))
    else:
        raise Exception('Validation failed unexpectedly')
