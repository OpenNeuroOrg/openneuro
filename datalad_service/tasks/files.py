from datalad_service.common.annex import CommitInfo, get_repo_files
from datalad_service.common.celery import app
from datalad_service.common.celery import dataset_task
from datalad_service.common.celery import dataset_queue
from datalad_service.tasks.validator import validate_dataset


@dataset_task
def commit_files(store, dataset, files, name=None, email=None, validate=True, cookies=None):
    """
    Commit a list of files with the email and name provided.

    Returns the commit hash generated.
    """
    ds = store.get_dataset(dataset)
    with CommitInfo(ds, name, email):
        if files:
            for filename in files:
                ds.add(filename)
        else:
            # If no list of paths, add all untracked files
            ds.add('.')
    ref = ds.repo.get_hexsha()
    if validate:
        # Run the validator but don't block on the request
        queue = dataset_queue(dataset)
        validate_dataset.s(dataset, ds.path, ref, cookies).apply_async(queue=queue)
    return ref


@dataset_task
def unlock_files(store, dataset, files):
    ds = store.get_dataset(dataset)
    for filename in files:
        ds.unlock(filename)


@dataset_task
def get_files(store, dataset, branch='HEAD'):
    """Get the working tree, optionally a branch tree."""
    ds = store.get_dataset(dataset)
    return get_repo_files(ds, branch)

@dataset_task
def remove_files(store, dataset, files, name=None, email=None):
    ds = store.get_dataset(dataset)
    with CommitInfo(ds, name, email):
        for filename in files:
            ds.remove(filename, check=False)