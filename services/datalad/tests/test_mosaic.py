import os
import bidsmosaic
import falcon
import pygit2
import pytest
from contextlib import asynccontextmanager
from pathlib import Path
from types import SimpleNamespace
from unittest.mock import AsyncMock

import datalad_service.tasks.mosaic
from datalad_service.tasks.mosaic import (
    _is_anat,
    create_anat_files_dict,
    create_mosaic,
    get_mosaic_path,
)
from tests.conftest import DATASET_ID, SNAPSHOT_ID

MOSAIC_BYTES = b'%PDF-1.4\ntest mosaic\n%%EOF\n'
ANAT_FILES = [
    'sub-02/anat/sub-02_T1w.nii.gz',
    'sub-01/ses-1/anat/sub-01_ses-1_T2w.nii',
    'sub-01/anat/sub-01_T1w.nii.gz',
]
NON_ANAT_FILES = [
    'sub-01/anat/sub-01_T1w.json',
    'sub-01/func/sub-01_task-rest_bold.nii.gz',
    'derivatives/sub-03/anat/sub-03_T1w.nii.gz',
]


def file_contents(relpath):
    """Unique contents per file so streams can be matched to their paths."""
    return f'contents of {relpath}\n'.encode()


@pytest.fixture
def datalad_dataset_path(datalad_store, monkeypatch):
    monkeypatch.setattr(
        datalad_service.tasks.mosaic,
        'DATALAD_DATASET_PATH',
        str(datalad_store.annex_path),
    )
    return Path(datalad_store.annex_path)


@pytest.fixture
def mosaic_path(datalad_dataset_path):
    mosaic_dir_path = datalad_dataset_path / 'mosaics' / DATASET_ID
    return mosaic_dir_path / f'{DATASET_ID}-{SNAPSHOT_ID}_mosaic.pdf'


@pytest.fixture
def write_mosaic(mosaic_path):
    """Write a test mosaic PDF. Return the path."""
    mosaic_path.parent.mkdir(parents=True, exist_ok=True)
    mosaic_path.write_bytes(MOSAIC_BYTES)

    return mosaic_path


@pytest.fixture
def anat_dataset(new_dataset):
    """Add anatomical images and files a mosaic should ignore to a dataset."""
    for relpath in ANAT_FILES + NON_ANAT_FILES:
        file_path = Path(new_dataset.path) / relpath
        file_path.parent.mkdir(parents=True, exist_ok=True)
        file_path.write_bytes(file_contents(relpath))
    new_dataset.save()

    return new_dataset


@pytest.fixture
def mock_redis_lock(monkeypatch):
    """Fake the redis lock held while a mosaic is created. Return the lock."""
    lock = AsyncMock()
    lock.acquire.return_value = True

    @asynccontextmanager
    async def redis_client():
        yield SimpleNamespace(lock=lambda *args, **kwargs: lock)

    monkeypatch.setattr(datalad_service.tasks.mosaic, 'redis_client', redis_client)

    return lock


@pytest.fixture
def mock_bidsmosaic(monkeypatch):
    """Write a stub PDF instead of rendering one. Return the mock."""

    async def create_mosaic_pdf_async(out_file_path, files_dict, **kwargs):
        Path(out_file_path).write_bytes(MOSAIC_BYTES)

    mock_render = AsyncMock(side_effect=create_mosaic_pdf_async)
    monkeypatch.setattr(bidsmosaic, 'create_mosaic_pdf_async', mock_render)

    return mock_render


@pytest.fixture
def mock_create_mosaic_kiq(monkeypatch):
    """Mock enqueueing the create_mosaic task. Return the mock."""
    mock_kiq = AsyncMock()
    monkeypatch.setattr(
        'datalad_service.tasks.mosaic.create_mosaic.kiq',
        mock_kiq,
    )

    return mock_kiq


class FileWrapper:
    def __init__(self, file_like, block_size=8192):
        self.file_like = file_like
        self.block_size = block_size

    def __getitem__(self, key):
        data = self.file_like.read(self.block_size)
        if data:
            return data
        raise IndexError


@pytest.mark.parametrize('relpath', ANAT_FILES)
def test_is_anat(relpath):
    assert _is_anat(relpath)


@pytest.mark.parametrize('relpath', NON_ANAT_FILES)
def test_is_anat_excluded(relpath):
    assert not _is_anat(relpath)


async def test_create_anat_files_dict(anat_dataset):
    repo = pygit2.Repository(anat_dataset.path)
    commit, _ref = repo.resolve_refish('HEAD')

    files_dict = create_anat_files_dict(repo, commit)

    assert list(files_dict) == ['Anatomical']
    assert [relpath for relpath, _opener in files_dict['Anatomical']] == sorted(
        ANAT_FILES
    )
    for relpath, opener in files_dict['Anatomical']:
        stream = await opener()
        assert b''.join([chunk async for chunk in stream]) == file_contents(relpath)


