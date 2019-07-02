import os
from functools import wraps

import redis
from celery import Celery

from datalad_service.config import DATALAD_WORKERS, REDIS_HOST
from datalad_service.datalad import DataladStore


app = Celery('tasks', broker='redis://{}'.format(REDIS_HOST),
             backend='redis://{}'.format(REDIS_HOST))


def dataset_queue(dataset):
    return 'dataset-worker-{}'.format(dataset_hash(dataset))


def publish_queue():
    return 'publish-worker'


def dataset_hash(key):
    """Return which worker for a given task."""
    return hash(key) % DATALAD_WORKERS


def dataset_task(func):
    """
    Decorate tasks with a real DataladStore object and Celery options.
    """
    @app.task
    @wraps(func)
    def dataset_task_decorator(*args, **kwargs):
        annex_path = args[0]
        arg0 = DataladStore(annex_path) if not isinstance(args[0], DataladStore) else args[0]
        return func(arg0, *args[1:], **kwargs)
    return dataset_task_decorator
