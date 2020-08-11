import requests

from datalad_service.config import GRAPHQL_ENDPOINT
from datalad_service.tasks.validator import validate_dataset


def draft_revision_mutation(dataset_id, ref):
    """Update the draft HEAD reference to an new git commit id (hexsha)."""
    return {
        'query': 'mutation ($datasetId: ID!, $ref: String!) { updateRef(datasetId: $datasetId, ref: $ref) }',
        'variables': {'datasetId': dataset_id, 'ref': ref}
    }


def update_head(ds, dataset_id, cookies=None):
    """Pass HEAD commit references back to OpenNeuro"""
    ref = ds.repo.get_hexsha()
    # We may want to detect if we need to run validation here?
    validate_dataset(dataset_id, ds.path, ref)
    r = requests.post(url=GRAPHQL_ENDPOINT,
                      json=draft_revision_mutation(dataset_id, ref), cookies=cookies)
    if r.status_code != 200:
        raise Exception(r.text)
