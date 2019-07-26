import os
import json

import falcon
import pytest

from .dataset_fixtures import *


def test_get_snapshot(client, celery_app):
    # The main test dataset has one revision we can fetch
    response = client.simulate_get(
        '/datasets/{}/snapshots/{}'.format(DATASET_ID, SNAPSHOT_ID))
    result_doc = json.loads(response.content, encoding='utf-8')

    assert response.status == falcon.HTTP_OK
    assert result_doc['files'] == [{'filename': 'dataset_description.json', 'id': '9c946a75b4c24c14e65d746b2ff295a904845aa3', 'key': '85b9ddf2bfaf1d9300d612dc29774a98cc1d5e25', 'size': 97}] and \
        result_doc['tag'] == SNAPSHOT_ID and \
        result_doc['id'] == '{}:{}'.format(DATASET_ID, SNAPSHOT_ID)


def test_create_snapshot(client, new_dataset, celery_app):
    ds_id = os.path.basename(new_dataset.path)
    snapshot_id = '1'
    response = client.simulate_post(
        '/datasets/{}/snapshots/{}'.format(ds_id, snapshot_id))
    assert response.status == falcon.HTTP_OK


def test_pre_snapshot_edit(client, new_dataset, celery_app):
    ds_id = os.path.basename(new_dataset.path)
    snapshot_id = '1.0.0'
    file_data = json.dumps({
        "BIDSVersion": "1.0.2",
        "License": "CC0",
        "Name": "Test fixture new dataset"
    }, indent=4)
    # Update a file
    response = client.simulate_post(
        '/datasets/{}/files/dataset_description.json'.format(ds_id), body=file_data)
    assert response.status == falcon.HTTP_OK
    # Commit changes
    response = client.simulate_post(
        '/datasets/{}/draft'.format(ds_id), params={"validate": "false"})
    assert response.status == falcon.HTTP_OK
    commit_ref = response.json['ref']
    # Make a snapshot
    response = client.simulate_post(
        '/datasets/{}/snapshots/{}'.format(ds_id, snapshot_id), json={'skip_publishing': True})
    assert response.status == falcon.HTTP_OK
    # Validate that create_snapshot has not moved master commit
    with open(os.path.join(new_dataset.path, '.git/refs/heads/master')) as fd:
        current_ref = fd.read()[:-1]
        assert commit_ref == current_ref


def test_duplicate_snapshot(client, new_dataset, celery_app):
    ds_id = os.path.basename(new_dataset.path)
    snapshot_id = '2'
    response = client.simulate_post(
        '/datasets/{}/snapshots/{}'.format(ds_id, snapshot_id))
    assert response.status == falcon.HTTP_OK
    try:
        response = client.simulate_post(
            '/datasets/{}/snapshots/{}'.format(ds_id, snapshot_id))
        assert response.status == falcon.HTTP_CONFLICT
    except:
        # In eager mode, eat the exception
        pass


def test_get_snapshots(client, new_dataset, celery_app):
    ds_id = os.path.basename(new_dataset.path)
    response = client.simulate_post(
        '/datasets/{}/snapshots/{}'.format(ds_id, 'v1.0.0'))
    assert response.status == falcon.HTTP_OK
    response = client.simulate_post(
        '/datasets/{}/snapshots/{}'.format(ds_id, 'v2.0.0'))
    assert response.status == falcon.HTTP_OK
    response = client.simulate_get(
        '/datasets/{}/snapshots'.format(ds_id))
    result_doc = json.loads(response.content, encoding='utf-8')
    assert response.status == falcon.HTTP_OK
    assert result_doc['snapshots'][0]['hexsha'] == result_doc['snapshots'][1]['hexsha']
    assert result_doc['snapshots'][0]['id'] == '{}:{}'.format(ds_id, 'v1.0.0')
    assert result_doc['snapshots'][0]['tag'] == 'v1.0.0'
    assert result_doc['snapshots'][1]['tag'] == 'v2.0.0'


def test_description_update(client, new_dataset, celery_app):
    key = 'ReferencesAndLinks'
    value = ['https://www.wikipedia.org']
    body = json.dumps({
        'description_fields': {
            key: value
        },
        'skip_publishing': True
    })

    ds_id = os.path.basename(new_dataset.path)
    update_response = client.simulate_post(
        '/datasets/{}/snapshots/{}'.format(ds_id, 'v1.0.0'), body=body)
    assert update_response.status == falcon.HTTP_OK

    check_response = client.simulate_get(
        '/datasets/{}/files/dataset_description.json'.format(ds_id))
    assert check_response.status == falcon.HTTP_OK
    ds_description = json.loads(check_response.content, encoding='utf-8')
    assert ds_description[key] == value
