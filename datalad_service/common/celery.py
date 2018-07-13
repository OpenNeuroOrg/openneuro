import os
from functools import wraps

import redis
from celery import Celery

from datalad_service.config import DATALAD_WORKERS
from datalad_service.datalad import DataladStore


app = Celery('tasks', broker='redis://redis', backend='redis://redis')


def dataset_queue(dataset):
    return 'dataset-worker-{}'.format(dataset_hash(dataset))


def dataset_hash(key):
    """Return which worker for a given task."""
    return hash(key) % DATALAD_WORKERS + 1


def dataset_task(func):
    """
    Decorate tasks with a real DataladStore object and Celery options.
    """
    @app.task
    @wraps(func)
    def dataset_task_decorator(*args, **kwargs):
        annex_path = args[0]
        return func(DataladStore(annex_path), *args[1:], **kwargs)
    return dataset_task_decorator
