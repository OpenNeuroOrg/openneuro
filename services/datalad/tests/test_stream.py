import os

import pytest

from datalad_service.common.stream import (
    WRITE_BUFFER_SIZE,
    IncompleteStreamError,
    update_file,
)


class FakeStream:
    """Mimics falcon's ASGI stream, which returns b'' on client disconnect."""

    def __init__(self, data):
        self.data = data
        self.pos = 0

    async def read(self, size):
        chunk = self.data[self.pos : self.pos + size]
        self.pos += len(chunk)
        return chunk


@pytest.mark.asyncio
@pytest.mark.parametrize('size', [100, WRITE_BUFFER_SIZE * 2 + 100])
async def test_update_file_expected_size(tmp_path, size):
    target = tmp_path / 'object'
    await update_file(str(target), FakeStream(b'a' * size), expected_size=size)
    assert target.read_bytes() == b'a' * size


@pytest.mark.asyncio
@pytest.mark.parametrize('size', [100, WRITE_BUFFER_SIZE * 2 + 100])
async def test_update_file_truncated(tmp_path, size):
    target = tmp_path / 'object'
    with pytest.raises(IncompleteStreamError):
        await update_file(
            str(target), FakeStream(b'a' * (size - 1)), expected_size=size
        )
    assert not target.exists()
    # Temp files are cleaned up
    assert os.listdir(tmp_path) == []


@pytest.mark.asyncio
@pytest.mark.parametrize('size', [100, WRITE_BUFFER_SIZE * 2 + 100])
async def test_update_file_oversized(tmp_path, size):
    target = tmp_path / 'object'
    with pytest.raises(IncompleteStreamError):
        await update_file(
            str(target), FakeStream(b'a' * (size + 1)), expected_size=size
        )
    assert not target.exists()
    assert os.listdir(tmp_path) == []


@pytest.mark.asyncio
async def test_update_file_preserves_existing_on_truncation(tmp_path):
    target = tmp_path / 'object'
    target.write_bytes(b'original')
    with pytest.raises(IncompleteStreamError):
        await update_file(str(target), FakeStream(b'new'), expected_size=10)
    assert target.read_bytes() == b'original'
