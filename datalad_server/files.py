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