async def test_create_mosaic(
    anat_dataset, datalad_dataset_path, mock_redis_lock, mock_bidsmosaic
):
    dataset_id = os.path.basename(anat_dataset.path)
    repo = pygit2.Repository(anat_dataset.path)
    commit, _ref = repo.resolve_refish('HEAD')

    await create_mosaic(dataset_id, anat_dataset.path, 'HEAD')

    out_file_path, files_dict = mock_bidsmosaic.call_args.args
    mosaic_path = get_mosaic_path(dataset_id, repo, commit)
    assert out_file_path == str(mosaic_path)
    assert [relpath for relpath, _opener in files_dict['Anatomical']] == sorted(
        ANAT_FILES
    )


async def test_create_mosaic_no_anat(
    new_dataset, datalad_dataset_path, mock_redis_lock, mock_bidsmosaic
):
    dataset_id = os.path.basename(new_dataset.path)

    await create_mosaic(dataset_id, new_dataset.path, 'HEAD')

    assert not mock_bidsmosaic.called
    assert not (datalad_dataset_path / 'mosaics' / dataset_id).exists()
    assert mock_redis_lock.release.await_count == 1


async def test_create_mosaic_locked(anat_dataset, mock_redis_lock, mock_bidsmosaic):
    """A mosaic already being created for this ref is not created again."""
    mock_redis_lock.acquire.return_value = False

    await create_mosaic(os.path.basename(anat_dataset.path), anat_dataset.path, 'HEAD')

    assert not mock_bidsmosaic.called
    assert not mock_redis_lock.release.called


def test_get_mosaic_path_tagged(mosaic_path, datalad_store):
    repo = datalad_store.get_dataset_repo(DATASET_ID)
    assert get_mosaic_path(DATASET_ID, repo, SNAPSHOT_ID) == mosaic_path


def test_get_mosaic_path_untagged(datalad_dataset_path, new_dataset):
    dataset_id = os.path.basename(new_dataset.path)
    repo = pygit2.Repository(new_dataset.path)
    commit, _ref = repo.resolve_refish('HEAD')

    mosaic_path = get_mosaic_path(dataset_id, repo, commit)
    assert mosaic_path == (
        datalad_dataset_path
        / 'mosaics'
        / dataset_id
        / f'{dataset_id}-{str(commit.id)[0:8]}_mosaic.pdf'
    )


def test_get_mosaic(client, write_mosaic):
    result = client.simulate_get(
        f'/datasets/{DATASET_ID}/mosaic/{SNAPSHOT_ID}', file_wrapper=FileWrapper
    )
    assert result.status == falcon.HTTP_OK
    assert int(result.headers['content-length']) == len(MOSAIC_BYTES)
    assert result.content == MOSAIC_BYTES


def test_get_mosaic_no_file(client, mosaic_path):
    mosaic_path.unlink(missing_ok=True)
    result = client.simulate_get(f'/datasets/{DATASET_ID}/mosaic/{SNAPSHOT_ID}')
    assert result.status == falcon.HTTP_NOT_FOUND
    assert result.json == {'error': 'mosaic not found'}


def test_get_mosaic_unknown_ref(client, write_mosaic):
    result = client.simulate_get(f'/datasets/{DATASET_ID}/mosaic/000002')
    assert result.status == falcon.HTTP_NOT_FOUND
    assert result.json == {'error': 'mosaic not found'}


def test_get_mosaic_invalid_ref(client, write_mosaic):
    result = client.simulate_get(f'/datasets/{DATASET_ID}/mosaic/not_a_ref')
    assert result.status == falcon.HTTP_NOT_FOUND
    assert result.json == {'error': 'mosaic not found'}


def test_get_mosaic_unknown_dataset(client, datalad_dataset_path):
    result = client.simulate_get(f'/datasets/ds999999/mosaic/{SNAPSHOT_ID}')
    assert result.status == falcon.HTTP_NOT_FOUND
    assert result.json == {'error': 'mosaic not found'}


def test_post_mosaic(client, datalad_store, mock_create_mosaic_kiq):
    result = client.simulate_post(f'/datasets/{DATASET_ID}/mosaic/{SNAPSHOT_ID}')
    assert result.status == falcon.HTTP_OK
    mock_create_mosaic_kiq.assert_awaited_once_with(
        DATASET_ID, datalad_store.get_dataset_path(DATASET_ID), SNAPSHOT_ID, {}
    )


def test_post_mosaic_enqueue_failed(client, mock_create_mosaic_kiq):
    mock_create_mosaic_kiq.side_effect = Exception('broker unavailable')
    result = client.simulate_post(f'/datasets/{DATASET_ID}/mosaic/{SNAPSHOT_ID}')
    assert result.status == falcon.HTTP_INTERNAL_SERVER_ERROR
