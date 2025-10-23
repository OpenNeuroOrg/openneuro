import json
import os
from unittest.mock import Mock, call

import falcon

from datalad_service.tasks.publish import export_dataset, create_remotes
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
    s3_export_mock = Mock()
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
