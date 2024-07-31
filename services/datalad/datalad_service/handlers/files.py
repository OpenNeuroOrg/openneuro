import logging
import os

import falcon
import pygit2
import aiofiles

from datalad_service.common.git import git_show
from datalad_service.common.user import get_user_info
from datalad_service.common.stream import update_file
from datalad_service.tasks.files import remove_files


class FilesResource:

    def __init__(self, store):
        self.store = store
        self.logger = logging.getLogger('datalad_service.' + __name__)

    async def on_get(self, req, resp, dataset, filename, snapshot='HEAD'):
        ds_path = self.store.get_dataset_path(dataset)
        try:
            try:
                file_content = git_show(ds_path, snapshot, filename)
                # If the file begins with an annex path, return that path
                if file_content[0:4096].find('.git/annex') != -1:
                    # Resolve absolute path for annex target
                    target_path = os.path.normpath(os.path.join(
                        ds_path, os.path.dirname(filename), file_content))
                    # Verify the annex path is within the dataset dir
                    if ds_path == os.path.commonpath((ds_path, target_path)):
                        fd = await aiofiles.open(target_path, 'rb')
                        resp.set_stream(fd, os.fstat(fd.fileno()).st_size)
                        resp.status = falcon.HTTP_OK
                    else:
                        resp.media = {'error': 'file not found in git tree'}
                        resp.status = falcon.HTTP_NOT_FOUND
                else:
                    resp.text = file_content
                    resp.status = falcon.HTTP_OK
            except pygit2.GitError:
                resp.status = falcon.HTTP_NOT_FOUND
                resp.media = {'error': 'dataset repository does not exist or could not be opened'}
        except KeyError:
            # File is not present in tree
            resp.media = {'error': 'file not found in git tree'}
            resp.status = falcon.HTTP_NOT_FOUND
        except OSError:
            # File is not kept locally
            resp.media = {'error': 'file not found'}
            resp.status = falcon.HTTP_NOT_FOUND
        except:
            # Some unknown error
            resp.media = {
                'error': 'an unknown error occurred accessing this file'}
            resp.status = falcon.HTTP_INTERNAL_SERVER_ERROR
            self.logger.exception(
                f'An unknown error processing file "{filename}"')

    async def on_post(self, req, resp, dataset, filename):
        """Post will create new files and adds them to the annex if they do not exist, else update existing files."""
        if filename:
            ds_path = self.store.get_dataset_path(dataset)
            file_path = os.path.join(ds_path, filename)
            if os.path.exists(file_path):
                media_dict = {'updated': filename}
                # Record if this was done on behalf of a user
                name, email = get_user_info(req)
                if name and email:
                    media_dict['name'] = name
                    media_dict['email'] = email
                await update_file(file_path, req.stream)
                resp.media = media_dict
                resp.status = falcon.HTTP_OK
            else:
                try:
                    # Make any missing parent directories

                    os.makedirs(os.path.dirname(file_path), exist_ok=True)
                    # Begin writing stream to disk
                    await update_file(file_path, req.stream)
                    media_dict = {'created': filename}
                    resp.media = media_dict
                    resp.status = falcon.HTTP_OK
                except PermissionError:
                    resp.media = {'error': 'file already exists'}
                    resp.status = falcon.HTTP_CONFLICT
        else:
            resp.media = {'error': 'filename is missing'}
            resp.status = falcon.HTTP_BAD_REQUEST

    async def on_delete(self, req, resp, dataset):
        """Delete an existing file from a dataset"""
        media = await req.get_media()
        if media:
            ds_path = self.store.get_dataset_path(dataset)
            files_to_delete = []
            dirs_to_delete = []
            paths_not_found = []
            filenames = [filename.replace(':', '/')
                         for filename in media['filenames']]
            for filename in filenames:
                file_path = os.path.join(ds_path, filename)
                if os.path.exists(file_path):
                    if os.path.isdir(file_path):
                        dirs_to_delete.append(filename)
                    else:
                        files_to_delete.append(filename)
                else:
                    paths_not_found.append(filename)

            if len(paths_not_found) == 0:
                media_dict = {'deleted': dirs_to_delete + files_to_delete}
                name, email = get_user_info(req)
                if name and email:
                    media_dict['name'] = name
                    media_dict['email'] = email
                try:
                    if len(dirs_to_delete) > 0:
                        remove_files(
                            self.store, dataset, dirs_to_delete, name=name, email=email, cookies=req.cookies)
                        resp.status = falcon.HTTP_INTERNAL_SERVER_ERROR
                    if len(files_to_delete) > 0:
                        remove_files(self.store, dataset, files_to_delete,
                                     name=name, email=email, cookies=req.cookies)
                    resp.media = media_dict
                    resp.status = falcon.HTTP_OK
                except:
                    resp.status = falcon.HTTP_INTERNAL_SERVER_ERROR
                    raise
            else:
                resp.media = {
                    'error': f'the following files not found: {", ".join(paths_not_found)}'}
        else:
            resp.media = {
                'error': 'recursive query or request body is missing'}
            resp.status = falcon.HTTP_BAD_REQUEST
