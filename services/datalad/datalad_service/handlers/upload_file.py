import logging
import os
import re

import falcon

from datalad_service.common.stream import update_file
from datalad_service.common.user import get_user_info
from datalad_service.handlers.upload import UploadResource


def skip_invalid_files(filename):
    """Ignore certain files during upload (such as dot files, .DS_Store, .git, etc)"""
    if filename == '.bidsignore':
        return False
    else:
        return re.match(r'^\.|.*\/\.|.*Icon\r', filename)


class UploadFileResource(UploadResource):

    def __init__(self, store):
        self.store = store
        self.logger = logging.getLogger('datalad_service.' + __name__)

    def _check_access(self, req, dataset, upload):
        user = 'user' in req.context and req.context['user'] or None
        # Check that this request includes the correct token
        if user != None and 'dataset:upload' in user['scopes'] and user['dataset'] == dataset:
            return True
        else:
            return False

    def _handle_failed_access(self, req, resp):
        """Attach errors to the resp if auth failed."""
        user = 'user' in req.context and req.context['user'] or None
        # No user = unauthorized, otherwise token is present with the wrong scope/grant
        if user == None:
            resp.media = {'error': 'Authentication required for uploads'}
            resp.status = falcon.HTTP_UNAUTHORIZED
        else:
            resp.media = {
                'error': 'You do not have permission to access this dataset'}
            resp.status = falcon.HTTP_FORBIDDEN

    def on_post(self, req, resp, worker, dataset, upload, filename):
        # Check that this request includes the correct token
        if self._check_access(req, dataset, upload):
            if skip_invalid_files(filename):
                # Allow the client to detect this but return 200 status
                resp.media = {"skipped": True}
                resp.status = falcon.HTTP_OK
                return
            upload_path = self.store.get_upload_path(dataset, upload)
            # Save one file
            file_path = os.path.join(upload_path, filename)
            # Make any missing parent directories
            os.makedirs(os.path.dirname(file_path), exist_ok=True)
            update_file(file_path, req.stream)
            resp.media = {}
            resp.status = falcon.HTTP_OK
        else:
            self._handle_failed_access(req, resp)

    def on_get(self, req, resp, worker, dataset, upload):
        """Return the current upload state, files and sizes."""
        if self._check_access(req, dataset, upload):
            upload_path = self.store.get_upload_path(dataset, upload)
            uploaded_files = os.listdir(upload_path)
            resp.status = falcon.HTTP_OK
            resp.media = {"files": uploaded_files}
        else:
            self._handle_failed_access(req, resp)
