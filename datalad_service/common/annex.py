import os
import re

from datalad.config import ConfigManager
from datalad.support.exceptions import FileInGitError


SERVICE_EMAIL = 'git@openneuro.org'
SERVICE_USER = 'Git Worker'


def filter_git_files(files):
    """Remove any git/datalad files from a list of files."""
    return [f for f in files if not (f.startswith('.datalad/') or f == '.gitattributes')]


def get_repo_files(dataset, branch=None):
    # If we're on the right branch, use the fast path with branch=None
    if branch == dataset.repo.get_active_branch():
        branch = None
    working_files = filter_git_files(dataset.repo.get_files(branch=branch))
    files = []
    for filename in working_files:
        try:
            # Annexed file
            key = dataset.repo.get_file_key(filename)
            size = dataset.repo.get_size_from_key(key)
        except FileInGitError:
            # Regular git file
            key = dataset.repo.repo.commit(branch).tree[filename].hexsha
            # get file object id here and use as fd
            size = os.path.getsize(os.path.join(dataset.path, filename))
        files.append({'filename': filename, 'size': size, 'id': key})
    return files


def get_from_header(req):
    """Parse the From header for a request."""
    if 'FROM' in req.headers:
        matches = re.match(r"\"(.*)\" <(.*?@.*)>", req.headers['FROM'])
        return matches.group(1), matches.group(2)
    else:
        return None, None


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
