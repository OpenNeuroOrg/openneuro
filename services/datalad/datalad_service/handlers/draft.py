import datetime
import os

import falcon
import pygit2

from datalad_service.common.user import get_user_info
from datalad_service.common.git import git_commit


class DraftResource:
    def __init__(self, store):
        self.store = store

    async def on_get(self, req, resp, dataset):
        """
        Return draft state (other than files).
        """
        dataset_path = self.store.get_dataset_path(dataset)
        if dataset and os.path.exists(dataset_path):
            repo = pygit2.Repository(dataset_path)
            commit = repo.revparse_single('HEAD')
            resp.media = {
                'ref': str(commit.id),
                'hexsha': str(commit.id),  # Deprecate 'hexsha' but retain for now
                'tree': str(commit.tree_id),
                'message': str(commit.message),
                'modified': datetime.datetime.fromtimestamp(
                    commit.author.time
                ).isoformat()
                + 'Z',
            }
            resp.status = falcon.HTTP_OK
        else:
            resp.status = falcon.HTTP_NOT_FOUND

    async def on_post(self, req, resp, dataset):
        """
        Commit a draft change.

        This adds all files in the working tree.
        """
        if dataset:
            # Record if this was done on behalf of a user
            name, email = get_user_info(req)
            media_dict = {}
            if name and email:
                media_dict['name'] = name
                media_dict['email'] = email
            try:
                dataset_path = self.store.get_dataset_path(dataset)
                repo = pygit2.Repository(dataset_path)
                # Add all changes to the index
                if name and email:
                    author = pygit2.Signature(name, email)
                    media_dict['ref'] = str(await git_commit(repo, ['.'], author))
                else:
                    media_dict['ref'] = str(await git_commit(repo, ['.']))
                resp.media = media_dict
                resp.status = falcon.HTTP_OK
            except:
                raise
                resp.status = falcon.HTTP_INTERNAL_SERVER_ERROR
        else:
            resp.media = {'error': 'Missing or malformed dataset parameter in request.'}
            resp.status = falcon.HTTP_UNPROCESSABLE_ENTITY
