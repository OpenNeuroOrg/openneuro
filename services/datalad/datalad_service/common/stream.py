import asyncio
import os
import tempfile

from datalad_service.common.const import CHUNK_SIZE_BYTES

# Buffer up to 4 MiB in memory before dispatching disk writes to the thread pool.
# Small files (< 4 MiB) are written and atomically replaced in a single thread-pool call;
# large files flush in 4 MiB batches instead of dispatching per 64 KiB chunk.
WRITE_BUFFER_SIZE = 4 * 1024 * 1024


def _write_all(tmp, data):
    view = memoryview(data)
    written = 0
    while written < len(view):
        written += tmp.write(view[written:])


def _write_small_file(path, data):
    """Write a complete file buffer to a temp file and atomically replace target path."""
    tmp = tempfile.NamedTemporaryFile(
        dir=os.path.dirname(path), delete=False, buffering=0
    )
    try:
        _write_all(tmp, data)
        tmp.close()
        os.replace(tmp.name, path)
    except BaseException:
        tmp.close()
        try:
            os.remove(tmp.name)
        except OSError:
            pass
        raise


def _open_and_write_chunk(path, data):
    """Open an unbuffered temp file and write the first buffered batch."""
    tmp = tempfile.NamedTemporaryFile(
        dir=os.path.dirname(path), delete=False, buffering=0
    )
    try:
        _write_all(tmp, data)
        return tmp
    except BaseException:
        tmp.close()
        try:
            os.remove(tmp.name)
        except OSError:
            pass
        raise


def _finish_large_file(tmp, path, data):
    """Write any remaining buffered bytes, close the temp file, and atomically replace target path."""
    if data:
        _write_all(tmp, data)
    tmp.close()
    os.replace(tmp.name, path)


def _cleanup_temp_file(tmp):
    """Close and remove an incomplete temp file on error."""
    try:
        tmp.close()
    finally:
        try:
            os.remove(tmp.name)
        except OSError:
            pass


class IncompleteStreamError(Exception):
    """The source stream ended with a different number of bytes than expected."""

    def __init__(self, expected, received):
        self.expected = expected
        self.received = received
        super().__init__(f'Expected {expected} bytes but received {received}')


async def update_file(path, stream, expected_size=None):
    """Atomically update a file on disk with a path and source stream.

    If expected_size is provided, the target path is only replaced when exactly
    that many bytes were read. A client disconnect looks like EOF to the stream
    reader, so without this check a truncated upload would be committed.
    Raises IncompleteStreamError and leaves the target untouched on mismatch.
    """
    buf = bytearray()
    tmp = None
    received = 0
    try:
        while True:
            chunk = await stream.read(CHUNK_SIZE_BYTES)
            if not chunk:
                break
            received += len(chunk)
            if expected_size is not None and received > expected_size:
                raise IncompleteStreamError(expected_size, received)
            buf.extend(chunk)
            if len(buf) >= WRITE_BUFFER_SIZE:
                if tmp is None:
                    tmp = await asyncio.to_thread(_open_and_write_chunk, path, buf)
                else:
                    await asyncio.to_thread(_write_all, tmp, buf)
                buf.clear()

        if expected_size is not None and received != expected_size:
            raise IncompleteStreamError(expected_size, received)

        if tmp is None:
            await asyncio.to_thread(_write_small_file, path, buf)
        else:
            await asyncio.to_thread(_finish_large_file, tmp, path, buf)
    except BaseException:
        if tmp is not None:
            await asyncio.to_thread(_cleanup_temp_file, tmp)
        raise
