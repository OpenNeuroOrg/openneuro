import asyncio
import subprocess
import pygit2

from datalad_service.common.annex import get_repo_files
from datalad_service.common.git import git_commit, git_commit_index, COMMITTER_EMAIL, COMMITTER_NAME
from datalad_service.tasks.validator import validate_dataset


def commit_files(store, dataset, files, name=None, email=None, cookies=None):
    """
    Commit a list of files with the email and name provided.

    Returns the commit hash generated.
    """
    dataset_path = store.get_dataset_path(dataset)
    repo = pygit2.Repository(dataset_path)
    author = name and email and pygit2.Signature(name, email) or pygit2.Signature(
        COMMITTER_NAME, COMMITTER_EMAIL)
    ref = git_commit(repo, files, author)
    # Run the validator but don't block on the request
    asyncio.create_task(validate_dataset(dataset, dataset_path, str(ref), cookies))
    return ref


def get_tree(store, dataset, tree):
    """Get the working tree, optionally a branch tree."""
    dataset_path = store.get_dataset_path(dataset)
    return get_repo_files(dataset, dataset_path, tree)


def remove_files(store, dataset, paths, name=None, email=None, cookies=None):
    dataset_path = store.get_dataset_path(dataset)
    repo = pygit2.Repository(dataset_path)
    if name and email:
        author = pygit2.Signature(name, email)
    else:
        author = None
    repo.index.remove_all(paths)
    repo.index.write()
    repo.checkout_index()
    hexsha = str(git_commit_index(repo, author,
                              message="[OpenNeuro] Files removed"))


def remove_annex_object(dataset_path, annex_key):
    """Remove an annex object by its key.

    :type annex_key: str
    :return: True if successful, false is the annex object does not exist.
    :rtype: bool
    """
    with subprocess.Popen(
        ['git-annex', 'drop', '--force', f'--key={annex_key}'],
        cwd=dataset_path,
        stdout=subprocess.PIPE,
        encoding='utf-8'
    ) as drop_object:
        for i, line in enumerate(drop_object.stdout):
            if i == 0 and line[-2:] == 'ok':
                # If successful, delete from s3-PUBLIC as well
                subprocess.Popen(
                    ['git-annex', 'drop', '--force',
                        f'--key={annex_key}', '--from=s3-PUBLIC'],
                    cwd=dataset_path,
                    stdout=subprocess.PIPE,
                    encoding='utf-8'
                )
                return True
    return False
