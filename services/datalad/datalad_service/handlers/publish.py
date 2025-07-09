import asyncio
from concurrent.futures import ProcessPoolExecutor

import falcon

from datalad_service.tasks.publish import create_remotes_and_export


executor = ProcessPoolExecutor(4)


class PublishResource:
    """A Falcon API wrapper around underlying datalad/git-annex datasets."""

    def __init__(self, store):
        self.store = store

    async def on_post(self, req, resp, dataset):
        dataset_path = self.store.get_dataset_path(dataset)
        executor.submit(create_remotes_and_export, dataset_path, cookies=req.cookies)
        resp.media = {}
        resp.status = falcon.HTTP_OK
