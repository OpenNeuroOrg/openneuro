from datalad_service.common.annex import CommitInfo, get_repo_files
from datalad_service.datalad import dataladStore
from datalad_service.common.celery import app


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
