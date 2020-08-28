import os

import gevent

from datalad_service.common.annex import CommitInfo, get_repo_files
from datalad_service.common.draft import update_head
from datalad_service.tasks.validator import validate_dataset


def commit_files(store, dataset, files, name=None, email=None, cookies=None):
    """
    Commit a list of files with the email and name provided.

    Returns the commit hash generated.
    """
    ds = store.get_dataset(dataset)
    with CommitInfo(ds, name, email):
        if files:
            for filename in files:
                ds.save(filename)
        else:
            # If no list of paths, add all untracked files
            ds.save('.')
    ref = ds.repo.get_hexsha()
    # Run the validator but don't block on the request
    validate_dataset(dataset, ds.path, ref,
                     cookies)
    return ref


def unlock_files(store, dataset, files):
    ds = store.get_dataset(dataset)
    for filename in files:
        ds.unlock(filename)


def get_files(store, dataset, branch=None):
    """Get the working tree, optionally a branch tree."""
    ds = store.get_dataset(dataset)
    return get_repo_files(ds, branch)


def get_untracked_files(store, dataset):
    """Get file listing and size metadata for all files in the working tree."""
    ds_path = store.get_dataset_path(dataset)
    fileMeta = []
    for root, dirs, files in os.walk(ds_path):
        if '.git' in dirs:
            dirs.remove('.git')
        if '.datalad' in dirs:
            dirs.remove('.datalad')
        if '.gitattributes' in files:
            files.remove('.gitattributes')
        for filename in files:
            path = os.path.join(root, filename)
            rel_path = os.path.relpath(root, ds_path)
            if (rel_path != '.'):
                file_path = os.path.join(rel_path, filename)
            else:
                file_path = filename
            # Get file size for the uploader
            size = os.path.getsize(path)
            # The id is just a composite of path/size for untracked files
            file_id = '{}:{}'.format(file_path, size)
            fileMeta.append(
                {'filename': file_path, 'size': size, 'id': file_id})
    return fileMeta


def remove_files(store, dataset, files, name=None, email=None, cookies=None):
    ds = store.get_dataset(dataset)
    with CommitInfo(ds, name, email):
        for filename in files:
            ds.remove(filename, check=False)
            update_head(ds, dataset, cookies)


def remove_recursive(store, dataset, path, name=None, email=None, cookies=None):
    """Remove a path within a dataset recursively."""
    ds = store.get_dataset(dataset)
    with CommitInfo(ds, name, email):
        ds.remove(path, recursive=True, check=False)
        update_head(ds, dataset, cookies)
