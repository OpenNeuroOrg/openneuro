import logging

import falcon

from datalad_service.tasks.files import remove_annex_object


class AnnexObjectsResource:
    def __init__(self, store):
        self.store = store
        self.logger = logging.getLogger('datalad_service.' + __name__)

    async def on_delete(self, req, resp, dataset, snapshot, annex_key):
        """Delete an existing annex_object on a dataset"""
        if annex_key:
            dataset_path = self.store.get_dataset_path(dataset)
            if not remove_annex_object(dataset_path, annex_key):
                # Failed to remove, the key most likely does not exist
                resp.media = {'error': 'file does not exist'}
                resp.status = falcon.HTTP_NOT_FOUND
        else:
            resp.media = {'error': 'annex-key is missing'}
            resp.status = falcon.HTTP_BAD_REQUEST
