import os
import re

import falcon

from .common.annex import get_repo_files


def get_from_header(req):
    """Parse the From header for a request."""
    matches = re.match(r"\"(.*)\" <(.*?@.*)>", req.headers['FROM'])
    return matches.group(1), matches.group(2)


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

    def on_get(self, req, resp, dataset, filename=None):
        ds_path = self.store.get_dataset_path(dataset)
        if filename:
            try:
                fd = open(os.path.join(ds_path, filename), 'rb')
                resp.stream = fd
                resp.stream_len = os.fstat(fd.fileno()).st_size
                resp.status = falcon.HTTP_OK
            except FileNotFoundError:
                resp.media = {'error': 'file does not exist'}
                resp.status = falcon.HTTP_NOT_FOUND
        else:
            # Request for index of files
            # Return a list of file objects
            # {name, path, size}
            files = get_repo_files(self.store.get_dataset(dataset))
            resp.media = {'files': files}


    def on_post(self, req, resp, dataset, filename):
        """Post will only create new files and always adds them to the annex."""
        if filename:
            ds_path = self.store.get_dataset_path(dataset)
            try:
                # Make any missing parent directories
                file_path = os.path.join(ds_path, filename)
                os.makedirs(os.path.dirname(file_path), exist_ok=True)
                # Begin writing stream to disk
                self._update_file(file_path, req.stream)
                # Add to dataset
                ds = self.store.get_dataset(dataset)
                media_dict = {'created': filename}
                # Record if this was done on behalf of a user
                if 'FROM' in req.headers:
                    name, email = get_from_header(req)
                    media_dict['name'] = name
                    media_dict['email'] = email
                    self.store.set_config(ds, media_dict['name'], media_dict['email'])
                ds.add(path=filename)
                ds.publish(to='github')
                resp.media = media_dict
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
            if os.path.exists(file_path):
                media_dict = {'updated': filename}
                # Record if this was done on behalf of a user
                if 'FROM' in req.headers:
                    name, email = get_commit_info(req)
                    media_dict['name'] = name
                    media_dict['email'] = email
                    self.store.set_config(ds, media_dict['name'], media_dict['email'])
                ds = self.store.get_dataset(dataset)
                ds.unlock(path=filename)
                self._update_file(file_path, req.stream)
                ds.add(path=filename)
                ds.publish(to='github')
                resp.media = media_dict
                resp.status = falcon.HTTP_OK
            else:
                resp.media = {'error': 'no such file'}
                resp.status = falcon.HTTP_NOT_FOUND
        else:
            resp.media = {'error': 'filename is missing'}
            resp.status = falcon.HTTP_BAD_REQUEST
