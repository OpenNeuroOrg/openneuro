import asyncio

import aiofiles.os
import falcon
import pygit2

from datalad_service.common.user import get_user_info
from datalad_service.tasks.dataset import create_dataset
from datalad_service.tasks.dataset import delete_dataset
from datalad_service.tasks.publish import delete_siblings


class DatasetResource:
    """A Falcon API wrapper around underlying datalad/git-annex datasets."""

    def __init__(self, store):
        self.store = store

    async def on_get(self, req, resp, dataset):
        ds_path = self.store.get_dataset_path(dataset)
        if await aiofiles.os.path.isdir(ds_path):
            dataset_description = {
                'accession_number': dataset,
            }

            resp.media = dataset_description
            resp.status = falcon.HTTP_OK
        else:
            resp.media = {'error': 'dataset not found'}
            resp.status = falcon.HTTP_NOT_FOUND

    async def on_post(self, req, resp, dataset):
        ds_path = self.store.get_dataset_path(dataset)
        if await aiofiles.os.path.isdir(ds_path):
            resp.media = {'error': 'dataset already exists'}
            resp.status = falcon.HTTP_CONFLICT
        else:
            # Record if this was done on behalf of a user
            name, email = get_user_info(req)
            if name and email:
                author = pygit2.Signature(name, email)
            else:
                author = None
            hexsha = await create_dataset(self.store, dataset, author)
            resp.media = {'hexsha': hexsha}
            resp.status = falcon.HTTP_OK

    async def on_delete(self, req, resp, dataset):
        dataset_path = self.store.get_dataset_path(dataset)

        if await aiofiles.os.path.exists(dataset_path):
            repo = pygit2.Repository(dataset_path)
            if 'github' in repo.remotes.names():
                await delete_siblings(dataset)

            await delete_dataset(dataset_path)

            resp.media = {}
            resp.status = falcon.HTTP_OK
        else:
            resp.media = {'error': 'dataset does not exist'}
            resp.status = falcon.HTTP_NOT_FOUND
