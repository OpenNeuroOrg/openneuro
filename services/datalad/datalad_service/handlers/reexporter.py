import falcon
import logging
import gevent

from datalad_service.tasks.publish import migrate_to_bucket

class ReexporterResource(object):
    def __init__(self, store):
        self.store = store
        self.logger = logging.getLogger('datalad_service.' + __name__)

    def on_post(self, req, resp, dataset):
        gevent.spawn(migrate_to_bucket, self.store,
                        dataset, req.cookies, reexport=True)
        resp.status = falcon.HTTP_OK