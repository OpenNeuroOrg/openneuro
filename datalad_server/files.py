import json
import falcon


class FilesResource(object):
    def __init__(self, store):
      self.store = store

    def on_get(self, req, resp):
        doc = {
            'alive': True,
        }

        resp.body = json.dumps(doc, ensure_ascii=False)

        resp.status = falcon.HTTP_200
