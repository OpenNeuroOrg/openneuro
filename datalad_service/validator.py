import json
import os
import subprocess
import requests

from datalad_service.common.celery import app


def setup_validator():
    """Install nodejs deps if they do not exist."""
    if not os.path.exists('./node_modules/.bin/bids-validator'):
        subprocess.run(['yarn'])


def validate_dataset(dataset_path):
    """
    Synchrounous dataset validation.

    Runs the bids-validator process and installs node dependencies if needed.
    """
    setup_validator()
    process = subprocess.run(
        ['./node_modules/.bin/bids-validator', '--json', dataset_path], stdout=subprocess.PIPE)
    return process.stdout


def mutation(dataset_id, ref, raw_validation):
    """
    Return the OpenNeuro mutation to update validation with collected results.

    updateValidation(datasetId: ID!, ref: String!, summary: Summary, issues: [ValidationIssue])
    """
    validations = {
        'datasetId': dataset_id,
        'ref': ref,
        'summary': raw_validation.summary,
        'issues': raw_validation.warnings + raw_validation.errors
    }
    return validations


@app.task
def validate_dataset_async(dataset_id, dataset_path, ref):
    output = validate_dataset(dataset_path)
    if output:
        # TODO - This is hardcoded because it is internal
        # for docker-compose. May change for other deployment methods
        request = requests.post(
            url='http://server/crn/graphql', json=mutation(dataset_id, ref, output))
        return request
    else:
        raise Exception('Validation failed unexpectedly')
