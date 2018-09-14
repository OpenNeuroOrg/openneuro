import hashlib
from mmap import mmap
import os
import re
import stat

from datalad.config import ConfigManager
from datalad.support.exceptions import FileInGitError, FileNotInAnnexError


SERVICE_EMAIL = 'git@openneuro.org'
SERVICE_USER = 'Git Worker'

def create_file_obj(dataset, tree, file_key):
    """For the DataLad fallback, create one row in the files results."""
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


def compute_git_hash(path, size):
    """Given a path and size, generate the git blob hash for a file."""
    git_obj_header = 'blob {}'.format(size).encode() + b'\x00'
    blob_hash = hashlib.sha1()
    blob_hash.update(git_obj_header)
    # If size is zero, skip opening and mmap
    if size > 0:
        with open(path, 'r+b') as fd:
            # Maybe we don't need mmap here?
            # It profiles marginally faster with contrived large files
            with mmap(fd.fileno(), 0) as mm:
                blob_hash.update(mm)
    return blob_hash.hexdigest()


def get_repo_files(dataset, branch=None):
    # If we're on the right branch, use the fast path with branch=None
    if branch == None or branch == 'HEAD' or branch == dataset.repo.get_active_branch():
        files = []
        for dirpath, dirnames, filenames in os.walk(dataset.path, topdown=True):
            # Filter out the '.git' and '.datalad' dirs
            # topdown=True lets us do this during the loop
            dirnames[:] = [d for d in dirnames if not (d == '.git' or d == '.datalad')]
            for f_name in filenames:
                # Skip any .gitattributes
                if f_name == '.gitattributes':
                    continue
                f_path = os.path.join(dirpath, f_name)
                rel_path = os.path.relpath(f_path, dataset.path)
                f_stat = os.lstat(f_path)
                if stat.S_ISLNK(f_stat.st_mode):
                    # Annexed file
                    l_path = os.readlink(f_path)
                    key = l_path.split('/')[-1]
                    # Get the size from key
                    size = int(key.split('-', 2)[1].lstrip('s'))
                    files.append({'filename': rel_path, 'size': size, 'id': key})
                else:
                    # Regular git file
                    size = f_stat.st_size
                    # Compute git hash
                    # An alternative would be to switch away from hashing
                    # but this is pretty efficient since it only looks at non-annex files
                    blob_hash = compute_git_hash(f_path, size)
                    files.append({'filename': rel_path, 'size': size,
                                  'id': blob_hash})
        return files
    else:
        working_files = dataset.repo.get_files(branch=branch)
        # Do the tree lookup only once
        tree = dataset.repo.repo.commit(branch).tree
        # Zip up array of (filename, key) tuples
        file_keys = zip(
            working_files, dataset.repo.get_file_key(working_files))
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
