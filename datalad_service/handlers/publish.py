import falcon

from datalad_service.common.annex import get_user_info
from datalad_service.common.celery import dataset_queue
from datalad_service.tasks.dataset import *
from datalad_service.tasks.publish import migrate_to_bucket


class PublishResource(object):

    """A Falcon API wrapper around underlying datalad/git-annex datasets."""

    def __init__(self, store):
        self.store = store

    def on_post(self, req, resp, dataset):
        datalad = self.store.get_dataset(dataset)
        queue = dataset_queue(dataset)
        publish = migrate_to_bucket.s(self.store.annex_path, dataset, cookies=req.cookies)
        publish.apply_async(queue=queue)
        resp.media = {}
        resp.status = falcon.HTTP_OK
    
    def on_delete(self, req, resp, dataset):
        datalad = self.store.get_dataset
        queue = dataset_queue(dataset)
        publish = migrate_to_bucket.s(self.store.annex_path, dataset, cookies=req.cookies, realm='PRIVATE')
        publish.apply_async(queue=queue)
        resp.media = {}
        resp.status = falcon.HTTP_OK