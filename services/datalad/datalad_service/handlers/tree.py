import logging

import falcon

from datalad_service.common.bids import dataset_sort
from datalad_service.tasks.files import get_trees


class TreeResource:
    def __init__(self, store):
        self.store = store
        self.logger = logging.getLogger('datalad_service.' + __name__)

    async def on_post(self, req, resp, dataset):
        """Resolve one or more tree hashes in minimal git operations."""
        try:
            body = await req.get_media()
            tree_hashes = body.get('trees', [])
            if not tree_hashes:
                resp.status = falcon.HTTP_BAD_REQUEST
                resp.media = {'error': 'trees list is required'}
                return
            results = await get_trees(self.store, dataset, tree_hashes)
            for tree_hash in results:
                results[tree_hash].sort(key=dataset_sort)
            resp.status = falcon.HTTP_OK
            resp.media = {'trees': results}
        except FileNotFoundError:
            resp.status = falcon.HTTP_NOT_FOUND
            resp.media = {'error': 'Dataset does not exist'}
