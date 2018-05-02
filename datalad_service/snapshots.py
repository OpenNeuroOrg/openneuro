import os

import falcon

from .common.annex import get_repo_files


class SnapshotResource(object):

    """Snapshots on top of DataLad datasets."""

    def __init__(self, store):
        self.store = store

    def _get_snapshot(self, dataset, snapshot):
        ds = self.store.get_dataset(dataset)
        files = get_repo_files(ds, branch=snapshot)
        return {'files': files, 'id':'{}:{}'.format(dataset, snapshot), 'tag': snapshot}

    def on_get(self, req, resp, dataset, snapshot=None):
        """Get the tree of files for a snapshot."""
        if snapshot:
            ds = self.store.get_dataset(dataset)
            snapshot_tree = ds.repo.get_files(branch=snapshot)
            files = get_repo_files(ds, branch=snapshot)
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
        ds = self.store.get_dataset(dataset)
        # Search for any existing tags
        tagged = [tag for tag in ds.repo.get_tags() if tag['name'] == snapshot]
        if not tagged:
            ds.save(version_tag=snapshot)
            resp.media = self._get_snapshot(dataset, snapshot)
            resp.status = falcon.HTTP_OK
        else:
            resp.media = {'error': 'tag already exists'}
            resp.status = falcon.HTTP_CONFLICT
