import logging
import os
import pathlib
import aioshutil

import falcon
import pygit2

from datalad_service.common.git import git_commit
from datalad_service.common.user import get_user_info


async def move_files(upload_path, dataset_path):
    for filename in pathlib.Path(upload_path).glob('**/*'):
        if os.path.isfile(filename):
            target = os.path.join(
                dataset_path, os.path.relpath(filename, start=upload_path)
            )
            pathlib.Path(target).parent.mkdir(parents=True, exist_ok=True)
            await aioshutil.move(str(filename), target)


async def move_files_into_repo(
    dataset_id, dataset_path, upload_path, name, email, cookies
):
    repo = pygit2.Repository(dataset_path)
    unlock_files = [
        os.path.relpath(filename, start=upload_path)
        for filename in pathlib.Path(upload_path).glob('**/*')
        if os.path.islink(
            os.path.join(dataset_path, os.path.relpath(filename, start=upload_path))
        )
    ]
    await move_files(upload_path, dataset_path)
    if name and email:
        author = pygit2.Signature(name, email)
        hexsha = str(await git_commit(repo, unlock_files, author))
    else:
        hexsha = str(await git_commit(repo, unlock_files))


class UploadResource:
    def __init__(self, store):
        self.store = store
        self.logger = logging.getLogger('datalad_service.' + __name__)

    async def _finish_upload(self, dataset_id, upload, name, email, cookies):
        try:
            dataset_path = self.store.get_dataset_path(dataset_id)
            upload_path = self.store.get_upload_path(dataset_id, upload)
            await move_files_into_repo(
                dataset_id, dataset_path, upload_path, name, email, cookies
            )
            await aioshutil.rmtree(upload_path)
        except:
            self.logger.exception('Dataset upload could not be finalized')

    async def on_post(self, req, resp, dataset, upload):
        """Copy uploaded data into dataset"""
        name, email = get_user_info(req)
        await self._finish_upload(dataset, upload, name, email, req.cookies)
        resp.media = {}
        resp.status = falcon.HTTP_OK
