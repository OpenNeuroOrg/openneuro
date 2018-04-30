import os

import falcon

from .common.annex import filter_git_files


class SnapshotResource(object):

    """Snapshots on top of DataLad datasets."""

    def __init__(self, store):
        self.store = store

    def on_get(self, req, resp, dataset, snapshot):
        """Get the tree of files for a snapshot."""
        ds = self.store.get_dataset(dataset)
        snapshot_tree = ds.repo.get_files(branch=snapshot)
        resp.media = {'files': filter_git_files(snapshot_tree), 'version': snapshot}
        resp.status = falcon.HTTP_OK

    def on_post(self, req, resp, dataset, snapshot):
        """Commit a revision (snapshot) from the working tree."""
        ds = self.store.get_dataset(dataset)
        # Search for any existing tags
        tagged = [tag for tag in ds.repo.get_tags() if tag['name'] == snapshot]
        if not tagged:
            ds.save(version_tag=snapshot)
            snapshot_tree = ds.repo.get_files(branch=snapshot)
            resp.media = {'files': filter_git_files(
                snapshot_tree), 'version': snapshot}
            resp.status = falcon.HTTP_OK
        else:
            resp.media = {'error': 'tag already exists'}
            resp.status = falcon.HTTP_CONFLICT
