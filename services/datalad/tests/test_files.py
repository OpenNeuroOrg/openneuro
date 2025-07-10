import os
import falcon
from falcon import testing
import json
from datalad.api import Dataset

from datalad_service.tasks.files import parse_s3_annex_url


class FileWrapper:
    def __init__(self, file_like, block_size=8192):
        self.file_like = file_like
        self.block_size = block_size

    def __getitem__(self, key):
        data = self.file_like.read(self.block_size)
        if data:
            return data

        raise IndexError


def test_get_file(client):
    ds_id = 'ds000001'
    result = client.simulate_get(
        f'/datasets/{ds_id}/files/dataset_description.json', file_wrapper=FileWrapper
    )
    content_len = int(result.headers['content-length'])
    assert content_len == len(result.content)
    assert json.loads(result.content)['BIDSVersion'] == '1.0.2'


def test_get_file_extensionless(client):
    ds_id = 'ds000001'
    result = client.simulate_get(
        f'/datasets/{ds_id}/files/dataset_description', file_wrapper=FileWrapper
    )
    content_len = int(result.headers['content-length'])
    assert content_len == len(result.content)
    print(result.content)
    assert json.loads(result.content)['BIDSVersion'] == '1.0.2'


def test_get_annexed_file(client):
    ds_id = 'ds000001'
    file_data = 'test image, please ignore'
    response = client.simulate_post(
        f'/datasets/{ds_id}/files/data.nii.gz', body=file_data
    )
    assert response.status == falcon.HTTP_OK
    response = client.simulate_post(f'/datasets/{ds_id}/draft')
    assert response.status == falcon.HTTP_OK
    result = client.simulate_get(
        f'/datasets/{ds_id}/files/data.nii.gz', file_wrapper=FileWrapper
    )
    content_len = int(result.headers['content-length'])
    assert content_len == len(result.content)
    assert result.content.decode() == file_data


def test_get_nested_annexed_file(client):
    # Test accessing a subdir annexed file in git history
    ds_id = 'ds000001'
    file_data = 'test image, please ignore'
    # Add it
    response = client.simulate_post(
        f'/datasets/{ds_id}/files/sub-01:anat:data.nii.gz', body=file_data
    )
    assert response.status == falcon.HTTP_OK
    response = client.simulate_post(f'/datasets/{ds_id}/draft')
    commit = json.loads(response.content)['ref']
    assert response.status == falcon.HTTP_OK
    # Delete it
    response = client.simulate_delete(
        '/datasets/{}/files'.format(ds_id),
        body='{ "filenames": ["sub-01/anat/data.nii.gz"] }',
    )
    assert response.status == falcon.HTTP_OK
    response = client.simulate_post(f'/datasets/{ds_id}/draft')
    assert response.status == falcon.HTTP_OK
    # Get it
    result = client.simulate_get(
        f'/datasets/{ds_id}/snapshots/{commit}/files/sub-01:anat:data.nii.gz',
        file_wrapper=FileWrapper,
    )
    content_len = int(result.headers['content-length'])
    assert content_len == len(result.content)
    assert result.content.decode() == file_data


def test_get_annexed_file_nested(client):
    ds_id = 'ds000001'
    file_data = 'test image, please ignore'
    response = client.simulate_post(
        f'/datasets/{ds_id}/files/sub-01:data.nii.gz', body=file_data
    )
    assert response.status == falcon.HTTP_OK
    response = client.simulate_post(f'/datasets/{ds_id}/draft')
    assert response.status == falcon.HTTP_OK
    result = client.simulate_get(
        f'/datasets/{ds_id}/files/sub-01:data.nii.gz', file_wrapper=FileWrapper
    )
    content_len = int(result.headers['content-length'])
    assert content_len == len(result.content)
    assert result.content.decode() == file_data


def test_get_missing_file(client):
    ds_id = 'ds000001'
    result = client.simulate_get(
        f'/datasets/{ds_id}/files/thisdoesnotexist.json', file_wrapper=FileWrapper
    )
    assert result.status == falcon.HTTP_NOT_FOUND


def test_add_file(client, datalad_store):
    ds_id = 'ds000001'
    file_data = 'Test dataset README'
    response = client.simulate_post(f'/datasets/{ds_id}/files/README', body=file_data)
    assert response.status == falcon.HTTP_OK
    # Commit draft
    response = client.simulate_post(f'/datasets/{ds_id}/draft')
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
        f'/datasets/{ds_id}/files/dataset_description.json', body=file_data
    )
    assert response.status == falcon.HTTP_OK


def test_add_directory_path(client):
    ds_id = 'ds000001'
    file_data = 'complex path test'
    response = client.simulate_post(
        f'/datasets/{ds_id}/files/sub-01:fake-image.nii', body=file_data
    )
    assert response.status == falcon.HTTP_OK


