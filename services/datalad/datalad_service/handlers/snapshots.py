import os

import falcon
from celery import chain

from datalad_service.common.celery import dataset_queue
from datalad_service.tasks.dataset import create_snapshot
from datalad_service.tasks.snapshots import get_snapshot, get_snapshots
from datalad_service.tasks.files import get_files
from datalad_service.tasks.publish import publish_snapshot, monitor_remote_configs


class SnapshotResource(object):

    """Snapshots on top of DataLad datasets."""

    def __init__(self, store):
        self.store = store

    def on_get(self, req, resp, dataset, snapshot=None):
        """Get the tree of files for a snapshot."""
        queue = dataset_queue(dataset)
        if snapshot:
            ds = self.store.get_dataset(dataset)
            files = get_files.s(self.store.annex_path, dataset,
                                branch=snapshot).apply_async(queue=queue)
            response = get_snapshot.s(
                self.store.annex_path, dataset, snapshot).apply_async(queue=queue).get()
            response['files'] = files.get()
            resp.media = response
            resp.status = falcon.HTTP_OK
        else:
            tags = get_snapshots.s(self.store.annex_path,
                                   dataset).apply_async(queue=queue)
            # Index of all tags
            ds = self.store.get_dataset(dataset)
            resp.media = {'snapshots': tags.get()}
            resp.status = falcon.HTTP_OK

    def on_post(self, req, resp, dataset, snapshot):
        """Commit a revision (snapshot) from the working tree."""
        queue = dataset_queue(dataset)
        media = req.media
        description_fields = {}
        snapshot_changes = []
        if media != None:
            description_fields = media.get('description_fields')
            snapshot_changes = media.get('snapshot_changes')

        monitor_remote_configs.s(
            self.store.annex_path, dataset, snapshot).set(
                queue=dataset_queue(dataset)).apply_async()

        created = create_snapshot(
            self.store.annex_path, dataset, snapshot, description_fields, snapshot_changes)
        if not created.failed():
            resp.media = created.get()
            resp.status = falcon.HTTP_OK
            # Publish after response
            publish = publish_snapshot.s(
                self.store.annex_path, dataset, snapshot, req.cookies)
            skip_publishing = req.media != None and media.get(
                'skip_publishing')
            if not skip_publishing and skip_publishing is not None:
                publish.apply_async(queue=queue)
        else:
            resp.media = {'error': 'tag already exists'}
            resp.status = falcon.HTTP_CONFLICT

    def on_delete(self, req, resp, dataset, snapshot):
        """Remove a tag on the dataset, which is equivalent to deleting a snapshot"""
        if snapshot:
            ds = self.store.get_dataset(dataset)
            ds.repo.repo.delete_tag(snapshot)
            resp.media = {}
            resp.status = falcon.HTTP_OK
        else:
            resp.media = {'error': 'no snapshot tag specified'}
