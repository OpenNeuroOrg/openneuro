import os

import falcon

from .datalad import get_files, create_snapshot
from .publish import publish_snapshot


class SnapshotResource(object):

    """Snapshots on top of DataLad datasets."""

    def __init__(self, store):
        self.store = store

    def _get_snapshot(self, dataset, snapshot):
        ds = self.store.get_dataset(dataset)
        files = get_files.delay(self.store.annex_path,
                                dataset, branch=snapshot)
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
        created = create_snapshot.delay(
            self.store.annex_path, dataset, snapshot)
        if not created.failed():
            resp.media = self._get_snapshot(dataset, snapshot)
            resp.status = falcon.HTTP_OK
            # This is async because it can take a very long time
            published = publish_snapshot.delay(
                self.store.annex_path, dataset, snapshot)
        else:
            resp.media = {'error': 'tag already exists'}
            resp.status = falcon.HTTP_CONFLICT
