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
    summary = validator_output['summary']
    summary['datasetId'] = dataset_id
    # Set the object id to the git sha256 ref
    summary['id'] = ref
    return {
        'query': 'mutation ($summaryInput: SummaryInput!) { updateSummary(summary: $summaryInput) { id } }',
        'variables':
            {
                'summaryInput': summary
            }
    }


def issues_mutation(dataset_id, ref, validator_output):
    """
    Return the OpenNeuro mutation to update any validation issues.
    """
    all_issues = validator_output['issues']['warnings'] + \
        validator_output['issues']['errors']
    for issue in all_issues:
        # Remove extra stats to keep collection size down
        if 'files' in issue:
            for f in issue['files']:
                if f.get('file'):
                    if f['file'].get('stats'):
                        del f['file']['stats']
    issues = {
        'datasetId': dataset_id,
        'id': ref,
        'issues': all_issues
    }
    return {
        'query': 'mutation ($issues: ValidationInput!) { updateValidation(validation: $issues) }',
        'variables':
            {
                'issues': issues
            }
    }


@app.task
def validate_dataset(dataset_id, dataset_path, ref, cookies=None):
    validator_output = validate_dataset_sync(dataset_path)
    if validator_output:
        if 'issues' in validator_output:
            r = requests.post(
                url=GRAPHQL_ENDPOINT, json=issues_mutation(dataset_id, ref, validator_output), cookies=cookies)
            if r.status_code != 200:
                raise Exception(r.text)
        if 'summary' in validator_output:
            r = requests.post(
                url=GRAPHQL_ENDPOINT, json=summary_mutation(dataset_id, ref, validator_output), cookies=cookies)
            if r.status_code != 200:
                raise Exception(r.text)
    else:
        raise Exception('Validation failed unexpectedly')
