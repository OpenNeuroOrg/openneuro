import json
import resource
from unittest.mock import AsyncMock, MagicMock, patch

import pytest

from datalad_service import config
from datalad_service.tasks.fsck import (
    git_annex_fsck_local,
    git_annex_fsck_remote,
    parse_memory_limit,
)


class _AsyncLines:
    def __init__(self, lines):
        self._iter = iter(lines)

    def __aiter__(self):
        return self

    async def __anext__(self):
        try:
            return next(self._iter)
        except StopIteration:
            raise StopAsyncIteration


def _make_mock_process(lines, returncode=0):
    proc = MagicMock()
    proc.stdout = _AsyncLines(lines)
    proc.wait = AsyncMock(return_value=returncode)
    return proc


def test_parse_memory_limit():
    assert parse_memory_limit('2G') == 2 * 1024**3
    assert parse_memory_limit('8Gi') == 8 * 1024**3
    assert parse_memory_limit('512M') == 512 * 1024**2
    assert parse_memory_limit('1024') == 1024
    assert parse_memory_limit('') is None
    assert parse_memory_limit(None) is None
    with pytest.raises(ValueError):
        parse_memory_limit('invalid')


@pytest.mark.asyncio
async def test_git_annex_fsck_local_sets_rlimit_data(new_dataset, monkeypatch):
    monkeypatch.setattr(config, 'DATALAD_FSCK_MAX_MEMORY', '4G')
    proc = _make_mock_process(
        [json.dumps({'file': 'sub-01/T1w.nii.gz', 'success': True}).encode() + b'\n'],
        returncode=0,
    )
    with (
        patch(
            'datalad_service.tasks.fsck.asyncio.create_subprocess_exec',
            new=AsyncMock(return_value=proc),
        ) as mock_exec,
        patch('datalad_service.tasks.fsck.update_file_check') as mock_update,
        patch(
            'datalad_service.tasks.fsck.resource.getrlimit',
            return_value=(resource.RLIM_INFINITY, resource.RLIM_INFINITY),
        ),
        patch('datalad_service.tasks.fsck.resource.setrlimit') as mock_setrlimit,
    ):
        await git_annex_fsck_local(new_dataset.path)
        mock_exec.assert_called_once()
        preexec_fn = mock_exec.call_args.kwargs['preexec_fn']
        assert callable(preexec_fn)
        preexec_fn()
        expected = 4 * 1024**3
        mock_setrlimit.assert_called_once_with(
            resource.RLIMIT_DATA, (expected, expected)
        )

    mock_update.assert_called_once()
    assert mock_update.call_args.args[3] == []


@pytest.mark.asyncio
async def test_git_annex_fsck_local_bad_files_exit_1(new_dataset):
    bad_line = json.dumps(
        {
            'file': 'sub-01/T1w.nii.gz',
            'key': 'SHA256E-s10--abc',
            'success': False,
            'error-messages': ['checksum mismatch'],
        }
    ).encode()
    proc = _make_mock_process([bad_line], returncode=1)
    with (
        patch(
            'datalad_service.tasks.fsck.asyncio.create_subprocess_exec',
            new=AsyncMock(return_value=proc),
        ),
        patch('datalad_service.tasks.fsck.update_file_check') as mock_update,
    ):
        await git_annex_fsck_local(new_dataset.path)

    mock_update.assert_called_once()
    bad_files = mock_update.call_args.args[3]
    assert len(bad_files) == 1
    assert bad_files[0]['errorMessages'] == ['checksum mismatch']


@pytest.mark.asyncio
async def test_git_annex_fsck_local_raises_on_oom_crash(new_dataset):
    # GHC RTS exits with 251 on out of memory
    proc = _make_mock_process([], returncode=251)
    with (
        patch(
            'datalad_service.tasks.fsck.asyncio.create_subprocess_exec',
            new=AsyncMock(return_value=proc),
        ),
        patch('datalad_service.tasks.fsck.update_file_check') as mock_update,
    ):
        with pytest.raises(RuntimeError, match='exit code 251'):
            await git_annex_fsck_local(new_dataset.path)

    mock_update.assert_not_called()


@pytest.mark.asyncio
async def test_git_annex_fsck_remote_sets_rlimit_and_raises_on_oom(
    new_dataset, monkeypatch
):
    monkeypatch.setattr(config, 'DATALAD_FSCK_MAX_MEMORY', '2G')
    proc = _make_mock_process([], returncode=251)
    with (
        patch(
            'datalad_service.tasks.fsck.asyncio.create_subprocess_exec',
            new=AsyncMock(return_value=proc),
        ) as mock_exec,
        patch('datalad_service.tasks.fsck.update_file_check') as mock_update,
    ):
        with pytest.raises(RuntimeError, match='exit code 251'):
            await git_annex_fsck_remote(new_dataset.path, ['1.0.0'], 's3-PUBLIC')

    assert callable(mock_exec.call_args.kwargs['preexec_fn'])
    mock_update.assert_not_called()
