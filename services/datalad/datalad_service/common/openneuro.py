import requests

from datalad_service.config import GRAPHQL_ENDPOINT


def cache_clear_mutation(dataset_id, tag):
    """Update the draft HEAD reference to an new git commit id (hexsha)."""
    return {
        'query': 'mutation ($datasetId: ID!) { cacheClear(datasetId: $datasetId, tag: $tag) }',
        'variables': {'datasetId': dataset_id, 'tag': tag},
    }


def clear_dataset_cache(dataset, tag, cookies={}):
    """Post a cacheClear event to OpenNeuro to allow the API to query new data after changes"""
    r = requests.post(
        url=GRAPHQL_ENDPOINT, json=cache_clear_mutation(dataset, tag), cookies=cookies
    )
    if r.status_code != 200:
        raise Exception(r.text)
