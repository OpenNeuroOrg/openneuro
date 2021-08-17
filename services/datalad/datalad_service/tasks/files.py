import os

import subprocess
import pygit2

from datalad_service.common.annex import get_repo_files
from datalad_service.common.git import git_commit, git_commit_index, committer
from datalad_service.common.draft import update_head
from datalad_service.tasks.validator import validate_dataset


def commit_files(store, dataset, files, name=None, email=None, cookies=None):
    """
    Commit a list of files with the email and name provided.

    Returns the commit hash generated.
    """
    dataset_path = store.get_dataset_path(dataset)
    repo = pygit2.Repository(dataset_path)
    author = name and pygit2.Signature(name, email) or committer
    ref = git_commit(repo, files, author)
    # Run the validator but don't block on the request
    validate_dataset(dataset, dataset_path, ref.hex,
                     cookies)
    return ref


def get_files(store, dataset, branch=None):
    """Get the working tree, optionally a branch tree."""
    dataset_path = store.get_dataset_path(dataset)
    return get_repo_files(dataset_path, branch)


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


def remove_files(store, dataset, paths, name=None, email=None, cookies=None):
    dataset_path = store.get_dataset_path(dataset)
    repo = pygit2.Repository(dataset_path)
    if name and email:
        author = pygit2.Signature(name, email)
    else:
        author = None
    repo.index.remove_all(paths)
    repo.index.write()
    hexsha = git_commit_index(repo, author,
                              message="[OpenNeuro] Files removed").hex
    update_head(dataset, dataset_path, hexsha, cookies)


def remove_annex_object(store, dataset, annex_key):
    """Remove an annex object by its key.

    :type annex_key: str
    :return: True if successful, false is the annex object does not exist.
    :rtype: bool
    """
    with subprocess.Popen(
        ['git-annex', 'drop', '--force', f'--key={annex_key}'],
        cwd=dataset._path,
        stdout=subprocess.PIPE,
        encoding='utf-8'
    ) as drop_object:
        for i, line in enumerate(drop_object.stdout):
            if i == 0 and line[-2:] == 'ok':
                return True
    return False
