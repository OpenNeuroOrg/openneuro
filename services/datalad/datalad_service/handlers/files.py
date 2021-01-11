import logging
import os
from subprocess import CalledProcessError

import falcon

import git
from datalad_service.common.git import git_show
from datalad_service.common.user import get_user_info
from datalad_service.common.stream import update_file
from datalad_service.tasks.files import get_files
from datalad_service.tasks.files import get_untracked_files
from datalad_service.tasks.files import remove_files
from datalad_service.tasks.files import remove_recursive
from datalad_service.tasks.files import unlock_files


class FilesResource(object):

    def __init__(self, store):
        self.store = store
        self.logger = logging.getLogger('datalad_service.' + __name__)

    def on_get(self, req, resp, dataset, filename=None, snapshot='HEAD'):
        ds_path = self.store.get_dataset_path(dataset)
        if filename:
            try:
                ds = self.store.get_dataset(dataset)
                if ds.repo.is_under_annex([filename])[0]:
                    path = git_show(ds_path, snapshot + ':' + filename)
                    # remove leading relative folder paths
                    fd = path[path.find('.git/annex'):]

                    # if fd fails, that means the file is not present in the annex and we need to get it from s3
                    # so we send the client a 404 to indicate the file was not found locally.
                    fd = open(os.path.join(ds_path, fd), 'rb')
                    resp.stream = fd
                    resp.stream_len = os.fstat(fd.fileno()).st_size
                    resp.status = falcon.HTTP_OK
                else:
                    resp.body = git_show(ds_path, snapshot + ':' + filename)
                    resp.status = falcon.HTTP_OK
            except CalledProcessError:
                # File is not present in tree
                resp.media = {'error': 'file not found in git tree'}
                resp.status = falcon.HTTP_NOT_FOUND
            except IOError:
                # File is not kept locally
                resp.media = {'error': 'file not found'}
                resp.status = falcon.HTTP_NOT_FOUND
            except:
                # Some unknown error
                resp.media = {
                    'error': 'an unknown error occurred accessing this file'}
                resp.status = falcon.HTTP_INTERNAL_SERVER_ERROR
                self.logger.exception(
                    'An unknown error processing file "{}"'.format(filename))
        else:
            # Request for index of files
            # Return a list of file objects
            # {name, path, size}
            try:
                if "untracked" in req.params:
                    files = get_untracked_files(self.store, dataset)
                    resp.media = {'files': files}
                else:
                    files = get_files(self.store, dataset, snapshot)
                    resp.media = {'files': files}
            except:
                resp.status = falcon.HTTP_INTERNAL_SERVER_ERROR

    def on_post(self, req, resp, dataset, filename):
        """Post will create new files and adds them to the annex if they do not exist, else update existing files."""
        if filename:
            ds_path = self.store.get_dataset_path(dataset)
            file_path = os.path.join(ds_path, filename)
            if os.path.exists(file_path):
                ds = self.store.get_dataset(dataset)
                media_dict = {'updated': filename}
                # Record if this was done on behalf of a user
                name, email = get_user_info(req)
                if name and email:
                    media_dict['name'] = name
                    media_dict['email'] = email
                unlock_files(self.store, dataset, files=[filename])
                update_file(file_path, req.stream)
                resp.media = media_dict
                resp.status = falcon.HTTP_OK
            else:
                try:
                    # Make any missing parent directories

                    os.makedirs(os.path.dirname(file_path), exist_ok=True)
                    # Begin writing stream to disk
                    update_file(file_path, req.stream)
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

    def on_delete(self, req, resp, dataset, filename):
        """Delete an existing file from a dataset"""
        if filename:
            ds_path = self.store.get_dataset_path(dataset)
            file_path = os.path.join(ds_path, filename)
            if os.path.exists(file_path):
                media_dict = {'deleted': filename}
                name, email = get_user_info(req)
                if name and email:
                    media_dict['name'] = name
                    media_dict['email'] = email
                try:
                    # The recursive flag removes the entire tree in one commit
                    if 'recursive' in req.params and req.params['recursive'] != 'false':
                        remove_recursive(
                            self.store, dataset, filename, name=name, email=email, cookies=req.cookies)
                    else:
                        remove_files(self.store, dataset, files=[
                            filename], name=name, email=email, cookies=req.cookies)
                    resp.media = media_dict
                    resp.status = falcon.HTTP_OK
                except:
                    resp.status = falcon.HTTP_INTERNAL_SERVER_ERROR
            else:
                resp.media = {'error': 'no such file'}
                resp.status = falcon.HTTP_NOT_FOUND
        else:
            resp.media = {'error': 'filename is missing'}
            resp.status = falcon.HTTP_BAD_REQUEST
