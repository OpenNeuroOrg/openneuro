import logging
import gevent

import falcon

from datalad_service.common.annex import get_repo_files
from datalad_service.tasks.publish import remove_file_remotes


class AnnexObjectsResource(object):

    def __init__(self, store):
        self.store = store
        self.logger = logging.getLogger('datalad_service.' + __name__)

    def on_delete(self, req, resp, dataset, snapshot, annex_key):
        """Delete an existing annex_object on a dataset"""
        if annex_key:
            ds = self.store.get_dataset(dataset)
            files = get_repo_files(ds, snapshot)
            try:
                file = next(f for f in files if annex_key == f.get('key'))
            except StopIteration:
                resp.media = {'error': 'file does not exist'}
                resp.status = falcon.HTTP_BAD_REQUEST
            urls = file.get('urls')

            gevent.spawn(remove_file_remotes, self.store, urls)
        else:
            resp.media = {'error': 'annex-key is missing'}
            resp.status = falcon.HTTP_NOT_FOUND