def test_update_file(client, datalad_store):
    ds_id = 'ds000001'
    file_data = 'Test dataset LICENSE'
    # First post a file
    response = client.simulate_post(f'/datasets/{ds_id}/files/LICENSE', body=file_data)
    assert response.status == falcon.HTTP_OK
    response = client.simulate_post(f'/datasets/{ds_id}/draft')
    assert response.status == falcon.HTTP_OK
    # Then update it
    file_data = 'New test LICENSE'
    response = client.simulate_post(f'/datasets/{ds_id}/files/LICENSE', body=file_data)
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
    response = client.simulate_post(f'/datasets/{ds_id}/files/LICENSE', body='GPL V3.0')
    assert response.status == falcon.HTTP_OK
    response = client.simulate_post(
        f'/datasets/{ds_id}/files/sub-01:anat:sub-01_T1w.nii.gz',
        body='fMRI data goes here',
    )
    assert response.status == falcon.HTTP_OK
    # Commit draft
    response = client.simulate_post(f'/datasets/{ds_id}/draft')
    assert response.status == falcon.HTTP_OK
    # Get the files in the committed tree
    root_response = client.simulate_get('/datasets/{}/tree/{}'.format(ds_id, 'HEAD'))
    assert root_response.status == falcon.HTTP_OK
    root_content = json.loads(root_response.content)
    for f in [
        {
            'filename': 'dataset_description.json',
            'size': 101,
            'id': '43502da40903d08b18b533f8897330badd6e1da3',
            'key': '838d19644b3296cf32637bbdf9ae5c87db34842f',
            'urls': [
                f'http://localhost:9876/crn/datasets/{ds_id}/objects/838d19644b3296cf32637bbdf9ae5c87db34842f'
            ],
            'annexed': False,
            'directory': False,
        },
        {
            'filename': 'LICENSE',
            'size': 8,
            'id': '8a6f5281317d8a8fb695d12c940b0ff7a7dee435',
            'key': 'MD5E-s8--4d87586dfb83dc4a5d15c6cfa6f61e27',
            'urls': [
                f'http://localhost:9876/crn/datasets/{ds_id}/objects/MD5E-s8--4d87586dfb83dc4a5d15c6cfa6f61e27'
            ],
            'annexed': True,
            'directory': False,
        },
        {
            'id': '2f8451ae1016f936999aaacc0b3d79fb284ac3ea',
            'filename': 'sub-01',
            'directory': True,
            'annexed': False,
            'size': 0,
            'urls': [],
        },
    ]:
        assert f in root_content['files']
    # Test sub-01 directory
    sub_response = client.simulate_get(
        '/datasets/{}/tree/{}'.format(
            ds_id,
            next(
                (f['id'] for f in root_content['files'] if f['filename'] == 'sub-01'),
                None,
            ),
        )
    )
    assert sub_response.status == falcon.HTTP_OK
    sub_content = json.loads(sub_response.content)
    # Test sub-01/anat directory
    anat_response = client.simulate_get(
        '/datasets/{}/tree/{}'.format(
            ds_id,
            next(
                (f['id'] for f in sub_content['files'] if f['filename'] == 'anat'), None
            ),
        )
    )
    assert anat_response.status == falcon.HTTP_OK
    anat_content = json.loads(anat_response.content)
    # Test sub-01/anat/sub-01_T1w.nii.gz file
    assert {
        'filename': 'sub-01_T1w.nii.gz',
        'size': 19,
        'id': 'e497096a2bce0d48b2761dade2b5c4e5a0f352bd',
        'key': 'MD5E-s19--8149926e49b677a5ccecf1ad565acccf.nii.gz',
        'urls': [
            f'http://localhost:9876/crn/datasets/{ds_id}/objects/MD5E-s19--8149926e49b677a5ccecf1ad565acccf.nii.gz'
        ],
        'annexed': True,
        'directory': False,
    } in anat_content['files']


