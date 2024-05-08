import os
import json
import uuid

import falcon
from datalad.api import Dataset

from datalad_service.tasks.snapshots import write_new_changes
from datalad_service.common.git import git_show


def test_get_snapshot(client):
    # The main test dataset has one revision we can fetch
    response = client.simulate_get(
        '/datasets/{}/snapshots/{}'.format('ds000001', '000001'))
    result_doc = json.loads(response.content)

    for f in result_doc['files']:
        print(f['filename'], f['urls'])
    assert response.status == falcon.HTTP_OK
    assert result_doc['files'] == [
        {'filename': 'CHANGES', 'size': 41, 'id': '0daaa69260ab1f1fa8cfd0e17a4c1993d6d46e54',
         'key': '63f4f8294caf64dccfedcb5300dee70e3fe3a7c5', 'urls': ['http://localhost:9876/crn/datasets/ds000001/objects/63f4f8294caf64dccfedcb5300dee70e3fe3a7c5'],
         'annexed': False, 'directory': False},
        {'filename': 'dataset_description.json', 'size': 97, 'id': '9c946a75b4c24c14e65d746b2ff295a904845aa3',
         'key': '85b9ddf2bfaf1d9300d612dc29774a98cc1d5e25', 'urls': ['http://localhost:9876/crn/datasets/ds000001/objects/85b9ddf2bfaf1d9300d612dc29774a98cc1d5e25'],
         'annexed': False, 'directory': False}
    ]
    assert result_doc['tag'] == '000001'
    assert result_doc['id'] == '{}:{}'.format('ds000001', '000001')
    assert type(result_doc['created']) == int
    assert type(result_doc['hexsha']) == str
    assert len(result_doc['hexsha']) == 40


def test_create_snapshot(client, new_dataset):
    ds_id = os.path.basename(new_dataset.path)
    snapshot_id = '1'
    response = client.simulate_post(
        f'/datasets/{ds_id}/snapshots/{snapshot_id}', body="")
    assert response.status == falcon.HTTP_OK


def test_create_snapshot_no_config(datalad_store, client, new_dataset):
    """Validate adding a datalad config if one is missing during snapshot creation"""
    ds_id = os.path.basename(new_dataset.path)
    snapshot_id = '1'
    # Delete the default config first
    response = client.simulate_delete('/datasets/{}/files'.format(
        ds_id), body='{ "filenames": [".datalad/config"] }')
    assert response.status == falcon.HTTP_OK
    assert json.loads(response.content)['deleted'] == [
        '.datalad/config']
    ds = Dataset(os.path.join(datalad_store.annex_path, ds_id))
    assert ds.id is None
    ds.close()
    # Try to snapshot now
    response = client.simulate_post(
        f'/datasets/{ds_id}/snapshots/{snapshot_id}', body="")
    assert response.status == falcon.HTTP_OK
    # Verify the dataset now has an ID
    ds = Dataset(os.path.join(datalad_store.annex_path, ds_id))
    assert ds.id is not None
    try:
        uuid.UUID(ds.id, version=4)
    except ValueError:
        assert False, "datalad id is not a valid uuid4"


def test_pre_snapshot_edit(client, new_dataset):
    ds_id = os.path.basename(new_dataset.path)
    snapshot_id = '1.0.0'
    file_data = json.dumps({
        "BIDSVersion": "1.0.2",
        "License": "CC0",
        "Name": "Test fixture new dataset"
    }, indent=4)
    # Update a file
    response = client.simulate_post(
        f'/datasets/{ds_id}/files/dataset_description.json', body=file_data)
    assert response.status == falcon.HTTP_OK
    # Commit changes
    response = client.simulate_post(
        f'/datasets/{ds_id}/draft', params={"validate": "false"})
    assert response.status == falcon.HTTP_OK
    commit_ref = response.json['ref']
    # Make a snapshot
    response = client.simulate_post(
        f'/datasets/{ds_id}/snapshots/{snapshot_id}', json={'skip_publishing': True})
    assert response.status == falcon.HTTP_OK
    # Validate that create_snapshot has not moved main commit
    with open(os.path.join(new_dataset.path, '.git/refs/heads/main')) as fd:
        current_ref = fd.read()[:-1]
        assert commit_ref == current_ref


