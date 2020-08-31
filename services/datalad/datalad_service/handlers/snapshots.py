import os

import gevent
import falcon

from datalad_service.tasks.dataset import create_snapshot
from datalad_service.tasks.snapshots import get_snapshot, get_snapshots
from datalad_service.tasks.files import get_files
from datalad_service.tasks.publish import publish_snapshot, monitor_remote_configs
from datalad_service.common.git import delete_tag


class SnapshotResource(object):

    """Snapshots on top of DataLad datasets."""

    def __init__(self, store):
        self.store = store

    def on_get(self, req, resp, dataset, snapshot=None):
        """Get the tree of files for a snapshot."""
        if snapshot:
            ds = self.store.get_dataset(dataset)
            files = get_files(self.store, dataset,
                              branch=snapshot)
            response = get_snapshot(self.store, dataset, snapshot)
            response['files'] = files
            resp.media = response
            resp.status = falcon.HTTP_OK
        else:
            tags = get_snapshots(self.store,
                                 dataset)
            # Index of all tags
            ds = self.store.get_dataset(dataset)
            resp.media = {'snapshots': tags}
            resp.status = falcon.HTTP_OK

    def on_post(self, req, resp, dataset, snapshot):
        """Commit a revision (snapshot) from the working tree."""
        media = req.media
        description_fields = {}
        snapshot_changes = []
        skip_publishing = False
        if media != None:
            description_fields = media.get('description_fields')
            snapshot_changes = media.get('snapshot_changes')
            skip_publishing = media.get('skip_publishing')

        monitor_remote_configs(
            self.store, dataset, snapshot)

        try:
            created = create_snapshot(
                self.store, dataset, snapshot, description_fields, snapshot_changes)
            resp.media = created
            resp.status = falcon.HTTP_OK

            if not skip_publishing:
                # Publish after response
                gevent.spawn(publish_snapshot, self.store,
                             dataset, snapshot, req.cookies)
        except:
            raise
            # TODO - This seems like an incorrect error path?
            resp.media = {'error': 'tag already exists'}
            resp.status = falcon.HTTP_CONFLICT

    def on_delete(self, req, resp, dataset, snapshot):
        """Remove a tag on the dataset, which is equivalent to deleting a snapshot"""
        if snapshot:
            ds = self.store.get_dataset(dataset)
            delete_tag(ds.path, snapshot)
            resp.media = {}
            resp.status = falcon.HTTP_OK
        else:
            resp.media = {'error': 'no snapshot tag specified'}
