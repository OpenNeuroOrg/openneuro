import requests

from datalad_service.config import GRAPHQL_ENDPOINT


def log_git_event(dataset_id, commit, reference, token):
    """Log git event to API"""
    query = """
        mutation createGitEvent($datasetId: ID!, $reference: String!, $commit: String!) {
            createGitEvent(datasetId: $datasetId, reference: $reference, commit: $commit) {
                id
            }
        }
    """
    variables = {'datasetId': dataset_id, 'reference': reference, 'commit': commit}
    try:
        requests.post(
            GRAPHQL_ENDPOINT,
            json={'query': query, 'variables': variables},
            headers={'Authorization': f'Bearer {token}'},
        )
    except Exception as e:
        print(f'Error logging git event: {e}')
