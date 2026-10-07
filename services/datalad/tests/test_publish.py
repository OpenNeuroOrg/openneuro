import json
import os
from unittest.mock import AsyncMock, Mock, call, patch
from botocore.exceptions import ClientError

import falcon

from datalad_service.tasks.publish import (
    export_dataset,
    create_remotes,
    set_remote_public,
    update_object_tag,
    set_s3_access_tag_worker,
)
from datalad_service.common.annex import is_git_annex_remote


def test_publish_dataset(no_init_remote, new_dataset):
    """Verify remotes are created once a dataset is made public"""
    create_remotes(new_dataset.path)
    assert is_git_annex_remote(new_dataset.path, 's3-PUBLIC')


async def test_export_snapshots(no_init_remote, client, new_dataset):
    """
    Create some snapshots, make dataset public, and then make sure we have run an S3 export for each one

    no_init_remote creates a directory remote for S3 and a non-existent GitHub remote
    These are sufficient for testing that special remotes trigger the tests for those
    """
    ds_id = os.path.basename(new_dataset.path)
    async with client as conductor:
        # Create 1.0.0
        response = await conductor.simulate_post(
            '/datasets/{}/snapshots/{}'.format(ds_id, '1.0.0'), body=''
        )
        assert response.status == falcon.HTTP_OK
        # Update a file
        file_data = json.dumps(
            {
                'BIDSVersion': '1.0.2',
                'License': 'CC0',
                'Name': 'Test fixture new dataset',
                'Authors': ['Test Authors', 'Please Ignore'],
            },
            indent=4,
        )
        response = await conductor.simulate_post(
            f'/datasets/{ds_id}/files/dataset_description.json', body=file_data
        )
        assert response.status == falcon.HTTP_OK
        # Create 2.0.0
        response = await conductor.simulate_post(
            '/datasets/{}/snapshots/{}'.format(ds_id, '2.0.0'), body=''
        )
        assert response.status == falcon.HTTP_OK
    # Make it public
    create_remotes(new_dataset.path)
    # Export
    s3_export_mock = AsyncMock()
    github_export_mock = Mock()
    update_s3_sibling_mock = Mock()
    await export_dataset(
        new_dataset.path,
        s3_export=s3_export_mock,
        github_export=github_export_mock,
        update_s3_sibling=update_s3_sibling_mock,
        github_enabled=True,
    )
    # Verify export calls were made
    assert s3_export_mock.call_count == 1
    expect_calls = [call(new_dataset.path, 's3-PUBLIC', 'refs/tags/2.0.0')]
    s3_export_mock.assert_has_calls(expect_calls)
    assert github_export_mock.call_count == 1
    dataset_id = os.path.basename(new_dataset.path)
    expect_calls = [call(dataset_id, new_dataset.path, 'refs/tags/2.0.0')]
    github_export_mock.assert_has_calls(expect_calls)


@patch('datalad_service.tasks.publish.run_check', new_callable=AsyncMock)
@patch('datalad_service.tasks.publish.set_s3_access_tag_worker')
async def test_set_remote_public(mock_set_s3_access_tag, mock_run_check, new_dataset):
    await set_remote_public(new_dataset.path)

    mock_run_check.assert_called_once_with(
        ['git-annex', 'enableremote', 's3-PUBLIC', 'x-amz-tagging=access=public'],
        new_dataset.path,
    )
    mock_set_s3_access_tag.assert_called_once_with(
        os.path.basename(new_dataset.path), 'public'
    )


def test_update_object_tag_skips_when_already_matching():
    client = Mock()
    client.get_object_tagging.return_value = {
        'TagSet': [{'Key': 'access', 'Value': 'public'}]
    }
    updated = update_object_tag(
        client, 'my-bucket', 'ds000001/file.txt', 'v1', 'public'
    )
    assert updated is False
    client.put_object_tagging.assert_not_called()


