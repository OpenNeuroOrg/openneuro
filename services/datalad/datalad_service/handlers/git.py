import asyncio
import gzip
import logging

import falcon

from datalad_service.common.const import CHUNK_SIZE_BYTES


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
        resp.data = b'Authentication required for git access'
        resp.status = falcon.HTTP_UNAUTHORIZED
    else:
        resp.data = b'You do not have permission to access this dataset'
        resp.status = falcon.HTTP_FORBIDDEN


class GitRefsResource:
    """/info/refs returns current state for either git-receive-pack or git-upload-pack"""

    def __init__(self, store):
        self.store = store
        self.logger = logging.getLogger('datalad_service.' + __name__)

    async def on_get(self, req, resp, worker, dataset):
        # Make sure load balancers and other proxies do not cache this
        resp.cache_control = cache_control
        resp.set_header('Expires', expires)
        resp.set_header('WWW-Authenticate', 'Basic realm="dataset git repo"')
        if not _check_git_access(req, dataset):
            return _handle_failed_access(req, resp)
        if dataset:
            dataset_path = self.store.get_dataset_path(dataset)
            service = req.get_param('service', required=True)
            if service == 'git-receive-pack' or service == 'git-upload-pack':
                # Prefix is line length as hex followed by service name to start
                if service == 'git-receive-pack':
                    prefix = b'001f# service=git-receive-pack\n0000'
                elif service == 'git-upload-pack':
                    prefix = b'001e# service=git-upload-pack\n0000'
                # git-receive-pack or git-upload-pack handle the other requests
                process = await asyncio.create_subprocess_exec(
                    service,
                    '--advertise-refs',
                    '--stateless-rpc',
                    dataset_path,
                    stdout=asyncio.subprocess.PIPE,
                )
                resp.content_type = 'application/x-{}-advertisement'.format(
                    service)
                resp.text = prefix + await process.stdout.read()
                resp.status = falcon.HTTP_OK
            else:
                resp.status = falcon.HTTP_UNPROCESSABLE_ENTITY
        else:
            resp.status = falcon.HTTP_UNPROCESSABLE_ENTITY


class GitReceiveResource:
    """/git-receive-pack is used to receive pushes"""

    def __init__(self, store):
        self.store = store
        self.logger = logging.getLogger('datalad_service.' + __name__)

    async def on_post(self, req, resp, worker, dataset):
        resp.cache_control = cache_control
        resp.set_header('Expires', expires)
        resp.set_header('WWW-Authenticate', 'Basic realm="dataset git repo"')
        resp.content_type = 'application/x-git-receive-pack-result'
        if not _check_git_access(req, dataset):
            return _handle_failed_access(req, resp)
        if dataset:
            dataset_path = self.store.get_dataset_path(dataset)
            process = await asyncio.create_subprocess_exec(
                'git-receive-pack', 
                '--stateless-rpc', 
                dataset_path,
                stdin=asyncio.subprocess.PIPE,
                stdout=asyncio.subprocess.PIPE,
                stderr=asyncio.subprocess.PIPE,
            )
            # TODO - Handle gzip elsewhere but needed for compatibility with all git clients
            if req.get_header('content-encoding') == 'gzip':
                process.stdin.write(gzip.decompress(await req.stream.read()))
            else:
                while True:
                    chunk = await req.stream.read(CHUNK_SIZE_BYTES)
                    if not chunk:
                        break
                    process.stdin.write(chunk)
            
            process.stdin.close()
            resp.stream = process.stdout
            resp.status = falcon.HTTP_OK
        else:
            resp.status = falcon.HTTP_UNPROCESSABLE_ENTITY


class GitUploadResource:
    """/git-upload-pack serves git fetch requests"""

    def __init__(self, store):
        self.store = store
        self.logger = logging.getLogger('datalad_service.' + __name__)

    async def on_post(self, req, resp, worker, dataset):
        resp.cache_control = cache_control
        resp.set_header('Expires', expires)
        resp.set_header('WWW-Authenticate', 'Basic realm="dataset git repo"')
        resp.content_type = 'application/x-git-upload-pack-result'
        if not _check_git_access(req, dataset):
            return _handle_failed_access(req, resp)
        if dataset:
            dataset_path = self.store.get_dataset_path(dataset)
            process = await asyncio.create_subprocess_exec(
                'git-upload-pack',
                '--stateless-rpc',
                dataset_path,  
                stdin=asyncio.subprocess.PIPE,
                stdout=asyncio.subprocess.PIPE,
                stderr=asyncio.subprocess.PIPE,
            )
            # TODO - Handle gzip elsewhere but needed for compatibility with all git clients
            if req.get_header('content-encoding') == 'gzip':
                process.stdin.write(gzip.decompress(await req.stream.read()))
            else:
                while True:
                    chunk = await req.stream.read(CHUNK_SIZE_BYTES)
                    if not chunk:
                        break
                    process.stdin.write(chunk)
            
            process.stdin.close()
            resp.stream = process.stdout
            resp.status = falcon.HTTP_OK
        else:
            resp.status = falcon.HTTP_UNPROCESSABLE_ENTITY
