"""
Dataset global tasks

Any operations that affect an entire dataset (such as creating snapshots)
"""
import logging
import os
import stat
import shutil

from datalad_service.common.annex import CommitInfo
from datalad_service.common.celery import dataset_task, dataset_queue
from datalad_service.tasks.publish import publish_snapshot


# A list of patterns to avoid annexing in BIDS datasets
BIDS_NO_ANNEX = [
    '*.tsv',
    '*.json',
    '*.bvec',
    '*.bval',
    'README',
    'CHANGES',
    '.bidsignore'
]


@dataset_task
def create_dataset(store, dataset, name=None, email=None):
    """Create a DataLad git-annex repo for a new dataset."""
    ds = store.get_dataset(dataset)
    with CommitInfo(None, name, email, where='global'):
        ds.create()
        ds.no_annex(BIDS_NO_ANNEX)
        if not ds.repo:
            raise Exception('Repo creation failed.')


def force_rmtree(root_dir):
    """Delete a git tree no matter what. Be CAREFUL calling this!"""
    for root, dirs, files in os.walk(root_dir, topdown=False):
        for name in files:
            file_path = os.path.join(root, name)
            if os.path.isfile(file_path):
                os.chmod(file_path, stat.S_IWUSR | stat.S_IRUSR)
                os.chmod(root, stat.S_IWUSR | stat.S_IRUSR | stat.S_IXUSR)
                os.remove(file_path)
            elif os.path.islink(file_path):
                os.unlink(file_path)
        for name in dirs:
            dir_path = os.path.join(root, name)
            os.chmod(dir_path, stat.S_IWUSR)
            os.rmdir(dir_path)
    os.rmdir(root_dir)


@dataset_task
def delete_dataset(store, dataset):
    """Fully delete a given dataset. Removes all snapshots!"""
    ds = store.get_dataset(dataset)
    force_rmtree(ds.path)


@dataset_task
def create_snapshot(store, dataset, snapshot):
    """
    Create a new snapshot (git tag).

    Raises an exception if the tag already exists.
    """
    ds = store.get_dataset(dataset)
    # Search for any existing tags
    tagged = [tag for tag in ds.repo.get_tags() if tag['name'] == snapshot]
    if not tagged:
        ds.save(version_tag=snapshot)
    else:
        raise Exception(
            'Tag "{}" already exists, name conflict'.format(snapshot))
