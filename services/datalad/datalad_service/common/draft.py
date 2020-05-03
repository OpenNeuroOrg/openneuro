import requests

from datalad_service.common.celery import dataset_queue
from datalad_service.config import GRAPHQL_ENDPOINT
from datalad_service.tasks.validator import validate_dataset


def draft_revision_mutation(dataset_id, ref):
    """Update the draft HEAD reference to an new git commit id (hexsha)."""
    return {
        'query': 'mutation ($datasetId: ID!, $ref: String!) { updateRef(datasetId: $datasetId, ref: $ref) }',
        'variables': {'datasetId': dataset_id, 'ref': ref}
    }


def update_head(store, dataset):
    """Pass HEAD commit references back to OpenNeuro"""
    ds = store.get_dataset(dataset)
    ref = ds.repo.get_hexsha()
    print('UPDATE REF TO ', ref)
    # We may want to detect if we need to run validation here?
    queue = dataset_queue(dataset)
    validate_dataset.s(dataset, ds.path, ref).apply_async(queue=queue)
    r = requests.post(url=GRAPHQL_ENDPOINT,
                      json=draft_revision_mutation(dataset, ref))
    if r.status_code != 200:
        raise Exception(r.text)
