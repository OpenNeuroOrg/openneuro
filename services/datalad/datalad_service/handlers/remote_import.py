import falcon
import logging
import gevent

from datalad_service.tasks.remote_import import remote_import
from datalad_service.common.user import get_user_info


class RemoteImportResource(object):
    def __init__(self, store):
        self.store = store
        self.logger = logging.getLogger('datalad_service.' + __name__)

    def on_post(self, req, resp, dataset, import_id):
        name, email = get_user_info(req)
        dataset_path = self.store.get_dataset_path(dataset)
        upload_path = self.store.get_upload_path(dataset, import_id)
        url = req.media.get('url')
        gevent.spawn(remote_import, dataset_path,
                     upload_path, import_id, url, name, email, req.cookies)
        resp.status = falcon.HTTP_OK
