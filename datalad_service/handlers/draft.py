import falcon

from datalad_service.common.annex import get_from_header
from datalad_service.common.celery import dataset_queue
from datalad_service.tasks.files import commit_files


class DraftResource(object):
    def __init__(self, store):
        self.store = store

    @property
    def annex_path(self):
        return self.store.annex_path

    def on_post(self, req, resp, dataset):
        """
        Commmit a draft change.

        This adds all files in the working tree.
        """
        if dataset:
            queue = dataset_queue(dataset)
            # Record if this was done on behalf of a user
            name, email = get_from_header(req)
            media_dict = {}
            if name and email:
                media_dict['name'] = name
                media_dict['email'] = email
            commit = commit_files.apply_async(queue=queue, args=(self.annex_path, dataset), kwargs={
                'files': None, 'name': name, 'email': email})
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
