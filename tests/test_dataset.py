import json

import falcon
import pytest

from .dataset_fixtures import *


def test_get_dataset(client):
    doc = {
        'accession_number': DATASET_ID
    }

    response = client.simulate_get('/datasets/{}'.format(DATASET_ID))
    result_doc = json.loads(response.content, encoding='utf-8')

    assert doc == result_doc
    assert response.status == falcon.HTTP_OK


def test_get_dataset_404(client):
    response = client.simulate_get('/datasets/dsdoesntexist')
    assert response.status == falcon.HTTP_NOT_FOUND


def test_create_dataset_duplicate(celery_app, client, annex_path):
    ds_id = 'ds000003'
    first_response = client.simulate_post('/datasets/{}'.format(ds_id))
    assert first_response.status == falcon.HTTP_OK
    second_response = client.simulate_post('/datasets/{}'.format(ds_id))
    assert second_response.status == falcon.HTTP_CONFLICT
