import requests
from pathlib import Path
import jwt
import logging

from datalad_service.config import GRAPHQL_ENDPOINT, JWT_SECRET


def generate_service_token():
    return jwt.encode(
        {'sub': 'dataset-worker', 'admin': True}, JWT_SECRET, algorithm='HS256'
    )


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


def update_file_check(dataset_path, commit, references, bad_files, remote=None):
    """Post results of git-annex fsck to graphql endpoint."""
    dataset_id = Path(dataset_path).name
    try:
        post_body = {
            'query': 'mutation ($datasetId: ID!, $hexsha: String!, $refs: [String!]!, $annexFsck: [AnnexFsckInput!]!) { updateFileCheck(datasetId: $datasetId, hexsha: $hexsha, refs: $refs, annexFsck: $annexFsck) { datasetId, hexsha } }',
            'variables': {
                'datasetId': dataset_id,
                'hexsha': str(commit.id),
                'refs': references,
                'annexFsck': bad_files,
            },
        }
        if remote:
            post_body['variables']['remote'] = remote
        req = requests.post(
            url=GRAPHQL_ENDPOINT,
            json=post_body,
            headers={'Authorization': f'Bearer {generate_service_token()}'},
        )
        req.raise_for_status()
    except requests.exceptions.HTTPError as e:
        logging.error(e)
        logging.error(req.text)