def test_update_object_tag_updates_when_mismatched():
    client = Mock()
    client.get_object_tagging.return_value = {
        'TagSet': [{'Key': 'access', 'Value': 'private'}]
    }
    updated = update_object_tag(
        client, 'my-bucket', 'ds000001/file.txt', 'v1', 'public'
    )
    assert updated is True
    client.put_object_tagging.assert_called_once_with(
        Bucket='my-bucket',
        Key='ds000001/file.txt',
        VersionId='v1',
        Tagging={'TagSet': [{'Key': 'access', 'Value': 'public'}]},
    )


def test_update_object_tag_preserves_other_tags():
    client = Mock()
    client.get_object_tagging.return_value = {
        'TagSet': [
            {'Key': 'custom', 'Value': 'val'},
            {'Key': 'access', 'Value': 'private'},
        ]
    }
    updated = update_object_tag(
        client, 'my-bucket', 'ds000001/file.txt', 'v1', 'public'
    )
    assert updated is True
    client.put_object_tagging.assert_called_once_with(
        Bucket='my-bucket',
        Key='ds000001/file.txt',
        VersionId='v1',
        Tagging={
            'TagSet': [
                {'Key': 'custom', 'Value': 'val'},
                {'Key': 'access', 'Value': 'public'},
            ]
        },
    )


def test_update_object_tag_handles_no_such_tag_set():
    client = Mock()
    client.exceptions.ClientError = ClientError
    client.get_object_tagging.side_effect = ClientError(
        {'Error': {'Code': 'NoSuchTagSet', 'Message': 'No tags'}},
        'GetObjectTagging',
    )
    updated = update_object_tag(
        client, 'my-bucket', 'ds000001/file.txt', 'v1', 'public'
    )
    assert updated is True
    client.put_object_tagging.assert_called_once_with(
        Bucket='my-bucket',
        Key='ds000001/file.txt',
        VersionId='v1',
        Tagging={'TagSet': [{'Key': 'access', 'Value': 'public'}]},
    )


def test_update_object_tag_handles_missing_object():
    client = Mock()
    client.exceptions.ClientError = ClientError
    client.get_object_tagging.side_effect = ClientError(
        {'Error': {'Code': 'NoSuchKey', 'Message': 'Key does not exist'}},
        'GetObjectTagging',
    )
    updated = update_object_tag(
        client, 'my-bucket', 'ds000001/file.txt', 'v1', 'public'
    )
    assert updated is False
    client.put_object_tagging.assert_not_called()


@patch('datalad_service.tasks.publish.boto3.client')
@patch('datalad_service.tasks.publish.get_s3_bucket', return_value='test-bucket')
def test_set_s3_access_tag_worker(mock_get_bucket, mock_boto_client):
    mock_s3 = Mock()
    mock_boto_client.return_value = mock_s3

    paginator = Mock()
    # 2 pages: page 1 has 2 versions (1 in sync, 1 needs update), page 2 has 1 version (needs update)
    paginator.paginate.return_value = [
        {
            'Versions': [
                {'Key': 'ds000001/f1', 'VersionId': 'v1'},
                {'Key': 'ds000001/f2', 'VersionId': 'v2'},
            ]
        },
        {
            'Versions': [
                {'Key': 'ds000001/f3', 'VersionId': 'v3'},
            ]
        },
    ]
    mock_s3.get_paginator.return_value = paginator

    def mock_get_tagging(Bucket, Key, VersionId):
        if Key == 'ds000001/f1':
            return {'TagSet': [{'Key': 'access', 'Value': 'public'}]}
        return {'TagSet': [{'Key': 'access', 'Value': 'private'}]}

    mock_s3.get_object_tagging.side_effect = mock_get_tagging

    stats = set_s3_access_tag_worker('ds000001', 'public')

    assert stats == {'scanned': 3, 'updated': 2, 'in_sync': 1}
    assert mock_s3.put_object_tagging.call_count == 2
