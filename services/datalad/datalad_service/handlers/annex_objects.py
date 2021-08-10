import logging
import gevent

import falcon

from datalad_service.common.annex import get_repo_files
from datalad_service.tasks.publish import remove_file_remotes
from datalad_service.tasks.files import remove_annex_object


class AnnexObjectsResource(object):

    def __init__(self, store):
        self.store = store
        self.logger = logging.getLogger('datalad_service.' + __name__)

    def on_delete(self, req, resp, dataset, snapshot, annex_key):
        """Delete an existing annex_object on a dataset"""
        if annex_key:
            dataset_path = self.store.get_dataset_path(dataset)
            files = get_repo_files(dataset_path, snapshot)
            try:
                file = next(f for f in files if annex_key == f.get('key'))
            except StopIteration:
                resp.media = {'error': 'file does not exist'}
                resp.status = falcon.HTTP_BAD_REQUEST
            urls = file.get('urls')

            gevent.spawn(remove_file_remotes, self.store, urls)
            gevent.spawn(remove_annex_object, self.store, ds, annex_key)
        else:
            resp.media = {'error': 'annex-key is missing'}
            resp.status = falcon.HTTP_NOT_FOUND
