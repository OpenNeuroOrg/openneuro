import logging

import falcon

from datalad_service.common.git import git_show_object


class ObjectsResource:
    def __init__(self, store):
        self.store = store
        self.logger = logging.getLogger('datalad_service.' + __name__)

    async def on_get(self, req, resp, dataset, obj):
        repo = self.store.get_dataset_repo(dataset)
        try:
            if len(obj) == 40:
                resp.text = git_show_object(repo, obj)
                resp.status = falcon.HTTP_OK
            else:
                resp.media = {'error': 'key must be a 40 character git object hash'}
                resp.status = falcon.HTTP_BAD_REQUEST
        except KeyError:
            # File is not present in tree
            resp.media = {'error': 'object not found in git tree'}
            resp.status = falcon.HTTP_NOT_FOUND
        except:
            # Some unknown error
            resp.media = {'error': 'an unknown error occurred accessing this file'}
            resp.status = falcon.HTTP_INTERNAL_SERVER_ERROR
            self.logger.exception(f'An unknown error processing object "{obj}"')
