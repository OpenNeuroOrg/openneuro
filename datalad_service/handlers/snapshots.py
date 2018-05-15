import os

import falcon

from datalad_service.common.celery import dataset_queue
from datalad_service.tasks.dataset import create_snapshot
from datalad_service.tasks.files import get_files
from datalad_service.tasks.publish import publish_snapshot


class SnapshotResource(object):

    """Snapshots on top of DataLad datasets."""

    def __init__(self, store):
        self.store = store

    def _get_snapshot(self, dataset, snapshot):
        queue = dataset_queue(dataset)
        files = get_files.apply_async(queue=queue, args=(
            self.store.annex_path, dataset), kwargs={'branch': snapshot})
        return {'files': files.get(), 'id': '{}:{}'.format(dataset, snapshot), 'tag': snapshot}

    def on_get(self, req, resp, dataset, snapshot=None):
        """Get the tree of files for a snapshot."""
        if snapshot:
            ds = self.store.get_dataset(dataset)
            resp.media = self._get_snapshot(dataset, snapshot)
            resp.status = falcon.HTTP_OK
        else:
            # Index of all tags
            ds = self.store.get_dataset(dataset)
            repo_tags = ds.repo.get_tags()
            # Include an extra id field to uniquely identify snapshots
            tags = [{'id': '{}:{}'.format(dataset, tag['name']), 'tag': tag['name'], 'hexsha': tag['hexsha']}
                    for tag in repo_tags]
            resp.media = {'snapshots': tags}
            resp.status = falcon.HTTP_OK

    def on_post(self, req, resp, dataset, snapshot):
        """Commit a revision (snapshot) from the working tree."""
        queue = dataset_queue(dataset)
        created = create_snapshot.apply_async(
            queue=queue, args=(self.store.annex_path, dataset, snapshot))
        if not created.failed():
            resp.media = self._get_snapshot(dataset, snapshot)
            resp.status = falcon.HTTP_OK
            # This is async because it can take a very long time
            published = publish_snapshot.apply_async(
                queue=queue, args=(self.store.annex_path, dataset, snapshot))
        else:
            resp.media = {'error': 'tag already exists'}
            resp.status = falcon.HTTP_CONFLICT
