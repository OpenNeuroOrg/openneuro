import falcon
import json
from datalad.api import Dataset


class DatasetResource(object):

    """A Falcon API wrapper around underlying datalad/git-annex datasets."""

    def __init__(self, annex_path):
        self.annex_path = annex_path

    def on_get(self, req, resp, dataset):
        path = '{}/{}'.format(self.annex_path, dataset)
        datalad = Dataset(path=path)
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
        dataset = Dataset(path=dataset)
        dataset.create()

        resp.body = json.dumps()
