import os
import falcon
from falcon import testing
import json
import pytest
from datalad.api import Dataset

from .dataset_fixtures import *


def test_get_file(client):
    ds_id = 'ds000001'
    result = client.simulate_get(
        '/datasets/{}/files/dataset_description.json'.format(ds_id), file_wrapper=FileWrapper)
    content_len = int(result.headers['content-length'])
    assert content_len == len(result.content)
    assert json.loads(result.content)['BIDSVersion'] == '1.0.2'


def test_get_missing_file(client):
    ds_id = 'ds000001'
    result = client.simulate_get(
        '/datasets/{}/files/thisdoesnotexist.json'.format(ds_id), file_wrapper=FileWrapper)
    assert result.status == falcon.HTTP_NOT_FOUND


def test_add_file(client, datalad_store):
    ds_id = 'ds000001'
    file_data = 'Test dataset README'
    response = client.simulate_post(
        '/datasets/{}/files/README'.format(ds_id), body=file_data)
    assert response.status == falcon.HTTP_OK
    # Load the dataset to check for this file
    ds_obj = Dataset(os.path.join(datalad_store.annex_path, ds_id))
    test_files = ds_obj.get('README')
    assert test_files
    assert len(test_files) == 1
    with open(test_files.pop()['path']) as f:
        assert f.read() == file_data


def test_add_existing_file(client):
    ds_id = 'ds000001'
    file_data = 'should update'
    response = client.simulate_post(
        '/datasets/{}/files/dataset_description.json'.format(ds_id), body=file_data)
    assert response.status == falcon.HTTP_OK


def test_add_directory_path(client):
    ds_id = 'ds000001'
    file_data = 'complex path test'
    response = client.simulate_post(
        '/datasets/{}/files/sub-01:fake-image.nii'.format(ds_id), body=file_data)
    assert response.status == falcon.HTTP_OK


def test_update_file(client, datalad_store):
    ds_id = 'ds000001'
    file_data = 'Test dataset LICENSE'
    # First post a file
    response = client.simulate_post(
        '/datasets/{}/files/LICENSE'.format(ds_id), body=file_data)
    assert response.status == falcon.HTTP_OK
    response = client.simulate_post('/datasets/{}/draft'.format(ds_id))
    assert response.status == falcon.HTTP_OK
    # Then update it
    file_data = 'New test LICENSE'
    response = client.simulate_post(
        '/datasets/{}/files/LICENSE'.format(ds_id), body=file_data)
    assert response.status == falcon.HTTP_OK
    # Load the dataset to check for the updated file
    ds_obj = Dataset(os.path.join(datalad_store.annex_path, ds_id))
    test_files = ds_obj.get('LICENSE')
    assert test_files
    assert len(test_files) == 1
    with open(test_files.pop()['path']) as f:
        assert f.read() == file_data


def test_file_indexing(client, new_dataset):
    ds_id = os.path.basename(new_dataset.path)
    # First post a couple test files
    response = client.simulate_post(
        '/datasets/{}/files/LICENSE'.format(ds_id), body='GPL V3.0')
    assert response.status == falcon.HTTP_OK
    response = client.simulate_post(
        '/datasets/{}/files/sub-01:anat:sub-01_T1w.nii.gz'.format(ds_id), body='fMRI data goes here')
    assert response.status == falcon.HTTP_OK
    # Commit draft
    response = client.simulate_post('/datasets/{}/draft'.format(ds_id))
    assert response.status == falcon.HTTP_OK
    # Get the files in the committed tree
    response = client.simulate_get('/datasets/{}/files'.format(ds_id))
    assert response.status == falcon.HTTP_OK
    response_content = json.loads(response.content)
    print('response content:', response_content['files'])
    print('not annexed files:', new_dataset.repo.is_under_annex(
        ['dataset_description.json']))
    assert all(f in response_content['files'] for f in [
        {'filename': 'dataset_description.json', 'size': 101,
            'id': '43502da40903d08b18b533f8897330badd6e1da3',
            'key': '838d19644b3296cf32637bbdf9ae5c87db34842f', 'urls': []},
        {'filename': 'LICENSE', 'size': 8,
            'id': '8a6f5281317d8a8fb695d12c940b0ff7a7dee435',
            'key': 'MD5E-s8--4d87586dfb83dc4a5d15c6cfa6f61e27', 'urls': []},
        {'filename': 'sub-01/anat/sub-01_T1w.nii.gz',
            'id': '7fa0e07afaec0ff2cdf1bfc783596b4472df9b12',
            'key': 'MD5E-s19--8149926e49b677a5ccecf1ad565acccf.nii.gz', 'size': 19, 'urls': []}
    ])


