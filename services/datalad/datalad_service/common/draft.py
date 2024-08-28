import asyncio
import requests

from datalad_service.config import GRAPHQL_ENDPOINT
from datalad_service.tasks.validator import validate_dataset


def draft_revision_mutation(dataset_id, ref):
    """Update the draft HEAD reference to an new git commit id (hexsha)."""
    return {
        'query': 'mutation ($datasetId: ID!, $ref: String!) { updateRef(datasetId: $datasetId, ref: $ref) }',
        'variables': {'datasetId': dataset_id, 'ref': ref}
    }
