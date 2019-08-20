import hashlib
from mmap import mmap
import os
import re
import stat
import subprocess

from datalad.config import ConfigManager
from datalad.support.exceptions import FileInGitError, FileNotInAnnexError


SERVICE_EMAIL = 'git@openneuro.org'
SERVICE_USER = 'Git Worker'


def create_file_obj(dataset, tree, file_key):
    """For the DataLad fallback, create one row in the files results."""
    filename, key = file_key
    file_path = os.path.join(dataset.path, filename)
    rel_path = os.path.relpath(file_path, dataset.path)
    # Annexed file
    if key:
        size = dataset.repo.get_size_from_key(key)
    # Regular
    if not key:
        key = tree[filename].hexsha
        size = tree[filename].size
    file_id = compute_file_hash(key, rel_path)
    return {'filename': filename,
            'size': size,
            'id': file_id,
            'key': key}


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


def compute_file_hash(git_hash, path):
    """Computes a unique hash for a given git path, based on the git hash and path values."""
    return hashlib.sha1('{}:{}'.format(git_hash, path).encode()).hexdigest()


def parse_ls_tree_line(gitTreeLine):
    """Read one line of `git ls-tree` output and produce filename + metadata fields"""
    metadata, filename = gitTreeLine.split('\t')
    mode, obj_type, obj_hash, size = metadata.split()
    return [filename, mode, obj_type, obj_hash, size]


def read_ls_tree_line(gitTreeLine, files, symlinkFilenames, symlinkObjects):
    """Read one line of `git ls-tree` and append to the correct buckets of files, symlinks, and objects."""
    filename, mode, obj_type, obj_hash, size = parse_ls_tree_line(
        gitTreeLine)
    # Skip git / datalad files
    if filename.startswith('.git/'):
        return
    if filename.startswith('.datalad/'):
        return
    if filename == '.gitattributes':
        return
    # Check if the file is annexed or a submodule
    if (mode == '120000'):
        # Save annexed file symlinks for batch processing
        symlinkFilenames.append(filename)
        symlinkObjects.append(obj_hash)
    elif (mode == '160000'):
        # Skip submodules
        return
    else:
        # Immediately append regular files
        file_id = compute_file_hash(obj_hash, filename)
        files.append({'filename': filename, 'size': int(size),
                      'id': file_id, 'key': obj_hash})


def get_repo_files(dataset, branch='HEAD'):
    """Read all files in a repo at a given branch, tag, or commit hash."""
    dir_fd = os.open(dataset.path, os.O_RDONLY)
    gitProcess = subprocess.Popen(
        ['git', 'ls-tree', '-l', '-r', branch], cwd=dataset.path, stdout=subprocess.PIPE, encoding='utf-8')
    files = []
    symlinkFilenames = []
    symlinkObjects = []
    for line in gitProcess.stdout:
        gitTreeLine = line.rstrip()
        read_ls_tree_line(gitTreeLine, files, symlinkFilenames, symlinkObjects)
    # After regular files, process all symlinks with one git cat-file --batch call
    # This is about 100x faster than one call per file for annexed file heavy datasets
    catFileInput = '\n'.join(symlinkObjects)
    catFileProcess = subprocess.run(['git', 'cat-file', '--batch', '--buffer'],
                                    cwd=dataset.path, stdout=subprocess.PIPE, input=catFileInput, encoding='utf-8')
    # Output looks like this:
    # dc9dde956f6f28e425a412a4123526e330668e7e blob 140
    # ../../.git/annex/objects/Q0/VP/MD5E-s1618574--43762c4310549dcc8c5c25567f42722d.nii.gz/MD5E-s1618574--43762c4310549dcc8c5c25567f42722d.nii.gz
    for index, line in enumerate(catFileProcess.stdout.splitlines()):
        # Skip metadata (even) lines
        if index % 2 == 1:
            key = line.rstrip().split('/')[-1]
            # Get the size from key
            size = int(key.split('-', 2)[1].lstrip('s'))
            filename = symlinkFilenames[(index - 1) // 2]
            file_id = compute_file_hash(key, filename)
            files.append({'filename': filename, 'size': int(
                size), 'id': file_id, 'key': key})
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
