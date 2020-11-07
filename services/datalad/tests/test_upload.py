import os

import falcon
from falcon import testing

from .dataset_fixtures import *

from datalad_service.handlers.upload_file import skip_invalid_files
from datalad_service.handlers.upload import move_files


def test_upload_file_no_auth(client):
    ds_id = 'ds000001'
    upload_id = '5da16a13-6028-4a53-808e-e828f5f280e5'
    file_data = 'Test dataset README'
    response = client.simulate_post(
        '/uploads/1/{}/{}/README'.format(ds_id, upload_id), body=file_data)
    assert response.status == falcon.HTTP_UNAUTHORIZED


def test_upload_file(client, datalad_store):
    ds_id = 'ds002074'
    upload_id = '5da16a13-6028-4a53-808e-e828f5f280e5'
    file_data = 'Test dataset README for new upload'
    response = client.simulate_post(
        '/uploads/1/{}/{}/README'.format(ds_id, upload_id), body=file_data, headers={'cookie': 'accessToken=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJmZDQ0ZjVjNS1iMjFiLTQyMGItOTU1NS1hZjg1NmVmYzk0NTIiLCJlbWFpbCI6Im5lbGxAc3F1aXNoeW1lZGlhLmNvbSIsInByb3ZpZGVyIjoiZ29vZ2xlIiwibmFtZSI6Ik5lbGwgSGFyZGNhc3RsZSIsImFkbWluIjp0cnVlLCJzY29wZXMiOlsiZGF0YXNldDp1cGxvYWQiXSwiZGF0YXNldCI6ImRzMDAyMDc0IiwiaWF0IjoxNTk3MTgzMDk5LCJleHAiOjEyNDI1NzI3ODA3fQ.1fsa6rZfAOGTmbQ3FJsGZD61tZddqIRAIFpRrAe2Tao'})
    assert response.status == falcon.HTTP_OK
    readme_path = os.path.join(
        datalad_store.get_upload_path(ds_id, upload_id), 'README')
    # Check for the file in the upload bucket
    with open(readme_path) as f:
        assert f.read() == file_data


def test_skip_invalid_files():
    assert skip_invalid_files('.git/HEAD')
    assert skip_invalid_files('.gitattributes')
    assert skip_invalid_files('.heudiconv')
    assert skip_invalid_files('.DS_Store')
    assert skip_invalid_files('sub-01/.DS_Store')
    assert skip_invalid_files('.datalad')
    assert skip_invalid_files('.config')
    assert not skip_invalid_files('dataset_description.json')
    assert not skip_invalid_files('sub-01/anat/sub-01_T1w.nii.gz')
    assert not skip_invalid_files('.bidsignore')


def test_move_files(tmpdir_factory, new_dataset):
    # Create an upload source path
    tmp_dir = tmpdir_factory.mktemp('upload')
    tmp_anat = tmp_dir.join('sub-01', 'anat')
    os.makedirs(tmp_anat)
    with open(os.path.join(tmp_anat, 'sub-01_T1w.json'), 'w') as f:
        f.write('{"dummy": "json"}')
    nifti_path = os.path.join(tmp_anat, 'sub-01_T1w.nii.gz')
    with open(nifti_path, 'w') as f:
        f.write('dummy file.gz')
    # Test moving the files
    move_files(tmp_dir, new_dataset.path)
    new_dataset.save('sub-01')
    # Verify paths exist
    assert os.path.exists(os.path.join(
        new_dataset.path, 'sub-01', 'anat', 'sub-01_T1w.nii.gz'))
    assert os.path.exists(os.path.join(
        new_dataset.path, 'sub-01', 'anat', 'sub-01_T1w.json'))


def test_move_files_nesting(tmpdir_factory, new_dataset):
    # Create an upload source path
    tmp_dir = tmpdir_factory.mktemp('upload')
    with open(tmp_dir.join('.bidsignore'), 'w') as f:
        f.write('derivatives')
    tmp_anat = tmp_dir.join('sub-01', 'anat')
    os.makedirs(tmp_anat)
    with open(os.path.join(tmp_anat, 'sub-01_T1w.json'), 'w') as f:
        f.write('{"dummy": "json"}')
    # add conflicting file to dataset
    anat_path = os.path.join(new_dataset.path, 'sub-01', 'anat')
    nifti_path = os.path.join(anat_path, 'sub-01_T1w.nii.gz')
    os.makedirs(anat_path)
    with open(nifti_path, 'w') as f:
        f.write('dummy file.gz')
    new_dataset.save(nifti_path)
    move_files(tmp_dir, new_dataset.path)
    assert os.path.exists(os.path.join(
        new_dataset.path, 'sub-01', 'anat', 'sub-01_T1w.nii.gz'))
    assert os.path.exists(os.path.join(
        new_dataset.path, 'sub-01', 'anat', 'sub-01_T1w.json'))
