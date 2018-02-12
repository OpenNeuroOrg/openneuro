import os
import falcon


class FilesResource(object):
    _CHUNK_SIZE_BYTES = 4096

    def __init__(self, store):
        self.store = store

    def _update_file(self, path, stream):
        """Update a file on disk with a path and source stream."""
        with open(path, 'wb') as new_file:
            # Stream file to disk
            while True:
                chunk = stream.read(self._CHUNK_SIZE_BYTES)
                if not chunk:
                    break
                new_file.write(chunk)

    def on_get(self, req, resp, dataset, filename):
        ds_path = self.store.get_dataset_path(dataset)
        try:
            fd = open(os.path.join(ds_path, filename), 'rb')
            resp.stream = fd
            resp.stream_len = os.fstat(fd.fileno()).st_size
            resp.status = falcon.HTTP_OK
        except FileNotFoundError:
            resp.media = {'error': 'file does not exist'}
            resp.status = falcon.HTTP_NOT_FOUND

    def on_post(self, req, resp, dataset, filename):
        """Post will only create new files and always adds them to the annex."""
        if filename:
            ds_path = self.store.get_dataset_path(dataset)
            try:
                self._update_file(os.path.join(ds_path, filename), req.stream)
                # Add to dataset
                ds = self.store.get_dataset(dataset)
                ds.add(path=filename)
                resp.media = {'created': filename}
                resp.status = falcon.HTTP_OK
            except PermissionError:
                resp.media = {'error': 'file already exists'}
                resp.status = falcon.HTTP_CONFLICT
        else:
            resp.media = {'error': 'filename is missing'}
            resp.status = falcon.HTTP_BAD_REQUEST

    def on_put(self, req, resp, dataset, filename):
        """Put will only update existing files and automatically unlocks them."""
        if filename:
            ds_path = self.store.get_dataset_path(dataset)
            file_path = os.path.join(ds_path, filename)
            if os.stat(file_path):
                ds = self.store.get_dataset(dataset)
                ds.unlock(path=filename)
                self._update_file(file_path, req.stream)
                ds.add(path=filename)
                resp.media = {'updated': filename}
                resp.status = falcon.HTTP_OK
            else:
                resp.media = {'error': 'no such file'}
                resp.status = falcon.HTTP_NOT_FOUND
        else:
            resp.media = {'error': 'filename is missing'}
            resp.status = falcon.HTTP_BAD_REQUEST
