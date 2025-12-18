import falcon
import logging

from datalad_service.tasks.fsck import git_annex_fsck_local


class FsckResource:
    def __init__(self, store):
        self.store = store
        self.logger = logging.getLogger('datalad_service.' + __name__)

    async def on_post(self, req, resp, dataset):
        dataset_path = self.store.get_dataset_path(dataset)
        await git_annex_fsck_local.kiq(dataset_path)
        resp.status = falcon.HTTP_OK
