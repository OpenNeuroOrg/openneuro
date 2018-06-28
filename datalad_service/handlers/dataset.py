import falcon

from datalad_service.common.annex import get_user_info
from datalad_service.common.celery import dataset_queue
from datalad_service.tasks.dataset import *


class DatasetResource(object):

    """A Falcon API wrapper around underlying datalad/git-annex datasets."""

    def __init__(self, store):
        self.store = store

    def on_get(self, req, resp, dataset):
        datalad = self.store.get_dataset(dataset)
        # repo will only be defined if it already exists
        if (datalad.repo):
            dataset_description = {
                'accession_number': dataset,
            }

            resp.media = dataset_description
            resp.status = falcon.HTTP_OK
        else:
            resp.media = {'error': 'dataset not found'}
            resp.status = falcon.HTTP_NOT_FOUND

    def on_post(self, req, resp, dataset):
        datalad = self.store.get_dataset(dataset)
        if (datalad.repo):
            resp.media = {'error': 'dataset already exists'}
            resp.status = falcon.HTTP_CONFLICT
        else:
            queue = dataset_queue(dataset)
            # Record if this was done on behalf of a user
            name, email = get_user_info(req)

            created = create_dataset.apply_async(
                queue=queue, args=(self.store.annex_path, dataset, name, email))
            created.wait()
            if created.failed():
                resp.media = {'error': 'dataset creation failed'}
                resp.status = falcon.HTTP_500
            else:
                resp.media = {}
                resp.status = falcon.HTTP_OK

    def on_delete(self, req, resp, dataset):
        queue = dataset_queue(dataset)
        deleted = delete_dataset.apply_async(
            queue=queue, args=(self.store.annex_path, dataset))
        deleted.wait()
        if deleted.failed():
            resp.media = {'error': 'dataset not found'}
            resp.status = falcon.HTTP_NOT_FOUND
        else:
            resp.media = {}
            resp.status = falcon.HTTP_OK
