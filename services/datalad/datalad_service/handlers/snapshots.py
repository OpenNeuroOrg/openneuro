import os
import logging

import falcon

from datalad_service.common.annex import EditAnnexedFileException
from datalad_service.common.git import delete_tag
from datalad_service.tasks.snapshots import (
    create_snapshot,
    get_snapshot,
    get_snapshots,
    SnapshotExistsException,
)
from datalad_service.tasks.publish import (
    export_dataset,
    monitor_remote_configs,
)


class SnapshotResource:
    """Snapshots on top of DataLad datasets."""

    def __init__(self, store):
        self.store = store
        self.logger = logging.getLogger('datalad_service.' + __name__)

    async def on_get(self, req, resp, dataset, snapshot=None):
        """Get the tree of files for a snapshot."""
        if not os.path.exists(self.store.get_dataset_path(dataset)):
            resp.status = falcon.HTTP_NOT_FOUND
        elif snapshot:
            try:
                response = get_snapshot(self.store, dataset, snapshot)
                resp.media = response
                resp.status = falcon.HTTP_OK
            except KeyError:
                # Tree returned objects but does not exist?
                resp.status = falcon.HTTP_NOT_FOUND
        else:
            tags = get_snapshots(self.store, dataset)
            resp.media = {'snapshots': tags}
            resp.status = falcon.HTTP_OK

    async def on_post(self, req, resp, dataset, snapshot):
        """Commit a revision (snapshot) from the working tree."""
        media = await req.get_media(None)
        description_fields = {}
        snapshot_changes = []
        skip_publishing = False
        if media != None:
            description_fields = media.get('description_fields')
            snapshot_changes = media.get('snapshot_changes')
            skip_publishing = media.get('skip_publishing')

        ds_path = self.store.get_dataset_path(dataset)

        try:
            created = await create_snapshot(
                self.store, dataset, snapshot, description_fields, snapshot_changes
            )
            resp.media = created
            resp.status = falcon.HTTP_OK

            if not skip_publishing:
                monitor_remote_configs(ds_path)
                # Publish after response
                await export_dataset.kiq(ds_path)
        except SnapshotExistsException as err:
            resp.media = {'error': repr(err)}
            resp.status = falcon.HTTP_CONFLICT
        except EditAnnexedFileException as err:
            resp.media = {'error': repr(err)}
            resp.status = falcon.HTTP_BAD_REQUEST

    async def on_delete(self, req, resp, dataset, snapshot):
        """Remove a tag on the dataset, which is equivalent to deleting a snapshot"""
        if snapshot:
            dataset_path = self.store.get_dataset_path(dataset)
            delete_tag(dataset_path, snapshot)
            resp.media = {}
            resp.status = falcon.HTTP_OK
        else:
            resp.media = {'error': 'no snapshot tag specified'}
