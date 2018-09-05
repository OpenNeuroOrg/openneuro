import os
import re

from datalad.config import ConfigManager
from datalad.support.exceptions import FileInGitError, FileNotInAnnexError


SERVICE_EMAIL = 'git@openneuro.org'
SERVICE_USER = 'Git Worker'

def create_file_obj(dataset, tree, file_key):
    filename, key = file_key
    # Annexed file
    if key:
        size = dataset.repo.get_size_from_key(key)
    # Regular
    if not key:
        key = tree[filename].hexsha
        size = os.path.getsize(os.path.join(dataset.path, filename))
    return {'filename': filename,
            'size': size,
            'id': key}


def get_repo_files(dataset, branch=None):
    # If we're on the right branch, use the fast path with branch=None
    if branch == 'HEAD' or branch == dataset.repo.get_active_branch():
        branch = None
    working_files = dataset.repo.get_files(branch=branch)
    # Do the tree lookup only once
    tree = dataset.repo.repo.commit(branch).tree
    # Zip up array of (filename, key) tuples
    file_keys = zip(working_files, dataset.repo.get_file_key(working_files))
    # Produce JSON results and lookup any missing non-annex file sizes
    files = [create_file_obj(dataset, tree, file_key)
             for file_key in file_keys if not (file_key[0].startswith('.datalad/') or file_key[0] == '.gitattributes')]
    return files


class CommitInfo():
    """Context manager for setting commit info on datalad operations that use it."""

    def __init__(self, dataset, name=None, email=None, where='local'):
        self.config_manager = ConfigManager(dataset)
        self.email = email if email else SERVICE_EMAIL
        self.name = name if name else SERVICE_USER
        self.where = where

    def __enter__(self):
        self.config_manager.set('user.email', self.email, self.where)
        self.config_manager.set('user.name', self.name, self.where)

    def __exit__(self, exception_type, exception_value, traceback):
        self.config_manager.set('user.email', SERVICE_EMAIL, self.where)
        self.config_manager.set('user.name', SERVICE_USER, self.where)