def test_duplicate_snapshot(client, new_dataset):
    ds_id = os.path.basename(new_dataset.path)
    snapshot_id = '2'
    # body = json.dumps({
    #     'snapshot_changes': ['test']
    # })
    response = client.simulate_post(
        f'/datasets/{ds_id}/snapshots/{snapshot_id}')
    assert response.status == falcon.HTTP_OK
    try:
        response = client.simulate_post(
            f'/datasets/{ds_id}/snapshots/{snapshot_id}')
        assert response.status == falcon.HTTP_CONFLICT
    except:
        # In eager mode, eat the exception
        pass


def test_get_snapshots(client, new_dataset):
    ds_id = os.path.basename(new_dataset.path)
    # body = json.dumps({
    #     'snapshot_changes': ['test']
    # })
    response = client.simulate_post(
        '/datasets/{}/snapshots/{}'.format(ds_id, 'v1.0.0'))
    assert response.status == falcon.HTTP_OK
    response = client.simulate_post(
        '/datasets/{}/snapshots/{}'.format(ds_id, 'v2.0.0'))
    assert response.status == falcon.HTTP_OK
    response = client.simulate_get(
        f'/datasets/{ds_id}/snapshots')
    result_doc = json.loads(response.content)
    assert response.status == falcon.HTTP_OK
    assert result_doc['snapshots'][0]['hexsha'] == result_doc['snapshots'][1]['hexsha']
    assert result_doc['snapshots'][0]['id'] == '{}:{}'.format(ds_id, 'v1.0.0')
    assert result_doc['snapshots'][0]['tag'] == 'v1.0.0'
    assert result_doc['snapshots'][1]['tag'] == 'v2.0.0'


def test_description_update(client, new_dataset):
    key = 'ReferencesAndLinks'
    value = ['https://www.wikipedia.org']
    body = json.dumps({
        'description_fields': {
            key: value
        },
        'snapshot_changes': [
            'change'
        ],
        'skip_publishing': True
    })

    ds_id = os.path.basename(new_dataset.path)
    update_response = client.simulate_post(
        '/datasets/{}/snapshots/{}'.format(ds_id, 'v1.0.0'), body=body)
    assert update_response.status == falcon.HTTP_OK

    check_response = client.simulate_get(
        f'/datasets/{ds_id}/files/dataset_description.json')
    assert check_response.status == falcon.HTTP_OK
    ds_description = json.loads(check_response.content)
    assert ds_description[key] == value


def test_write_new_changes(datalad_store, new_dataset):
    ds_id = os.path.basename(new_dataset.path)
    write_new_changes(new_dataset.path, '1.0.1', [
                      'Some changes'], '2019-01-01')
    # Manually make the commit without validation
    new_dataset.save('CHANGES')
    # Get a fresh dataset object and verify correct CHANGES
    dataset = Dataset(os.path.join(datalad_store.annex_path, ds_id))
    assert not dataset.repo.dirty
    assert git_show(dataset.path, 'HEAD', 'CHANGES') == '''1.0.1 2019-01-01
  - Some changes
1.0.0 2018-01-01
  - Initial version
'''


def test_write_with_empty_changes(datalad_store, new_dataset):
    ds_id = os.path.basename(new_dataset.path)
    new_dataset.remove('CHANGES')
    write_new_changes(new_dataset.path, '1.0.1', [
                      'Some changes'], '2019-01-01')
    # Manually make the commit without validation
    new_dataset.save('CHANGES')
    # Get a fresh dataset object and verify correct CHANGES
    dataset = Dataset(os.path.join(datalad_store.annex_path, ds_id))
    assert not dataset.repo.dirty
    assert git_show(dataset.path, 'HEAD', 'CHANGES') == '''1.0.1 2019-01-01
  - Some changes
'''