def test_empty_file(client, new_dataset):
    """Catch any regressions for 0 length files."""
    ds_id = os.path.basename(new_dataset.path)
    # Post an empty file
    response = client.simulate_post(
        '/datasets/{}/files/LICENSE'.format(ds_id), body='')
    assert response.status == falcon.HTTP_OK
    # Commit files
    response = client.simulate_post(
        '/datasets/{}/draft'.format(ds_id), params={"validate": "false"})
    assert response.status == falcon.HTTP_OK
    # Get the files in the committed tree
    response = client.simulate_get('/datasets/{}/files'.format(ds_id))
    assert response.status == falcon.HTTP_OK
    response_content = json.loads(response.content)
    # Check that all elements exist in both lists
    assert({'filename': 'LICENSE',
            'id': '5bfdc52581371bfa051fa76825a0e1b5e5c3b4bf',
            'key': 'MD5E-s0--d41d8cd98f00b204e9800998ecf8427e', 'size': 0, 'urls': []} in response_content['files'])
    assert({'filename': 'dataset_description.json',
            'id': '43502da40903d08b18b533f8897330badd6e1da3',
            'key': '838d19644b3296cf32637bbdf9ae5c87db34842f', 'size': 101, 'urls': []} in response_content['files'])


def test_duplicate_file_id(client, new_dataset):
    ds_id = os.path.basename(new_dataset.path)
    file_body = '{}'
    # Post the same file in two paths
    response = client.simulate_post(
        '/datasets/{}/files/derivatives:one.json'.format(ds_id), body=file_body)
    assert response.status == falcon.HTTP_OK
    response = client.simulate_post(
        '/datasets/{}/files/derivatives:two.json'.format(ds_id), body=file_body)
    assert response.status == falcon.HTTP_OK
    # Commit files
    response = client.simulate_post(
        '/datasets/{}/draft'.format(ds_id), params={"validate": "false"})
    assert response.status == falcon.HTTP_OK
    response = client.simulate_get('/datasets/{}/files'.format(ds_id))
    assert response.status == falcon.HTTP_OK
    response_content = json.loads(response.content)
    # Find each file in the results
    file_one = next(
        (f for f in response_content['files'] if f['filename'] == 'derivatives/one.json'), None)
    file_two = next(
        (f for f in response_content['files'] if f['filename'] == 'derivatives/two.json'), None)
    # Validate they have differing ids
    assert file_one['id'] != file_two['id']


def test_untracked_file_index(client, new_dataset):
    ds_id = os.path.basename(new_dataset.path)
    # Post test file
    response = client.simulate_post(
        '/datasets/{}/files/LICENSE'.format(ds_id), body='GPL V3.0')
    assert response.status == falcon.HTTP_OK
    # Don't commit and check index
    response = client.simulate_get(
        '/datasets/{}/files'.format(ds_id), params={"untracked": True})
    assert response.status == falcon.HTTP_OK
    assert 'files' in response.json
    assert len(response.json['files']) == 3
    for f in response.json['files']:
        if f['filename'] == 'dataset_description.json':
            assert f['size'] == 101
        elif f['filename'] == 'LICENSE':
            assert f['size'] == 8
        elif f['filename'] == 'CHANGES':
            assert f['size'] == 37
        else:
            assert False


def test_untracked_dir_index(client, new_dataset):
    ds_id = os.path.basename(new_dataset.path)
    # Post test file
    response = client.simulate_post(
        '/datasets/{}/files/LICENSE'.format(ds_id), body='GPL V3.0')
    assert response.status == falcon.HTTP_OK
    # Post test directory and file
    response = client.simulate_post(
        '/datasets/{}/files/sub-01:anat:sub-01_T1w.nii.gz'.format(ds_id), body='fMRI data goes here')
    # Don't commit and check index
    response = client.simulate_get(
        '/datasets/{}/files'.format(ds_id), params={"untracked": True})
    assert response.status == falcon.HTTP_OK
    assert 'files' in response.json
    assert len(response.json['files']) == 4
    for f in response.json['files']:
        if f['filename'] == 'dataset_description.json':
            assert f['size'] == 101
        elif f['filename'] == 'LICENSE':
            assert f['size'] == 8
        elif f['filename'] == 'sub-01/anat/sub-01_T1w.nii.gz':
            assert f['size'] == 19
        elif f['filename'] == 'CHANGES':
            assert f['size'] == 37
        else:
            assert False

def test_delete_file(client, new_dataset):
    ds_id = os.path.basename(new_dataset.path)
    response = client.simulate_delete('/datasets/{}/files'.format(ds_id), body='{ "filenames": ["dataset_description.json", "CHANGES"] }')
    assert response.status == falcon.HTTP_OK
    print(response.content)
    assert json.loads(response.content)['deleted'] == ['dataset_description.json', 'CHANGES']

def test_delete_non_existing_file(client, new_dataset):
    ds_id = os.path.basename(new_dataset.path)
    response = client.simulate_delete('/datasets/{}/files'.format(ds_id), body='{ "filenames": ["fake", "test"]}')
    assert response.status == falcon.HTTP_OK
    print(response.content)
    assert json.loads(response.content)['error'] == 'the following files not found: fake, test'
