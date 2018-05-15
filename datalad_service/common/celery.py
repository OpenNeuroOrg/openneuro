from functools import wraps

import redis
from celery import Celery

import datalad_service.common.redis
from datalad_service.datalad import DataladStore

app = Celery('tasks', broker='redis://redis', backend='redis://redis')


class DatasetLockException(Exception):
    """Thrown when a dataset lock could not be acquired."""


def dataset_task(func):
    """
    Decorate tasks with a real DataladStore object and datasetId locking.

    Uses exponential backoff to retry tasks that did not acquire a lock without blocking on them.
    """
    @app.task(autoretry_for=(DatasetLockException,), retry_backoff=True, retry_backoff_max=3600)
    @wraps(func)
    def dataset_task_decorator(*args, **kwargs):
        print(args)
        annex_path = args[0]
        store = DataladStore(annex_path)
        datasetId = args[1]
        final = None
        acquired = False
        lock = datalad_service.common.redis.redisClient.lock(datasetId)
        try:
            acquired = lock.acquire(blocking=False)
            if acquired:
                final = func(store, *args[1:], **kwargs)
            else:
                raise DatasetLockException()
        finally:
            if acquired:
                lock.release()
        return final
    return dataset_task_decorator
