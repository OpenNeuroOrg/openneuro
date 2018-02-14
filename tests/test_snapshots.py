import os
import json

import falcon
import pytest

from .dataset_fixtures import *


def test_get_snapshot(client):
    # The main test dataset has one revision we can fetch
    response = client.simulate_get(
        '/datasets/{}/snapshot/{}'.format(DATASET_ID, SNAPSHOT_ID))
    result_doc = json.loads(response.content, encoding='utf-8')

    assert response.status == falcon.HTTP_OK
    assert {'files': ['dataset_description.json'],
            'version': SNAPSHOT_ID} == result_doc


def test_create_snapshot(client, new_dataset):
    ds_id = os.path.basename(new_dataset.path)
    snapshot_id = '1'
    response = client.simulate_post(
        '/datasets/{}/snapshot/{}'.format(ds_id, snapshot_id))
    assert response.status == falcon.HTTP_OK


def test_duplicate_snapshot(client, new_dataset):
    ds_id = os.path.basename(new_dataset.path)
    snapshot_id = '1'
    response = client.simulate_post(
        '/datasets/{}/snapshot/{}'.format(ds_id, snapshot_id))
    assert response.status == falcon.HTTP_OK
    response = client.simulate_post(
        '/datasets/{}/snapshot/{}'.format(ds_id, snapshot_id))
    assert response.status == falcon.HTTP_CONFLICT
