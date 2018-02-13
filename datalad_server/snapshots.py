import os
import falcon


def filter_git_files(files):
    """Remove any git/datalad files from a list of files."""
    return [f for f in files if not (f.startswith('.datalad/') or f == '.gitattributes')]


class SnapshotResource(object):

    """Snapshots on top of DataLad datasets."""

    def __init__(self, store):
        self.store = store

    def on_get(self, req, resp, dataset, snapshot):
        """Get the tree of files for a snapshot."""
        ds = self.store.get_dataset(dataset)
        snapshot_tree = ds.repo.get_files(branch=snapshot)
        resp.media = {'files': filter_git_files(snapshot_tree)}
        resp.status = falcon.HTTP_OK

    def on_post(self, req, resp, dataset, snapshot):
        """Commit a revision (snapshot) from the working tree."""
        resp.status = falcon.HTTP_NOT_IMPLEMENTED
