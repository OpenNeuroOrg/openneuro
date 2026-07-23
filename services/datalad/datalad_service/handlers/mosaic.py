import logging
import falcon
import os
import aiofiles

from datalad_service.common.user import get_user_info
from datalad_service.tasks.mosaic import create_mosaic, get_mosaic_path


class MosaicResource:
    def __init__(self, store):
        self.store = store

    async def on_get(self, req, resp, dataset, hexsha):
        mosaic_path = get_mosaic_path(dataset, hexsha)
        if os.path.exists(mosaic_path):
            resp.status = falcon.HTTP_OK
            fd = await aiofiles.open(mosaic_path, 'rb')
            resp.set_stream(fd, os.fstat(fd.fileno()).st_size)
        else:
            resp.media = {'error': 'mosaic not found'}
            resp.status = falcon.HTTP_NOT_FOUND

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
