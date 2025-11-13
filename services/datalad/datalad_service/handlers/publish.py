import falcon

from taskiq_pipelines import Pipeline

from datalad_service.broker import broker
from datalad_service.tasks.publish import (
    create_remotes_and_export,
    set_access_access_tag,
)


class PublishResource:
    """A Falcon API wrapper around underlying datalad/git-annex datasets."""

    def __init__(self, store):
        self.store = store

    async def on_post(self, req, resp, dataset):
        dataset_path = self.store.get_dataset_path(dataset)
        # Pipeline create and export -> set access tag to public
        await (
            Pipeline(broker, create_remotes_and_export)
            .call_after(set_access_access_tag, dataset=dataset, value='public')
            .kiq(dataset_path)  # create_remotes_and_export
        )
        resp.media = {}
        resp.status = falcon.HTTP_OK
