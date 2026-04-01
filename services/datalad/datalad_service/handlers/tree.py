import logging

import falcon
import pygit2

from datalad_service.common.bids import dataset_sort
from datalad_service.common.tag_cache import read_tag_cache_raw
from datalad_service.tasks.files import get_tree, populate_tag_cache


class TreeResource:
    def __init__(self, store):
        self.store = store
        self.logger = logging.getLogger('datalad_service.' + __name__)

    async def on_get(self, req, resp, dataset, tree):
        if req.get_param_as_bool('recursive'):
            await self._get_recursive(req, resp, dataset, tree)
        else:
            await self._get_single(req, resp, dataset, tree)

    async def _get_single(self, req, resp, dataset, tree):
        try:
            files = await get_tree(self.store, dataset, tree)
            files.sort(key=dataset_sort)
            resp.status = falcon.HTTP_OK
            resp.media = {'files': files}
        except FileNotFoundError:
            resp.status = falcon.HTTP_NOT_FOUND
            resp.media = {'error': 'Dataset does not exist'}

    async def _get_recursive(self, req, resp, dataset, tree):
        dataset_path = self.store.get_dataset_path(dataset)
        # Only allow recursive listing for tags
        try:
            repo = pygit2.Repository(dataset_path)
            repo.references[f'refs/tags/{tree}']
        except (KeyError, pygit2.GitError):
            resp.status = falcon.HTTP_BAD_REQUEST
            resp.media = {'error': 'Recursive listing is only supported for tags'}
            return

        # Serve from on-disk cache (pre-compressed)
        raw = read_tag_cache_raw(dataset_path, tree)
        if raw is not None:
            resp.status = falcon.HTTP_OK
            resp.content_type = 'application/json'
            resp.set_header('Content-Encoding', 'gzip')
            resp.data = raw
            return

        # Cache miss — queue background task and tell client to retry
        await populate_tag_cache.kiq(dataset, dataset_path, tree)
        resp.status = falcon.HTTP_202
        resp.media = {'error': 'Cache is being populated, try again soon'}
