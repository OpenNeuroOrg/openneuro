import falcon
import json


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

            resp.body = json.dumps(dataset_description, ensure_ascii=False)
            resp.status = falcon.HTTP_OK
        else:
            resp.body = json.dumps(
                {'error': 'dataset not found'}, ensure_ascii=False)
            resp.status = falcon.HTTP_NOT_FOUND

    def on_post(self, req, resp, dataset):
        datalad = self.store.get_dataset(dataset)
        if (datalad.repo):
            resp.body = json.dumps({'error': 'dataset already exists'})
            resp.status = falcon.HTTP_CONFLICT
        else:
            datalad.create()

            if (datalad.repo):
                resp.body = json.dumps({})
                resp.status = falcon.HTTP_OK
            else:
                resp.body = json.dumps({'error': 'dataset creation failed'})
                resp.status = falcon.HTTP_500
