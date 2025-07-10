import os
import aiofiles

from datalad_service.common.const import CHUNK_SIZE_BYTES


async def update_file(path, stream):
    """Atomically update a file on disk with a path and source stream."""
    # Delete is disabled here because we want to keep the file without double linking it
    async with aiofiles.tempfile.NamedTemporaryFile(
        dir=os.path.dirname(path), delete=False
    ) as tmp:
        try:
            # Stream file to disk
            while True:
                chunk = await stream.read(CHUNK_SIZE_BYTES)
                if not chunk:
                    break
                await tmp.write(chunk)
            # Done streaming, replace the file
            os.replace(tmp.name, path)
        except:
            # Only remove in the failure case, we want the file if the rest succeeds
            os.remove(tmp.name)
            raise
