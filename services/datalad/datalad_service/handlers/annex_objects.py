import logging
import os
from subprocess import CalledProcessError

import falcon

import git
from datalad_service.common.git import git_show
from datalad_service.common.user import get_user_info
from datalad_service.common.stream import update_file
from datalad_service.tasks.files import get_files
from datalad_service.tasks.files import get_untracked_files
from datalad_service.tasks.files import remove_files
from datalad_service.tasks.files import remove_recursive
from datalad_service.tasks.files import unlock_files


class AnnexObjectsResource(object):

    def __init__(self, store):
        self.store = store
        self.logger = logging.getLogger('datalad_service.' + __name__)

    def on_delete(self, req, resp, dataset, snapshot, annex_key):
        """Delete an existing annex_object on a dataset"""
        self.logger.error(dataset)
        self.logger.error(snapshot)
        self.logger.error(annex_key)
        if False: pass
        # if annex_key:
        #     ds_path = self.store.get_dataset_path(dataset)
            # file_path = os.path.join(ds_path, filename)
            # if os.path.exists(file_path):
            #     media_dict = {'deleted': filename}
            #     name, email = get_user_info(req)
            #     if name and email:
            #         media_dict['name'] = name
            #         media_dict['email'] = email
            #     try:
            #         # The recursive flag removes the entire tree in one commit
            #         if 'recursive' in req.params and req.params['recursive'] != 'false':
            #             remove_recursive(
            #                 self.store, dataset, filename, name=name, email=email, cookies=req.cookies)
            #         else:
            #             remove_files(self.store, dataset, files=[
            #                 filename], name=name, email=email, cookies=req.cookies)
            #         resp.media = media_dict
            #         resp.status = falcon.HTTP_OK
            #     except:
            #         resp.status = falcon.HTTP_INTERNAL_SERVER_ERROR
            # else:
            #     resp.media = {'error': 'no such file'}
            #     resp.status = falcon.HTTP_NOT_FOUND
        else:
            resp.media = {'error': 'annex-key is missing'}
            resp.status = falcon.HTTP_BAD_REQUEST
