import logging

import falcon

from datalad_service.common.bids import dataset_sort
from datalad_service.tasks.files import get_tree


class TreeResource:
    def __init__(self, store):
        self.store = store
        self.logger = logging.getLogger('datalad_service.' + __name__)

    async def on_get(self, req, resp, dataset, tree):
        # Request for index of files
        # Return a list of file objects
        # {name, path, size}
        try:
            files = await get_tree(self.store, dataset, tree)
            files.sort(key=dataset_sort)
            resp.status = falcon.HTTP_OK
            resp.media = {'files': files}
        except FileNotFoundError:
            resp.status = falcon.HTTP_NOT_FOUND
            resp.media = {'error': 'Dataset does not exist'}
