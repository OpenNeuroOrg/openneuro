import logging

import falcon

from datalad_service.common.user import get_user_info
from datalad_service.tasks.mosaic import create_mosaic


class MosaicResource:
    def __init__(self, store):
        self.store = store

    async def on_post(self, req, resp, dataset, hexsha):
        """Create a mosaic for a given commit"""
        if dataset and hexsha:
            # Record if this was done on behalf of a user
            name, email = get_user_info(req)
            try:
                dataset_path = self.store.get_dataset_path(dataset)
                # Queue the mosaic but don't block on the request
                await create_mosaic.kiq(
                    dataset, dataset_path, hexsha, req.cookies, user=name
                )
                resp.status = falcon.HTTP_OK
            except Exception:
                logging.exception(
                    'Mosaic task enqueue failed for dataset %s', dataset
                )
                resp.status = falcon.HTTP_INTERNAL_SERVER_ERROR
        else:
            resp.media = {'error': 'Missing or malformed dataset parameter in request.'}
            resp.status = falcon.HTTP_UNPROCESSABLE_ENTITY
