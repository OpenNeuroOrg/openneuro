import falcon
import gevent

from datalad_service.tasks.publish import publish_dataset


class PublishResource(object):

    """A Falcon API wrapper around underlying datalad/git-annex datasets."""

    def __init__(self, store):
        self.store = store

    def on_post(self, req, resp, dataset):
        dataset_path = self.store.get_dataset_path(dataset)

        gevent.spawn(publish_dataset, dataset_path, cookies=req.cookies)
        resp.media = {}
        resp.status = falcon.HTTP_OK
