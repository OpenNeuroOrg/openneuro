import falcon
import os.path
import logging
import subprocess
import pty
from datalad_service.common.elasticsearch import log_reexporter

class ReexporterResource(object):
    """/info/refs returns current state for either git-receive-pack or git-upload-pack"""

    def __init__(self, store):
        self.store = store
        self.logger = logging.getLogger('datalad_service.' + __name__)

    def on_post(self, req, resp):
        primary, secondary = pty.openpty()
        process = subprocess.Popen(
            ['/scripts/repair-git-annex-branch-all-tags.sh'], stdout=secondary, stderr=secondary)
        stdout = os.fdopen(primary)
        log_reexporter(self.logger, stdout)
        
        resp.status = falcon.HTTP_OK
        resp.stream = process.stdout
