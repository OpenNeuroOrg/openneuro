import falcon

from datalad_service.common.user import get_user_info
from datalad_service.tasks.files import commit_files


class DraftResource(object):
    def __init__(self, store):
        self.store = store

    def on_get(self, req, resp, dataset):
        """
        Return draft state (other than files).
        """
        if dataset:
            # Maybe turn this into status?
            ds = self.store.get_dataset(dataset)
            resp.media = {'hexsha': ds.repo.get_hexsha()}
            resp.status = falcon.HTTP_OK
        else:
            resp.status = falcon.HTTP_NOT_FOUND

    def on_post(self, req, resp, dataset):
        """
        Commmit a draft change.

        This adds all files in the working tree.
        """
        if dataset:
            # Record if this was done on behalf of a user
            name, email = get_user_info(req)
            media_dict = {}
            if name and email:
                media_dict['name'] = name
                media_dict['email'] = email
            if 'validate' in req.params and req.params['validate'] == 'false':
                validate = False
            else:
                validate = True
            try:
                commit = commit_files(self.store, dataset,
                                      files=None, name=name, email=email, cookies=req.cookies)
                # Attach the commit hash to response
                media_dict['ref'] = commit
                resp.media = media_dict
                resp.status = falcon.HTTP_OK
            except:
                resp.status = falcon.HTTP_INTERNAL_SERVER_ERROR
        else:
            resp.media = {
                'error': 'Missing or malformed dataset parameter in request.'}
            resp.status = falcon.HTTP_UNPROCESSABLE_ENTITY
