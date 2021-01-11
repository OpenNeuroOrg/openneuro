CHUNK_SIZE_BYTES = 2048


def update_file(path, stream):
    """Update a file on disk with a path and source stream."""
    with open(path, 'wb') as new_file:
        # Stream file to disk
        while True:
            chunk = stream.read(CHUNK_SIZE_BYTES)
            if not chunk:
                break
            new_file.write(chunk)


def pipe_chunks(reader, writer):
    while True:
        chunk = reader.read(CHUNK_SIZE_BYTES)
        if not chunk:
            break
        writer.write(chunk)
