import falcon


class FilesResource(object):

    def __init__(self, store):
        self.store = store

    def on_get(self, req, resp):
        doc = {
            'alive': True,
        }

        resp.media = doc

        resp.status = falcon.HTTP_200

    def on_post(self, req, resp, dataset, filename):
        if filename:
            pass
        else:
            resp.media = {'error': 'filename is missing'}
            resp.status = falcon.HTTP_BAD_REQUEST
