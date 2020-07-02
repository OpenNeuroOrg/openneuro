import hashlib
from mmap import mmap
import json
import os
import re
import io
import stat
import subprocess

from datalad.config import ConfigManager


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
                      'id': file_id, 'key': obj_hash, 'urls': []})


def compute_rmet(key):
    if len(key) == 40:
        key = 'SHA1--{}'.format(key)
    keyHash = hashlib.md5(key.encode()).hexdigest()
    return '{}/{}/{}.log.rmet'.format(keyHash[0:3], keyHash[3:6], key)


def parse_remote_line(remoteLine,
                      preferredRemote='s3-PUBLIC'):
    remoteConfig = dict(item.split('=')
                        for item in remoteLine[37:].split(' '))
    if remoteConfig['name'] == preferredRemote:
        remoteUuid = remoteLine[0:36]
        remoteUrl = remoteConfig['publicurl'] if 'publicurl' in remoteConfig else None
        return {'uuid': remoteUuid, 'url': remoteUrl}


def parse_rmet_line(remote, rmetLine):
    """Read one rmet line and return a valid URL for this object"""
    remoteContext, remoteData = rmetLine.split('V +')
    slash = '' if remote['url'][-1] == '/' else '/'
    if '#' in remoteData:
        s3version, path = remoteData.split('#')
        return '{}{}{}?versionId={}'.format(remote['url'], slash, path, s3version)
    else:
        # Handle unversioned data
        path = remoteData
        return '{}{}{}'.format(remote['url'], slash, path)


def read_rmet_file(remote, catFile):
    # First line is git metadata
    line = catFile.readline().rstrip()
    url = None
    if line[0:3] == ':::':
        while True:
            # Examine each remote entry in the rmet file
            nextLine = catFile.readline().rstrip()
            if nextLine == '':
                break
            else:
                # If we find expected remote, return the URL
                if remote['uuid'] in nextLine:
                    url = parse_rmet_line(remote, nextLine)
    return url


def get_repo_urls(path, files):
    """For each file provided, obtain the rmet data and append URLs if possible."""
    # First obtain the git-annex branch objects
    gitAnnexBranch = subprocess.Popen(
        ['git', 'ls-tree', '-l', '-r', 'git-annex'], cwd=path, stdout=subprocess.PIPE, encoding='utf-8')
    rmetObjects = {}
    for line in gitAnnexBranch.stdout:
        filename, mode, obj_type, obj_hash, size = parse_ls_tree_line(
            line.rstrip())
        rmetObjects[filename] = obj_hash
    if 'remote.log' not in rmetObjects:
        # Skip searching for URLs if no remote.log is present
        return files
    rmetPaths = []
    rmetFiles = {}
    for f in files:
        rmetPath = compute_rmet(f['key'])
        if rmetPath in rmetObjects:
            # Keep a reference to the files so we can add URLs later
            rmetFiles[rmetPath] = f
            rmetPaths.append(rmetPath)
    # Then read those objects with git cat-file --batch
    gitObjects = rmetObjects['remote.log'] + '\n' + \
        '\n'.join(rmetObjects[rmetPath] for rmetPath in rmetPaths)
    catFileProcess = subprocess.run(['git', 'cat-file', '--batch=:::%(objectname)', '--buffer'],
                                    cwd=path, stdout=subprocess.PIPE, input=gitObjects, encoding='utf-8', bufsize=0, universal_newlines=True)
    catFile = io.StringIO(catFileProcess.stdout)
    # Read in remote.log first
    remoteLogMetadata = catFile.readline().rstrip()
    remote = None
    while True:
        line = catFile.readline().rstrip()
        if line == '':
            break
        else:
            matched_remote = parse_remote_line(line)
            if matched_remote:
                remote = matched_remote
    # Check if we found a useful external remote
    if remote:
        # Read the rest of the files.
        # Output looks like this:
        # fc83dd77328c85d9856d661ccee76b9c550b0600 blob 129
        # 1590213748.042921433s 57894849-d0c8-4c62-8418-3627be18a196:V +iVcEk18e3J2WQys4zr_ANaTPfpUufW4Y#ds002778/dataset_description.json
        # 1590213748.042921433s c6ba9b9b-ce53-4dfb-b2cc-d2ebf5f27a99:V +z9Zl27ykeacyuMzZGfSbzrblwxPkN2SM#ds002778/dataset_description.json
        # \n
        for path in rmetPaths:
            url = read_rmet_file(remote, catFile)
            if url:
                rmetFiles[path]['urls'].append(url)
    return files


def get_repo_files(dataset, branch='HEAD'):
    """Read all files in a repo at a given branch, tag, or commit hash."""
    gitProcess = subprocess.Popen(
        ['git', 'ls-tree', '-l', '-r', branch], cwd=dataset.path, stdout=subprocess.PIPE, encoding='utf-8')
    files = []
    symlinkFilenames = []
    symlinkObjects = []
    for line in gitProcess.stdout:
        gitTreeLine = line.rstrip()
        read_ls_tree_line(gitTreeLine, files,
                          symlinkFilenames, symlinkObjects)
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
                size), 'id': file_id, 'key': key, 'urls': []})
    # Now find URLs for each file if available
    return get_repo_urls(dataset.path, files)


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
