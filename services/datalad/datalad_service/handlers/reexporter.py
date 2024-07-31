import falcon
import logging
import gevent

from datalad_service.tasks.publish import export_dataset


class ReexporterResource:
    def __init__(self, store):
        self.store = store
        self.logger = logging.getLogger('datalad_service.' + __name__)

    async def on_post(self, req, resp, dataset):
        dataset_path = self.store.get_dataset_path(dataset)
        gevent.spawn(export_dataset, dataset_path, req.cookies)
        resp.status = falcon.HTTP_OK
