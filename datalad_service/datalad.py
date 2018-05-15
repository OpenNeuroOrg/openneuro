from functools import wraps

import falcon

from datalad.api import Dataset
from datalad_service.common.annex import CommitInfo, get_repo_files
from datalad_service.common.celery import app


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
