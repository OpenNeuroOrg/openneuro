import falcon
import pytest
import os
import json

from .dataset_fixtures import *

def test_update(celery_app, client, new_dataset):
    key = 'Name'
    value = 'Guthrum'
    body = json.dumps({
        'description_fields': {
            key: value
        }
    })
    
    ds_id = os.path.basename(new_dataset.path)
    update_response = client.simulate_post(
        '/datasets/{}/description'.format(ds_id), body=body)
    assert update_response.status == falcon.HTTP_OK
    updated_ds = json.loads(update_response.content, encoding='utf-8') if update_response.content else None
    assert updated_ds is not None

    check_response = client.simulate_get(
        '/datasets/{}/files/dataset_description.json'.format(ds_id))
    assert check_response.status == falcon.HTTP_OK
    ds_description = json.loads(check_response.content, encoding='utf-8')
    assert ds_description[key] == value


def test_update_with_trailing_newline(celery_app, client, new_dataset):
    preedit_description = '{ "json stuff": "True", "Name": "Uhtred" }\n\n'
    key = 'Name'
    value = 'Guthrum'
    body = json.dumps({
        'description_fields': {
            key: value
        }
    })

    ds_id = os.path.basename(new_dataset.path)
    update_response = client.simulate_post(
        '/datasets/{}/files/dataset_description.json'.format(ds_id), body=preedit_description)
    assert update_response.status == falcon.HTTP_OK
    # Commit files
    response = client.simulate_post(
        '/datasets/{}/draft'.format(ds_id), params={"validate": "false"})
    assert response.status == falcon.HTTP_OK

    update_response = client.simulate_post(
        '/datasets/{}/description'.format(ds_id), body=body)
    assert update_response.status == falcon.HTTP_OK
    updated_ds = json.loads(update_response.content, encoding='utf-8') if update_response.content else None
    assert updated_ds is not None

    check_response = client.simulate_get(
        '/datasets/{}/files/dataset_description.json'.format(ds_id))
    assert check_response.status == falcon.HTTP_OK
    ds_description = json.loads(check_response.content, encoding='utf-8')
    assert ds_description[key] == value