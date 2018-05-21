from datalad_service.common.annex import CommitInfo, get_repo_files
from datalad_service.common.celery import dataset_task
from datalad_service.common.celery import app


@dataset_task
def commit_files(store, dataset, files, name=None, email=None):
    """Commit a list of files with the email and name provided."""
    ds = store.get_dataset(dataset)
    with CommitInfo(ds, name, email):
        if files:
            for filename in files:
                ds.add(filename)
        else:
            ds.add('.')


@dataset_task
def unlock_files(store, dataset, files):
    ds = store.get_dataset(dataset)
    for filename in files:
        ds.unlock(filename)


@dataset_task
def get_files(store, dataset, branch=None):
    """Get the working tree, optionally a branch tree."""
    ds = store.get_dataset(dataset)
    return get_repo_files(ds, branch)

@dataset_task
def remove_files(store, dataset, files):
    ds = store.get_dataset(dataset)
    for filename in files:
        ds.remove(filename, check=False)