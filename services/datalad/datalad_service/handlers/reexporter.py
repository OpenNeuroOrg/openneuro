import falcon
import logging
import gevent

from datalad_service.tasks.publish import reexport_dataset

class ReexporterResource(object):
    def __init__(self, store):
        self.store = store
        self.logger = logging.getLogger('datalad_service.' + __name__)

    def on_post(self, req, resp, dataset):
        gevent.spawn(reexport_dataset, self.store,
                        dataset, req.cookies)
        resp.status = falcon.HTTP_OK