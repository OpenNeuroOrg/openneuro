import falcon

from datalad_service.common.user import get_user_info
from datalad_service.common.celery import dataset_queue
from datalad_service.tasks.files import commit_files
from datalad_service.tasks.draft import is_dirty


class DraftResource(object):
    def __init__(self, store):
        self.store = store

    @property
    def annex_path(self):
        return self.store.annex_path

    def on_get(self, req, resp, dataset):
        """
        Return draft state (other than files).
        """
        if dataset:
            queue = dataset_queue(dataset)
            # Maybe turn this into status?
            partial = is_dirty.apply_async(
                queue=queue, args=(self.annex_path, dataset))
            partial.wait()
            resp.media = {'partial': partial.get()}
            resp.status = falcon.HTTP_OK

    def on_post(self, req, resp, dataset):
        """
        Commmit a draft change.

        This adds all files in the working tree.
        """
        if dataset:
            queue = dataset_queue(dataset)
            # Record if this was done on behalf of a user
            name, email = get_user_info(req)
            media_dict = {}
            if name and email:
                media_dict['name'] = name
                media_dict['email'] = email
            commit = commit_files.apply_async(queue=queue, args=(self.annex_path, dataset), kwargs={
                'files': None, 'name': name, 'email': email, 'cookies':req.cookies})
            commit.wait()
            if not commit.failed():
                # Attach the commit hash to response
                media_dict['ref'] = commit.get()
                resp.media = media_dict
                resp.status = falcon.HTTP_OK
        else:
            resp.media = {
                'error': 'Missing or malformed dataset parameter in request.'}
            resp.status = falcon.HTTP_UNPROCESSABLE_ENTITY
