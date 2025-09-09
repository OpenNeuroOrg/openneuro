import requests
from pathlib import Path
import jwt
import logging
from datetime import datetime, timedelta, timezone

from datalad_service.config import GRAPHQL_ENDPOINT, get_jwt_secret


def generate_service_token(dataset_id):
    utc_now = datetime.now(timezone.utc)
    one_day_ahead = utc_now + timedelta(hours=24)
    return jwt.encode(
        {
            'sub': 'dataset-worker',
            'iat': int(utc_now.timestamp()),
            'exp': int(one_day_ahead.timestamp()),
            'scopes': ['dataset:worker'],
            'dataset': dataset_id,
        },
        get_jwt_secret(),
        algorithm='HS256',
    )


def cache_clear_mutation(dataset_id, tag):
    """Update the draft HEAD reference to an new git commit id (hexsha)."""
    return {
        'query': 'mutation ($datasetId: ID!) { cacheClear(datasetId: $datasetId, tag: $tag) }',
        'variables': {'datasetId': dataset_id, 'tag': tag},
    }


def clear_dataset_cache(dataset_id, tag):
    """Post a cacheClear event to OpenNeuro to allow the API to query new data after changes"""
    r = requests.post(
        url=GRAPHQL_ENDPOINT,
        json=cache_clear_mutation(dataset_id, tag),
        headers={'authorization': f'Bearer {generate_service_token(dataset_id)}'},
    )
    if r.status_code != 200:
        raise Exception(r.text)


def update_file_check(dataset_path, commit, references, bad_files, remote=None):
    """Post results of git-annex fsck to graphql endpoint."""
    dataset_id = Path(dataset_path).name
    try:
        post_body = {
            'query': 'mutation updateFileCheck($datasetId: ID!, $hexsha: String!, $refs: [String!]!, $annexFsck: [AnnexFsckInput!]!) { updateFileCheck(datasetId: $datasetId, hexsha: $hexsha, refs: $refs, annexFsck: $annexFsck) { datasetId, hexsha } }',
            'variables': {
                'datasetId': dataset_id,
                'hexsha': str(commit.id),
                'refs': references,
                'annexFsck': bad_files,
            },
            'operationName': 'updateFileCheck',
        }
        if remote:
            post_body['variables']['remote'] = remote
        req = requests.post(
            url=GRAPHQL_ENDPOINT,
            json=post_body,
            headers={'authorization': f'Bearer {generate_service_token(dataset_id)}'},
        )
        req.raise_for_status()
        try:
            json_response = req.json()
            if 'errors' in json_response:
                logging.error(json_response['errors'])
        except requests.exceptions.JSONDecodeError:
            logging.error(req.text)
    except requests.exceptions.HTTPError as e:
        logging.error(e)
        logging.error(req.text)
