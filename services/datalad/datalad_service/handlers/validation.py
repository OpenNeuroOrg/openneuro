import falcon

from datalad_service.common.user import get_user_info
from datalad_service.tasks.validator import validate_dataset


class ValidationResource(object):
    def __init__(self, store):
        self.store = store

    def on_post(self, req, resp, dataset, hexsha):
        """Run validation for a given commit"""
        if dataset and hexsha:
            # Record if this was done on behalf of a user
            name, email = get_user_info(req)
            media_dict = {}
            if name and email:
                media_dict['name'] = name
                media_dict['email'] = email
            try:
                ds = self.store.get_dataset(dataset)
                # Run the validator but don't block on the request
                validate_dataset(dataset, ds.path, hexsha, req.cookies)
                resp.status = falcon.HTTP_OK
            except:
                resp.status = falcon.HTTP_INTERNAL_SERVER_ERROR
        else:
            resp.media = {
                'error': 'Missing or malformed dataset parameter in request.'}
            resp.status = falcon.HTTP_UNPROCESSABLE_ENTITY
