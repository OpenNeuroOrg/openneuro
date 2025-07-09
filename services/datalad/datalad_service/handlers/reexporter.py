import asyncio

import falcon
import logging

from datalad_service.tasks.publish import export_dataset


class ReexporterResource:
    def __init__(self, store):
        self.store = store
        self.logger = logging.getLogger('datalad_service.' + __name__)

    async def on_post(self, req, resp, dataset):
        dataset_path = self.store.get_dataset_path(dataset)
        asyncio.get_event_loop().run_in_executor(
            None, export_dataset, dataset_path, cookies=req.cookies
        )
        resp.status = falcon.HTTP_OK