def test_empty_file(client, new_dataset):
    """Catch any regressions for 0 length files."""
    ds_id = os.path.basename(new_dataset.path)
    # Post an empty file
    response = client.simulate_post(f'/datasets/{ds_id}/files/LICENSE', body='')
    assert response.status == falcon.HTTP_OK
    # Commit files
    response = client.simulate_post(
        f'/datasets/{ds_id}/draft', params={'validate': 'false'}
    )
    assert response.status == falcon.HTTP_OK
    # Get the files in the committed tree
    response = client.simulate_get(f'/datasets/{ds_id}/tree/HEAD')
    assert response.status == falcon.HTTP_OK
    response_content = json.loads(response.content)
    # Check that all elements exist in both lists
    print(response_content)
    assert {
        'filename': 'LICENSE',
        'size': 0,
        'id': '5bfdc52581371bfa051fa76825a0e1b5e5c3b4bf',
        'key': 'MD5E-s0--d41d8cd98f00b204e9800998ecf8427e',
        'urls': [
            f'http://localhost:9876/crn/datasets/{ds_id}/objects/MD5E-s0--d41d8cd98f00b204e9800998ecf8427e'
        ],
        'annexed': True,
        'directory': False,
    } in response_content['files']
    assert {
        'filename': 'dataset_description.json',
        'size': 101,
        'id': '43502da40903d08b18b533f8897330badd6e1da3',
        'key': '838d19644b3296cf32637bbdf9ae5c87db34842f',
        'urls': [
            f'http://localhost:9876/crn/datasets/{ds_id}/objects/838d19644b3296cf32637bbdf9ae5c87db34842f'
        ],
        'annexed': False,
        'directory': False,
    } in response_content['files']


def test_duplicate_file_id(client, new_dataset):
    ds_id = os.path.basename(new_dataset.path)
    file_body = '{}'
    # Post the same file in two paths
    response = client.simulate_post(
        f'/datasets/{ds_id}/files/derivatives:one.json', body=file_body
    )
    assert response.status == falcon.HTTP_OK
    response = client.simulate_post(
        f'/datasets/{ds_id}/files/derivatives:two.json', body=file_body
    )
    assert response.status == falcon.HTTP_OK
    # Commit files
    response = client.simulate_post(
        f'/datasets/{ds_id}/draft', params={'validate': 'false'}
    )
    assert response.status == falcon.HTTP_OK
    response = client.simulate_get(f'/datasets/{ds_id}/tree/HEAD')
    assert response.status == falcon.HTTP_OK
    response_content = json.loads(response.content)
    derivatives_tree = next(
        (f['id'] for f in response_content['files'] if f['filename'] == 'derivatives'),
        None,
    )
    response = client.simulate_get(f'/datasets/{ds_id}/tree/{derivatives_tree}')
    assert response.status == falcon.HTTP_OK
    response_content = json.loads(response.content)
    # Find each file in the results
    file_one = next(
        (f for f in response_content['files'] if f['filename'] == 'one.json'), None
    )
    file_two = next(
        (f for f in response_content['files'] if f['filename'] == 'two.json'), None
    )
    # Validate they have differing ids
    assert file_one['id'] != file_two['id']


def test_delete_file(client, new_dataset):
    ds_id = os.path.basename(new_dataset.path)
    response = client.simulate_delete(
        '/datasets/{}/files'.format(ds_id),
        body='{ "filenames": ["dataset_description.json", "CHANGES"] }',
    )
    assert response.status == falcon.HTTP_OK
    assert json.loads(response.content)['deleted'] == [
        'dataset_description.json',
        'CHANGES',
    ]


def test_delete_nested_file(client, new_dataset):
    ds_id = os.path.basename(new_dataset.path)
    response = client.simulate_post(
        f'/datasets/{ds_id}/files/derivatives:LICENSE', body='GPL V3.0'
    )
    assert response.status == falcon.HTTP_OK
    # Commit new nested file
    response = client.simulate_post(
        f'/datasets/{ds_id}/draft', params={'validate': 'false'}
    )
    assert response.status == falcon.HTTP_OK
    # Delete new nested file + an existing file
    response = client.simulate_delete(
        '/datasets/{}/files'.format(ds_id),
        body='{ "filenames": ["derivatives:LICENSE", "CHANGES"] }',
    )
    assert response.status == falcon.HTTP_OK
    assert json.loads(response.content)['deleted'] == ['derivatives/LICENSE', 'CHANGES']


def test_delete_non_existing_file(client, new_dataset):
    ds_id = os.path.basename(new_dataset.path)
    response = client.simulate_delete(
        f'/datasets/{ds_id}/files', body='{ "filenames": ["fake", "test"]}'
    )
    assert response.status == falcon.HTTP_OK
    assert (
        json.loads(response.content)['error']
        == 'the following files not found: fake, test'
    )


def test_parse_s3_annex_url():
    # 'ex' is an impossible bucket name for an example
    parsed = parse_s3_annex_url(
        'https://s3.amazonaws.com/ex/ds001077/sub-02/anat/sub-02_T1w.nii.gz?versionId=tMYX62XJtDqDw_0nfS0CUtRx4rrXn_OD',
        'ex',
    )
    assert parsed['VersionId'] == 'tMYX62XJtDqDw_0nfS0CUtRx4rrXn_OD'
    assert parsed['Key'] == 'ds001077/sub-02/anat/sub-02_T1w.nii.gz'
