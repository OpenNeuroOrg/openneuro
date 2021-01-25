import hashlib
import logging
import os
import shutil
import struct
import tempfile

import falcon

from datalad_service.common.stream import update_file
from datalad_service.handlers.git import _check_git_access, _handle_failed_access


def hashdirmixed(key):
    """Python implementation of git-annex hashing for non-bare git repos

    https://git-annex.branchable.com/internals/hashing/"""
    digest = hashlib.md5(key.encode()).digest()
    first_word = struct.unpack('<I', digest[:4])[0]
    nums = [first_word >> (6 * x) & 31 for x in range(4)]
    letters = ["0123456789zqjxkmvwgpfZQJXKMVWGPF"[i] for i in nums]
    return ("{0:s}{1:s}".format(letters[1], letters[0]), "{0:s}{1:s}".format(letters[3], letters[2]))


def key_to_path(key):
    return os.path.join('.git', 'annex', 'objects', *hashdirmixed(key), key, key)


class GitAnnexResource(object):
    """{worker}/{dataset}/annex/{key} serves git-annex object requests

    This allows OpenNeuro to act as a special remote, adding or removing objects from .git/annex/objects/
    """

    def __init__(self, store):
        self.store = store
        self.logger = logging.getLogger('datalad_service.' + __name__)

    def on_head(self, req, resp, worker, dataset, key):
        """HEAD requests check if objects exist already"""
        resp.set_header('WWW-Authenticate', 'Basic realm="dataset git repo"')
        if not _check_git_access(req, dataset):
            return _handle_failed_access(req, resp)
        ds = self.store.get_dataset(dataset)
        annex_object_path = os.path.join(ds.path, key_to_path(key))
        if os.path.exists(annex_object_path):
            resp.status = falcon.HTTP_OK
        else:
            resp.status = falcon.HTTP_NOT_FOUND

    def on_get(self, req, resp, worker, dataset, key):
        resp.set_header('WWW-Authenticate', 'Basic realm="dataset git repo"')
        if not _check_git_access(req, dataset):
            return _handle_failed_access(req, resp)
        ds = self.store.get_dataset(dataset)
        annex_object_path = os.path.join(ds.path, key_to_path(key))
        if os.path.exists(annex_object_path):
            resp.status = falcon.HTTP_OK
            fd = open(annex_object_path, 'rb')
            resp.stream = fd
            resp.stream_len = os.fstat(fd.fileno()).st_size
        else:
            resp.status = falcon.HTTP_NOT_FOUND

    def on_post(self, req, resp, worker, dataset, key):
        resp.set_header('WWW-Authenticate', 'Basic realm="dataset git repo"')
        if not _check_git_access(req, dataset):
            return _handle_failed_access(req, resp)
        ds = self.store.get_dataset(dataset)
        annex_object_path = os.path.join(ds.path, key_to_path(key))
        if os.path.exists(annex_object_path):
            # Don't allow objects to be replaced
            resp.status = falcon.HTTP_CONFLICT
        else:
            os.makedirs(os.path.dirname(annex_object_path), exist_ok=True)
            # Begin writing stream to temp file and hard link once done
            # It should not be written unless the full request completes
            update_file(annex_object_path, req.stream)
            resp.status = falcon.HTTP_OK

    def on_delete(self, req, resp, worker, dataset, key):
        resp.set_header('WWW-Authenticate', 'Basic realm="dataset git repo"')
        if not _check_git_access(req, dataset):
            return _handle_failed_access(req, resp)
        ds = self.store.get_dataset(dataset)
        annex_object_path = os.path.join(ds.path, key_to_path(key))
        if os.path.exists(annex_object_path):
            os.remove(annex_object_path)
        resp.status = falcon.HTTP_NO_CONTENT
