import json

import falcon
import pytest


def test_get_dataset(client):
    doc = {
        'accession_number': 'ds000001'
    }

    response = client.simulate_get('/datasets/{}'.format('ds000001'))
    result_doc = json.loads(response.content)

    assert doc == result_doc
    assert response.status == falcon.HTTP_OK


def test_get_dataset_404(client):
    response = client.simulate_get('/datasets/dsdoesntexist')
    assert response.status == falcon.HTTP_NOT_FOUND


def test_create_dataset_duplicate(client, datalad_store):
    ds_id = 'ds000003'
    first_response = client.simulate_post(f'/datasets/{ds_id}')
    assert first_response.status == falcon.HTTP_OK
    second_response = client.simulate_post(f'/datasets/{ds_id}')
    assert second_response.status == falcon.HTTP_CONFLICT
