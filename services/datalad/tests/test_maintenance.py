from unittest.mock import AsyncMock, patch

from datalad_service.tasks.maintenance import (
    gc_dataset,
    git_fsck_dataset,
    reconcile_s3_tags_dataset,
)


def test_gc_dataset(new_dataset):
    gc_dataset(new_dataset.path)


def test_git_fsck_dataset(new_dataset):
    git_fsck_dataset(new_dataset.path)


@patch('datalad_service.tasks.maintenance.set_s3_access_tag', new_callable=AsyncMock)
async def test_reconcile_s3_tags_dataset_explicit(mock_set_s3_access_tag):
    await reconcile_s3_tags_dataset('/srv/datasets/ds000123')
    mock_set_s3_access_tag.assert_awaited_once_with('ds000123')


@patch('datalad_service.tasks.maintenance.s3_tags_dataset_generator')
@patch('datalad_service.tasks.maintenance.set_s3_access_tag', new_callable=AsyncMock)
async def test_reconcile_s3_tags_dataset_generator(
    mock_set_s3_access_tag, mock_generator
):
    mock_generator.__next__.return_value = '/srv/datasets/ds000456'
    await reconcile_s3_tags_dataset()
    mock_set_s3_access_tag.assert_awaited_once_with('ds000456')


@patch('datalad_service.tasks.maintenance.s3_tags_dataset_generator')
@patch('datalad_service.tasks.maintenance.set_s3_access_tag', new_callable=AsyncMock)
async def test_reconcile_s3_tags_dataset_empty_generator(
    mock_set_s3_access_tag, mock_generator
):
    mock_generator.__next__.side_effect = StopIteration
    await reconcile_s3_tags_dataset()
    mock_set_s3_access_tag.assert_not_called()
