import logging
import os
import hashlib
import struct
import zlib

import falcon

import git


class ObjectsResource(object):
    _CHUNK_SIZE_BYTES = 4096

    def __init__(self, store):
        self.store = store
        self.logger = logging.getLogger('datalad_service.' + __name__)

    def annex_key_to_path(self, annex_key):
        word = struct.unpack('<I', hashlib.md5(str(annex_key).encode('utf-8')).digest()[:4])[0]
        integer_encoding = [word >> (6 * x) & 31 for x in range(4)]
        values = ['0123456789zqjxkmvwgpfZQJXKMVWGPF'[x] for x in integer_encoding]
        return '{}{}/{}{}'.format(values[1], values[0], values[3], values[2])

    @property
    def annex_path(self):
        return self.store.annex_path

    def on_get(self, req, resp, dataset, filekey=None):
        ds_path = self.store.get_dataset_path(dataset)
        if filekey:
            try:
                if filekey.startswith('MD5E'):
                    filepath = '.git/annex/objects/{}/{}/{}'.format(self.annex_key_to_path(filekey), filekey, filekey)
                    path = '{}/{}'.format(ds_path, filepath)
                    fd = open(path, 'rb')
                    resp.stream = fd
                    resp.stream_len = os.fstat(fd.fileno()).st_size
                    resp.status = falcon.HTTP_OK
                else:
                    dir = filekey[:2]
                    remaining_hex = filekey[2:]
                    filepath = '.git/objects/{}/{}'.format(dir, remaining_hex)
                    path = '{}/{}'.format(ds_path, filepath)
                    compressed_contents = open(path, 'rb').read()
                    decompressed_contents = zlib.decompress(compressed_contents)
                    split_char = b'\x00'
                    contents = decompressed_contents[decompressed_contents.index(split_char) + len(split_char):]
                    resp.body = contents
                    resp.status = falcon.HTTP_OK
            except IOError:
                # File is not kept locally
                resp.media = {'error': 'file not found'}
                resp.status = falcon.HTTP_NOT_FOUND
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