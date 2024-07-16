import os
import tempfile
import zlib

CHUNK_SIZE_BYTES = 2048


def update_file(path, stream):
    """Atomically update a file on disk with a path and source stream."""
    # Delete is disabled here because we want to keep the file without double linking it
    with tempfile.NamedTemporaryFile(dir=os.path.dirname(path), delete=False) as tmp:
        try:
            # Stream file to disk
            while True:
                chunk = stream.read(CHUNK_SIZE_BYTES)
                if not chunk:
                    break
                tmp.write(chunk)
            # Done streaming, replace the file
            os.replace(tmp.name, path)
        except:
            # Only remove in the failure case, we want the file if the rest succeeds
            os.remove(tmp.name)
            raise


def pipe_chunks(reader, writer, gzipped=False):
    # If gzipped, we have to read the entire request and write once
    if gzipped:
        writer.write(zlib.decompress(reader.read(), zlib.MAX_WBITS|32))
    else:
        while True:
            chunk = reader.read(CHUNK_SIZE_BYTES)
            if not chunk:
                break
            writer.write(chunk)
