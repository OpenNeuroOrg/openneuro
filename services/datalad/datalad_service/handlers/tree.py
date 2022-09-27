import logging

import falcon

from datalad_service.tasks.files import get_tree


class TreeResource(object):
    def __init__(self, store):
        self.store = store
        self.logger = logging.getLogger('datalad_service.' + __name__)

    def on_get(self, req, resp, dataset, tree):
        # Request for index of files
        # Return a list of file objects
        # {name, path, size}
        try:
            files = get_tree(self.store, dataset, tree)
            resp.media = {'files': files}
        except:
            resp.status = falcon.HTTP_INTERNAL_SERVER_ERROR