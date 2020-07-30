import glob
import logging
import os
import shutil

import falcon
import gevent
import sentry_sdk

from datalad_service.common.user import get_user_info
from datalad_service.common.draft import update_head
from datalad_service.common.annex import CommitInfo


class UploadResource(object):
    def __init__(self, store):
        self.store = store
        self.logger = logging.getLogger('datalad_service.' + __name__)

    def _finish_upload(self, dataset_id, upload, name, email, cookies):
        try:
            ds = self.store.get_dataset(dataset_id)
            with CommitInfo(ds, name, email):
                upload_path = self.store.get_upload_path(dataset_id, upload)
                unlock_files = [os.path.relpath(filename, start=upload_path) for filename in glob.iglob(
                    upload_path + '**/**', recursive=True) if os.path.islink(os.path.join(ds.path, os.path.relpath(filename, start=upload_path)))]
                ds.unlock(unlock_files)
                shutil.copytree(upload_path, ds.path, dirs_exist_ok=True)
                shutil.rmtree(upload_path)
                ds.save(unlock_files)
                update_head(ds, dataset_id, cookies)
        except:
            self.logger.exception('Dataset upload could not be finalized')
            sentry_sdk.capture_exception()

    def on_post(self, req, resp, dataset, upload):
        """Copy uploaded data into dataset"""
        name, email = get_user_info(req)
        gevent.spawn(self._finish_upload, dataset,
                     upload, name, email, req.cookies)
        resp.media = {}
        resp.status = falcon.HTTP_OK
