import falcon

from datalad_service.tasks.publish import create_remotes_and_export


class PublishResource:
    """A Falcon API wrapper around underlying datalad/git-annex datasets."""

    def __init__(self, store):
        self.store = store

    async def on_post(self, req, resp, dataset):
        dataset_path = self.store.get_dataset_path(dataset)
        await create_remotes_and_export.kiq(dataset_path)
        resp.media = {}
        resp.status = falcon.HTTP_OK
