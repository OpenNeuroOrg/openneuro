import logging
import os
import pathlib
import shutil

import falcon
import gevent
import sentry_sdk
import pygit2

from datalad_service.common.git import git_commit
from datalad_service.common.user import get_user_info
from datalad_service.common.draft import update_head


def move_files(upload_path, dataset_path):
    for filename in pathlib.Path(upload_path).glob('**/*'):
        if os.path.isfile(filename):
            target = os.path.join(dataset_path, os.path.relpath(
                filename, start=upload_path))
            pathlib.Path(target).parent.mkdir(parents=True, exist_ok=True)
            shutil.move(str(filename), target)
            gevent.sleep()


class UploadResource(object):
    def __init__(self, store):
        self.store = store
        self.logger = logging.getLogger('datalad_service.' + __name__)

    def _finish_upload(self, dataset_id, upload, name, email, cookies):
        try:
            dataset_path = self.store.get_dataset_path(dataset_id)
            repo = pygit2.Repository(dataset_path)
            upload_path = self.store.get_upload_path(dataset_id, upload)
            unlock_files = [os.path.relpath(filename, start=upload_path) for filename in
                            pathlib.Path(upload_path).glob('**/*') if os.path.islink(
                os.path.join(dataset_path, os.path.relpath(filename, start=upload_path)))]
            gevent.sleep()
            move_files(upload_path, dataset_path)
            author = pygit2.Signature(name, email)
            hexsha = git_commit(repo, unlock_files, author).hex
            update_head(dataset_id, dataset_path, hexsha, cookies)
            gevent.sleep()
            shutil.rmtree(upload_path)
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
