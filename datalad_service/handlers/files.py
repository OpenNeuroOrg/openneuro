import os

import falcon

from datalad_service.common.annex import get_from_header
from datalad_service.common.celery import dataset_queue
from datalad_service.tasks.files import unlock_files, commit_files, get_files, remove_files


class FilesResource(object):
    _CHUNK_SIZE_BYTES = 4096

    def __init__(self, store):
        self.store = store

    @property
    def annex_path(self):
        return self.store.annex_path

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
        print('dataset:', dataset)
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
            queue = dataset_queue(dataset)
            files = get_files.apply_async(
                queue=queue, args=(self.store.annex_path, dataset))
            resp.media = {'files': files.get()}

    def on_post(self, req, resp, dataset, filename):
        """Post will create new files and adds them to the annex if they do not exist, else update existing files."""
        queue = dataset_queue(dataset)
        if filename:
            ds_path = self.store.get_dataset_path(dataset)
            file_path = os.path.join(ds_path, filename)
            if os.path.exists(file_path):
                ds = self.store.get_dataset(dataset)
                media_dict = {'updated': filename}
                # Record if this was done on behalf of a user
                name, email = get_from_header(req)
                if name and email:
                    media_dict['name'] = name
                    media_dict['email'] = email
                unlock = unlock_files.apply_async(queue=queue, args=(self.annex_path, dataset), kwargs={
                                                  'files': [filename]})
                unlock.wait()
                self._update_file(file_path, req.stream)
                commit = commit_files.apply_async(queue=queue, args=(self.annex_path, dataset), kwargs={
                                                  'files': [filename], 'name': name, 'email': email})
                commit.wait()
                # ds.publish(to='github')
                if not commit.failed():
                    resp.media = media_dict
                    resp.status = falcon.HTTP_OK
                resp.media = media_dict
                resp.status = falcon.HTTP_OK
            else:
                try:
                    # Make any missing parent directories
                    
                    os.makedirs(os.path.dirname(file_path), exist_ok=True)
                    # Begin writing stream to disk
                    self._update_file(file_path, req.stream)
                    # Add to dataset
                    ds = self.store.get_dataset(dataset)
                    media_dict = {'created': filename}
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
        queue = dataset_queue(dataset)
        if filename:
            ds_path = self.store.get_dataset_path(dataset)
            file_path = os.path.join(ds_path, filename)
            if os.path.exists(file_path):
                ds = self.store.get_dataset(dataset)
                media_dict = {'updated': filename}
                # Record if this was done on behalf of a user
                name, email = get_from_header(req)
                if name and email:
                    media_dict['name'] = name
                    media_dict['email'] = email
                unlock = unlock_files.apply_async(queue=queue, args=(self.annex_path, dataset), kwargs={
                                                  'files': [filename]})
                unlock.wait()
                self._update_file(file_path, req.stream)
                commit = commit_files.apply_async(queue=queue, args=(self.annex_path, dataset), kwargs={
                                                  'files': [filename], 'name': name, 'email': email})
                commit.wait()
                # ds.publish(to='github')
                if not commit.failed():
                    resp.media = media_dict
                    resp.status = falcon.HTTP_OK
                resp.media = media_dict
                resp.status = falcon.HTTP_OK
            else:
                resp.media = {'error': 'no such file'}
                resp.status = falcon.HTTP_NOT_FOUND
        else:
            resp.media = {'error': 'filename is missing'}
            resp.status = falcon.HTTP_BAD_REQUEST

    def on_delete(self, req, resp, dataset, filename):
        """Delete an existing file from a dataset"""
        queue = dataset_queue(dataset)
        if filename:
            ds_path = self.store.get_dataset_path(dataset)
            file_path = os.path.join(ds_path, filename)    
            if os.path.exists(file_path):
                ds = self.store.get_dataset(dataset)
                media_dict = {'deleted': filename}
                name, email = get_from_header(req)
                if name and email:
                    media_dict['name'] = name
                    media_dict['email'] = email

                # unlock = unlock_files.apply_async(queue=queue, args=(self.annex_path, dataset), kwargs={'files': [filename]})
                # unlock.wait()
                
                remove = remove_files.apply_async(queue=queue, args=(self.annex_path, dataset), kwargs={'files': [filename]})
                remove.wait()
                
                resp.media = media_dict
                resp.status = falcon.HTTP_OK
            else:
                resp.media = {'error': 'no such file'}
                resp.status = falcon.HTTP_NOT_FOUND          
        else:
            resp.media = {'error': 'filename is missing'}
            resp.status = falcon.HTTP_BAD_REQUEST