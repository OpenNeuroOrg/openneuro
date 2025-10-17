import falcon

from datalad_service.tasks.publish import annex_drop


class DropResource:
    """git-annex drop API wrapper"""

    def __init__(self, store):
        self.store = store

    async def on_post(self, req, resp, dataset):
        dataset_path = self.store.get_dataset_path(dataset)
        await annex_drop.kiq(dataset_path)
        resp.media = {}
        resp.status = falcon.HTTP_OK
