import hashlib
import os
from functools import wraps

import redis
from celery import Celery

from datalad_service.config import DATALAD_WORKERS, REDIS_HOST
from datalad_service.datalad import DataladStore


app = Celery('tasks', broker='redis://{}'.format(REDIS_HOST),
             backend='redis://{}'.format(REDIS_HOST))

app.conf.result_expires = 900


def dataset_queue(dataset):
    return 'dataset-worker-{}'.format(dataset_hash(dataset))


def dataset_hash(key):
    """Return which worker for a given task."""
    return (int(hashlib.sha1(key.encode('utf-8')).hexdigest()[32:40], 16)) % DATALAD_WORKERS


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
