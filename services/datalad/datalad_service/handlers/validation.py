import asyncio

import falcon

from datalad_service.common.user import get_user_info
from datalad_service.tasks.validator import validate_dataset


class ValidationResource:
    def __init__(self, store):
        self.store = store

    async def on_post(self, req, resp, dataset, hexsha):
        """Run validation for a given commit"""
        if dataset and hexsha:
            # Record if this was done on behalf of a user
            name, email = get_user_info(req)
            try:
                dataset_path = self.store.get_dataset_path(dataset)
                # Run the validator but don't block on the request
                asyncio.create_task(
                    validate_dataset(
                        dataset, dataset_path, hexsha, req.cookies, user=name
                    )
                )
                resp.status = falcon.HTTP_OK
            except:
                resp.status = falcon.HTTP_INTERNAL_SERVER_ERROR
        else:
            resp.media = {'error': 'Missing or malformed dataset parameter in request.'}
            resp.status = falcon.HTTP_UNPROCESSABLE_ENTITY
