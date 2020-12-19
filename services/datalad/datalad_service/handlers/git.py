import logging
import subprocess

import falcon

from datalad_service.common.stream import pipe_chunks
from datalad_service.common.user import get_user_info
from datalad_service.tasks.files import commit_files


cache_control = ['no-cache', 'max-age=0', 'must-revalidate']
expires = 'Fri, 01 Jan 1980 00:00:00 GMT'


def _check_git_access(req, dataset):
    """Validate HTTP token has access to the requested dataset."""
    user = 'user' in req.context and req.context['user'] or None
    # Check that this request includes the correct token
    if user != None and 'dataset:git' in user['scopes'] and user['dataset'] == dataset:
        return True
    else:
        return False


def _handle_failed_access(req, resp):
    """Attach errors to the resp if auth failed."""
    user = 'user' in req.context and req.context['user'] or None
    # No user = unauthorized, otherwise token is present with the wrong scope/grant
    if user == None:
        resp.media = {'error': 'Authentication required for git access'}
        resp.status = falcon.HTTP_UNAUTHORIZED
    else:
        resp.media = {
            'error': 'You do not have permission to access this dataset'}
        resp.status = falcon.HTTP_FORBIDDEN


class GitRefsResource(object):
    """/info/refs returns current state for either git-receive-pack or git-upload-pack"""

    def __init__(self, store):
        self.store = store
        self.logger = logging.getLogger('datalad_service.' + __name__)

    def on_get(self, req, resp, dataset):
        # Make sure load balancers and other proxies do not cache this
        resp.cache_control = cache_control
        resp.set_header('Expires', expires)
        resp.set_header('WWW-Authenticate', 'Basic realm="dataset git repo"')
        if not _check_git_access(req, dataset):
            return _handle_failed_access(req, resp)
        if dataset:
            ds = self.store.get_dataset(dataset)
            service = req.get_param('service', required=True)
            if service == 'git-receive-pack' or service == 'git-upload-pack':
                # Prefix is line length as hex followed by service name to start
                if service == 'git-receive-pack':
                    prefix = b'001f# service=git-receive-pack\n0000'
                elif service == 'git-upload-pack':
                    prefix = b'001e# service=git-upload-pack\n0000'
                # git-receive-pack or git-upload-pack handle the other requests
                with subprocess.Popen([service, '--advertise-refs', '--stateless-rpc', ds.path], stdout=subprocess.PIPE) as process:
                    resp.content_type = 'application/x-{}-advertisement'.format(
                        service)
                    resp.body = prefix + process.stdout.read()
                    resp.status = falcon.HTTP_OK
            else:
                resp.status = falcon.HTTP_UNPROCESSABLE_ENTITY
        else:
            resp.status = falcon.HTTP_UNPROCESSABLE_ENTITY


class GitReceiveResource(object):
    """/git-receive-pack is used to receive pushes"""

    def __init__(self, store):
        self.store = store
        self.logger = logging.getLogger('datalad_service.' + __name__)

    def on_post(self, req, resp, dataset):
        resp.cache_control = cache_control
        resp.set_header('Expires', expires)
        resp.set_header('WWW-Authenticate', 'Basic realm="dataset git repo"')
        resp.content_type = 'application/x-git-receive-pack-result'
        if not _check_git_access(req, dataset):
            return _handle_failed_access(req, resp)
        if dataset:
            ds = self.store.get_dataset(dataset)
            process = subprocess.Popen(
                ['git-receive-pack', '--stateless-rpc', ds.path], stdin=subprocess.PIPE, stdout=subprocess.PIPE)
            pipe_chunks(reader=req.bounded_stream, writer=process.stdin)
            process.stdin.flush()
            resp.status = falcon.HTTP_OK
            resp.stream = process.stdout
        else:
            resp.status = falcon.HTTP_UNPROCESSABLE_ENTITY


class GitUploadResource(object):
    """/git-upload-pack serves git fetch requests"""

    def __init__(self, store):
        self.store = store
        self.logger = logging.getLogger('datalad_service.' + __name__)

    def on_post(self, req, resp, dataset):
        resp.cache_control = cache_control
        resp.set_header('Expires', expires)
        resp.set_header('WWW-Authenticate', 'Basic realm="dataset git repo"')
        resp.content_type = 'application/x-git-upload-pack-result'
        if not _check_git_access(req, dataset):
            return _handle_failed_access(req, resp)
        if dataset:
            ds = self.store.get_dataset(dataset)
            process = subprocess.Popen(
                ['git-upload-pack', '--stateless-rpc', ds.path], stdin=subprocess.PIPE, stdout=subprocess.PIPE)
            pipe_chunks(reader=req.bounded_stream, writer=process.stdin)
            process.stdin.flush()
            resp.status = falcon.HTTP_OK
            resp.stream = process.stdout
        else:
            resp.status = falcon.HTTP_UNPROCESSABLE_ENTITY
