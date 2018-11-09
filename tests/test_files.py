import falcon
from falcon import testing
import json
import pytest
from datalad.api import Dataset

from .dataset_fixtures import *


def test_get_file(client, celery_app):
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


def test_add_file(client, annex_path):
    ds_id = 'ds000001'
    file_data = 'Test dataset README'
    response = client.simulate_post(
        '/datasets/{}/files/README'.format(ds_id), body=file_data)
    assert response.status == falcon.HTTP_OK
    # Load the dataset to check for this file
    ds_obj = Dataset(str(annex_path.join(ds_id)))
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


def test_update_file(celery_app, client, annex_path):
    ds_id = 'ds000001'
    file_data = 'Test dataset LICENSE'
    # First post a file
    response = client.simulate_post(
        '/datasets/{}/files/LICENSE'.format(ds_id), body=file_data)
    assert response.status == falcon.HTTP_OK
    # Then update it
    file_data = 'New test LICENSE'
    response = client.simulate_put(
        '/datasets/{}/files/LICENSE'.format(ds_id), body=file_data)
    assert response.status == falcon.HTTP_OK
    # Load the dataset to check for the updated file
    ds_obj = Dataset(str(annex_path.join(ds_id)))
    test_files = ds_obj.get('LICENSE')
    assert test_files
    assert len(test_files) == 1
    with open(test_files.pop()['path']) as f:
        assert f.read() == file_data


def test_update_missing_file(celery_app, client):
    ds_id = 'ds000001'
    file_data = 'File that does not exist'
    # First post a file
    response = client.simulate_put(
        '/datasets/{}/files/NEWFILE'.format(ds_id), body=file_data)
    assert response.status == falcon.HTTP_NOT_FOUND


def test_file_indexing(celery_app, client, new_dataset):
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
            'id': '838d19644b3296cf32637bbdf9ae5c87db34842f'},
        {'filename': 'LICENSE', 'size': 8,
            'id': 'MD5E-s8--4d87586dfb83dc4a5d15c6cfa6f61e27'},
        {'filename': 'sub-01/anat/sub-01_T1w.nii.gz',
            'id': 'MD5E-s19--8149926e49b677a5ccecf1ad565acccf.nii.gz', 'size': 19}
    ])


def test_empty_file(celery_app, client, new_dataset):
    """Catch any regressions for 0 length files."""
    ds_id = os.path.basename(new_dataset.path)
    # Post an empty file
    response = client.simulate_post(
        '/datasets/{}/files/LICENSE'.format(ds_id), body='')
    assert response.status == falcon.HTTP_OK
    # Get the files in the committed tree
    response = client.simulate_get('/datasets/{}/files'.format(ds_id))
    assert response.status == falcon.HTTP_OK
    response_content = json.loads(response.content)
    # Check that all elements exist in both lists
    assert all(f in response_content['files'] for f in [
        {'filename': 'dataset_description.json',
            'id': '838d19644b3296cf32637bbdf9ae5c87db34842f', 'size': 101},
        {'filename': 'LICENSE',
            'id': 'e69de29bb2d1d6434b8b29ae775ad8c2e48c5391', 'size': 0}
    ])


def test_duplicate_file_id(celery_app, client, new_dataset):
    ds_id = os.path.basename(new_dataset.path)
    file_body = '{}'
    # Post the same file in two paths
    response = client.simulate_post(
        '/datasets/{}/files/derivatives:one.json'.format(ds_id), body=file_body)
    assert response.status == falcon.HTTP_OK
    response = client.simulate_post(
        '/datasets/{}/files/derivatives:two.json'.format(ds_id), body=file_body)
    assert response.status == falcon.HTTP_OK
    response = client.simulate_get('/datasets/{}/files'.format(ds_id))
    assert response.status == falcon.HTTP_OK
    response_content = json.loads(response.content)
    # Find each file in the results
    file_one = next((f for f in response_content['files'] if f['filename'] == 'derivatives/one.json'), None)
    file_two = next((f for f in response_content['files'] if f['filename'] == 'derivatives/two.json'), None)
    # Validate they have differing ids
    assert file_one['id'] != file_two['id']


def test_untracked_file_index(celery_app, client, new_dataset):
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
    assert len(response.json['files']) == 2
    for f in response.json['files']:
        if f['filename'] == 'dataset_description.json':
            assert f['size'] == 101
        elif f['filename'] == 'LICENSE':
            assert f['size'] == 8
        else:
            assert False


def test_untracked_dir_index(celery_app, client, new_dataset):
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
    assert len(response.json['files']) == 3
    for f in response.json['files']:
        if f['filename'] == 'dataset_description.json':
            assert f['size'] == 101
        elif f['filename'] == 'LICENSE':
            assert f['size'] == 8
        elif f['filename'] == 'sub-01/anat/sub-01_T1w.nii.gz':
            assert f['size'] == 19
        else:
            assert False
