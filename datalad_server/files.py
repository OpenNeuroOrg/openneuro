import os
import falcon


class FilesResource(object):
    _CHUNK_SIZE_BYTES = 4096

    def __init__(self, store):
        self.store = store

    def on_get(self, req, resp, dataset, filename):
        ds_path = self.store.get_dataset_path(dataset)
        fd = open(os.path.join(ds_path, filename), 'rb')
        resp.stream = fd
        resp.stream_len = os.fstat(fd.fileno()).st_size
        resp.status = falcon.HTTP_OK

    def on_post(self, req, resp, dataset, filename):
        if filename:
            ds_path = self.store.get_dataset_path(dataset)
            with open(os.path.join(ds_path, filename), 'wb') as new_file:
                # Stream file to disk
                while True:
                    chunk = req.stream.read(self._CHUNK_SIZE_BYTES)
                    if not chunk:
                        break
                    new_file.write(chunk)
                # Add to dataset
                ds = self.store.get_dataset(dataset)
                ds.add(path=filename)
                resp.media = {'created': filename}
                resp.status = falcon.HTTP_OK
        else:
            resp.media = {'error': 'filename is missing'}
            resp.status = falcon.HTTP_BAD_REQUEST
