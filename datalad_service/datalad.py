import logging
import os
import stat
import shutil
from functools import wraps

import falcon

from datalad.api import Dataset
from .common.annex import CommitInfo, get_repo_files
from .common.celery import app


class DataladStore(object):
    """Store for Datalad state accessed by resource handlers."""

    def __init__(self, annex_path):
        self.annex_path = annex_path

    def get_dataset(self, name):
        """Return raw Datalad API dataset based on the name param."""
        return Dataset(self.get_dataset_path(name))

    def get_dataset_path(self, name):
        return '{}/{}'.format(self.annex_path, name)


def dataladStore(func):
    """Decorator to convert the annex path argument to a store"""
    @wraps(func)
    def setupStoreWrapper(*args, **kwargs):
        annex_path = args[0]
        store = DataladStore(annex_path)
        return func(store, *args[1:], **kwargs)
    return setupStoreWrapper


@app.task
@dataladStore
def create_dataset(store, dataset):
    ds = store.get_dataset(dataset)
    ds.create()
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


@app.task
@dataladStore
def delete_dataset(store, dataset):
    ds = store.get_dataset(dataset)
    force_rmtree(ds.path)


@app.task
@dataladStore
def commit_files(store, dataset, files, email=None, name=None):
    ds = store.get_dataset(dataset)
    with CommitInfo(ds, email, name):
        for filename in files:
            ds.add(filename)


@app.task
@dataladStore
def unlock_files(store, dataset, files):
    ds = store.get_dataset(dataset)
    for filename in files:
        ds.unlock(filename)


@app.task
@dataladStore
def get_files(store, dataset, branch=None):
    ds = store.get_dataset(dataset)
    return get_repo_files(ds, branch)


@app.task
@dataladStore
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
