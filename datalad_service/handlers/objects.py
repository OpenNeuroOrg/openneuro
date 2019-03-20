import logging
import os
import hashlib
import struct
import subprocess

import falcon


def annex_key_to_path(annex_key):
    word = struct.unpack('<I', hashlib.md5(
        str(annex_key).encode('utf-8')).digest()[:4])[0]
    integer_encoding = [word >> (6 * x) & 31 for x in range(4)]
    values = ['0123456789zqjxkmvwgpfZQJXKMVWGPF'[x]
              for x in integer_encoding]
    return '{}{}/{}{}'.format(values[1], values[0], values[3], values[2])


class ObjectsResource(object):
    _CHUNK_SIZE_BYTES = 4096

    def __init__(self, store):
        self.store = store
        self.logger = logging.getLogger('datalad_service.' + __name__)

    @property
    def annex_path(self):
        return self.store.annex_path

    def on_get(self, req, resp, dataset, filekey=None):
        ds_path = self.store.get_dataset_path(dataset)
        if filekey:
            try:
                # Annexed files
                if filekey.startswith('MD5E'):
                    filepath = '.git/annex/objects/{}/{}/{}'.format(
                        annex_key_to_path(filekey), filekey, filekey)
                    path = '{}/{}'.format(ds_path, filepath)
                    fd = open(path, 'rb')
                    resp.stream = fd
                    resp.stream_len = os.fstat(fd.fileno()).st_size
                    resp.status = falcon.HTTP_OK
                # Git objects
                else:
                    gitCommand = subprocess.run(
                        ['git', '-C', ds_path, 'cat-file', 'blob', filekey], stdout=subprocess.PIPE)
                    if (gitCommand.returncode == 0):
                        resp.body = gitCommand.stdout
                        resp.status = falcon.HTTP_OK
                    elif (gitCommand.returncode == 128):
                        # File is not kept locally
                        resp.media = {'error': 'file not found'}
                        resp.status = falcon.HTTP_NOT_FOUND
                    else:
                        resp.media = {
                            'error': 'git object command exited with non-zero'}
                        resp.status = falcon.HTTP_INTERNAL_SERVER_ERROR
            except subprocess.CalledProcessError as err:
                resp.media = {'error': 'git cat-file failed to run'}
                resp.status = falcon.HTTP_INTERNAL_SERVER_ERROR
            except:
                # Some unknown error
                resp.media = {
                    'error': 'an unknown error occurred accessing this file'}
                resp.status = falcon.HTTP_INTERNAL_SERVER_ERROR
                self.logger.exception(
                    'An unknown error processing file with key "{}"'.format(filekey))
        else:
            # Filekey was not provided
            resp.media = {'error': 'no file key was provided'}
            resp.status = falcon.HTTP_NOT_FOUND
