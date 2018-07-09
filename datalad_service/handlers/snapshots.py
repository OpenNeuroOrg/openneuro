import os

import falcon
from celery import chain

from datalad_service.common.celery import dataset_queue
from datalad_service.tasks.dataset import create_snapshot
from datalad_service.tasks.files import get_files
from datalad_service.tasks.publish import publish_snapshot


class SnapshotResource(object):

    """Snapshots on top of DataLad datasets."""

    def __init__(self, store):
        self.store = store

    def _get_snapshot(self, dataset, snapshot, files):
        # get the hash associated with the commit
        ds = self.store.get_dataset(dataset)
        commit_data = ds.repo.repo.commit(snapshot)
        hexsha = commit_data.hexsha
        return {'files': files, 'id': '{}:{}'.format(dataset, snapshot), 'tag': snapshot, 'hexsha': hexsha}

    def on_get(self, req, resp, dataset, snapshot=None):
        """Get the tree of files for a snapshot."""
        queue = dataset_queue(dataset)
        if snapshot:
            ds = self.store.get_dataset(dataset)
            files = get_files.s(self.store.annex_path, dataset,
                                branch=snapshot).apply_async(queue=queue)
            resp.media = self._get_snapshot(dataset, snapshot, files.get())
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
        create = create_snapshot.si(self.store.annex_path, dataset, snapshot).set(queue=queue)
        get = get_files.si(self.store.annex_path, dataset, branch=snapshot).set(queue=queue)
        created = chain(create, get)()
        # created.wait()
        if not created.failed():
            resp.media = self._get_snapshot(dataset, snapshot, created.get())
            resp.status = falcon.HTTP_OK
            # Publish after response
            publish = publish_snapshot.s(
                self.store.annex_path, dataset, snapshot, req.cookies)
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