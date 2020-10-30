import falcon

class HistoryResource(object):
    def __init__(self, store):
        self.store = store

    def on_get(self, req, resp, dataset):
        """
        Return dataset history (text format)
        """
        if dataset:
            ds = self.store.get_dataset(dataset)
            resp.media = {'log': ds.repo.get_revisions(fmt='%H %ai %cn <%ce> %d %s')}
            resp.status = falcon.HTTP_OK
        else:
            resp.status = falcon.HTTP_NOT_FOUND