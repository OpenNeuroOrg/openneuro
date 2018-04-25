import falcon


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
            datalad.create()
            if (datalad.repo):
                self.store.set_config(datalad, 'jstiehl', 'jstiehl@gmail.com')
                resp.media = {}
                resp.status = falcon.HTTP_OK
            else:
                resp.media = {'error': 'dataset creation failed'}
                resp.status = falcon.HTTP_500

    def on_delete(self, req, resp, dataset):
        datalad = self.store.get_dataset(dataset)
        if (datalad.repo):
            datalad.remove()
            resp.media = {}
            resp.status = falcon.HTTP_OK
        else:
            resp.media = {'error': 'dataset not found'}
            resp.status = falcon.HTTP_NOT_FOUND
