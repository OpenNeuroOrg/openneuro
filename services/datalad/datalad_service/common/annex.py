import hashlib
import io
import json
from mmap import mmap
import subprocess
import os
import urllib.parse
import time
import uuid

import aiofiles
import pygit2

import datalad_service.config
from datalad_service.common.git import git_show
from datalad_service.common.s3_client import presign_remote_url, get_s3_remote

SERVICE_EMAIL = 'git@openneuro.org'
SERVICE_USER = 'Git Worker'
S3_BUCKETS_WHITELIST = [
    'openneuro.org',
    'openneuro-dev-datalad-public',
    'openneuro-derivatives',
    'bobsrepository',
    'openneuro-datalad-public-nell-test',
]


class InitRemoteException(Exception):
    """Raised when git-annex initremote fails."""

    pass


class EditAnnexedFileException(Exception):
    """Snapshot conflicts with existing name."""

    pass


def init_annex(dataset_path):
    """Setup git-annex within an existing git repo"""
    subprocess.run(
        ['git-annex', 'init', 'OpenNeuro', '--numcopies=2'],
        check=True,
        cwd=dataset_path,
    )


def compute_git_hash(path, size):
    """Given a path and size, generate the git blob hash for a file."""
    git_obj_header = f'blob {size}'.encode() + b'\x00'
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
    return hashlib.sha1(f'{git_hash}:{path}'.encode()).hexdigest()


def parse_ls_tree_line(gitTreeLine):
    """Read one line of `git ls-tree` output and produce filename + metadata fields"""
    metadata, filename = gitTreeLine.split('\t')
    mode, obj_type, obj_hash, size = metadata.split()
    return [filename, mode, obj_type, obj_hash, size]


def read_ls_tree_line(gitTreeLine, files, symlinkFilenames, symlinkObjects):
    """Read one line of `git ls-tree` and append to the correct buckets of files, symlinks, and objects."""
    filename, mode, obj_type, obj_hash, size = parse_ls_tree_line(gitTreeLine)
    # Skip git / datalad files
    if filename.startswith('.git'):
        return
    if filename.startswith('.datalad'):
        return
    if filename == '.gitattributes':
        return
    # Check if the file is annexed or a submodule
    if mode == '120000':
        # Save annexed file symlinks for batch processing
        symlinkFilenames.append(filename)
        symlinkObjects.append(obj_hash)
    elif mode == '160000':
        # Skip submodules
        return
    else:
        # Immediately append regular files
        if size == '-':
            # Tree objects do not have sizes and are never annexed
            files.append(
                {
                    # Computing an id here is important but the client needs to manage the cache merge since only the client knows the parent directory
                    'id': compute_file_hash(obj_hash, filename),
                    'key': obj_hash,
                    'filename': filename,
                    'directory': True,
                    'annexed': False,
                    'size': 0,
                    'urls': [],
                }
            )
        else:
            file_id = compute_file_hash(obj_hash, filename)
            files.append(
                {
                    'filename': filename,
                    'size': int(size),
                    'id': file_id,
                    'key': obj_hash,
                    'directory': False,
                    'urls': [],
                    'annexed': False,
                }
            )


def compute_rmet(key, legacy=False):
    if len(key) == 40:
        if legacy:
            key = f'SHA1--{key}'
        else:
            key = f'GIT--{key}'
    keyHash = hashlib.md5(key.encode()).hexdigest()
    return f'{keyHash[0:3]}/{keyHash[3:6]}/{key}.log.rmet'


def parse_remote_line(remoteLine):
    remoteConfig = dict(
        item.split('=', maxsplit=1) for item in remoteLine[37:].split(' ')
    )
    if remoteConfig['type'] == 'S3' and remoteConfig['bucket'] in S3_BUCKETS_WHITELIST:
        remoteUuid = remoteLine[0:36]
        remoteUrl = remoteConfig['publicurl'] if 'publicurl' in remoteConfig else None
        return {'uuid': remoteUuid, 'url': remoteUrl, 'name': remoteConfig['name']}


def parse_rmet_line(remote, rmetLine):
    """Read one rmet line and return a valid URL for this object"""
    try:
        remoteContext, remoteData = rmetLine.split('V +')
        slash = '' if remote['url'][-1] == '/' else '/'
        s3version, path = remoteData.split('#')
        if remote['name'] == get_s3_remote():
            # Presigned via OpenNeuro's credentials
            url = presign_remote_url(path, s3version)
            return url
        else:
            # Anonymous access for any other buckets
            return encode_remote_url(
                '{}{}{}?versionId={}'.format(remote['url'], slash, path, s3version)
            )
    except:
        raise
        return None


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


def encode_remote_url(url):
    """S3 requires some characters to be encoded"""
    return urllib.parse.quote_plus(url, safe='/:?=')


def get_repo_urls(path, files):
    """For each file provided, obtain the rmet data and append URLs if possible."""
    # First obtain the git-annex branch objects
    gitAnnexBranch = subprocess.Popen(
        ['git', 'ls-tree', '-l', '-r', 'git-annex'],
        cwd=path,
        stdout=subprocess.PIPE,
        encoding='utf-8',
    )
    rmetObjects = {}
    for line in gitAnnexBranch.stdout:
        filename, mode, obj_type, obj_hash, size = parse_ls_tree_line(line.rstrip())
        rmetObjects[filename] = obj_hash
    if 'remote.log' not in rmetObjects:
        # Skip searching for URLs if no remote.log is present
        return files
    rmetPaths = []
    rmetFiles = {}
    for f in files:
        if 'key' in f:
            rmetPath = compute_rmet(f['key'])
            if rmetPath in rmetObjects:
                # Keep a reference to the files so we can add URLs later
                rmetFiles[rmetPath] = f
                rmetPaths.append(rmetPath)
            else:
                # Check for alternate path used by older versions of git-annex
                rmetPath = compute_rmet(f['key'], legacy=True)
                if rmetPath in rmetObjects:
                    rmetFiles[rmetPath] = f
                    rmetPaths.append(rmetPath)
    # Then read those objects with git cat-file --batch
    gitObjects = ''
    if 'trust.log' in rmetObjects:
        gitObjects += rmetObjects['trust.log'] + '\n'
    gitObjects += rmetObjects['remote.log'] + '\n'
    gitObjects += '\n'.join(rmetObjects[rmetPath] for rmetPath in rmetPaths)
    catFileProcess = subprocess.run(
        ['git', 'cat-file', '--batch=:::%(objectname)', '--buffer'],
        cwd=path,
        stdout=subprocess.PIPE,
        input=gitObjects,
        encoding='utf-8',
        bufsize=0,
        text=True,
    )
    catFile = io.StringIO(catFileProcess.stdout)
    # Read in trust.log and remote.log first
    trustLog = {}
    if 'trust.log' in rmetObjects:
        trustLogMetadata = catFile.readline().rstrip()
        while True:
            line = catFile.readline().rstrip()
            if line == '':
                break
            else:
                uuid, trust, timestamp = line.split(' ')
                trustLog[uuid] = trust
    remoteLogMetadata = catFile.readline().rstrip()
    remote = None
    while True:
        line = catFile.readline().rstrip()
        if line == '':
            break
        else:
            matchedRemote = parse_remote_line(line)
            # X remotes are dead
            if (
                matchedRemote
                and matchedRemote['uuid'] in trustLog
                and trustLog[matchedRemote['uuid']] == 'X'
            ):
                continue
            if matchedRemote:
                remote = matchedRemote
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


def get_repo_files(dataset, dataset_path, tree):
    """Read all files in a repo at a given branch, tag, or commit hash."""
    gitProcess = subprocess.Popen(
        ['git', 'ls-tree', '-l', tree],
        cwd=dataset_path,
        stdout=subprocess.PIPE,
        encoding='utf-8',
    )
    files = []
    symlinkFilenames = []
    symlinkObjects = []
    for line in gitProcess.stdout:
        gitTreeLine = line.rstrip()
        read_ls_tree_line(gitTreeLine, files, symlinkFilenames, symlinkObjects)
    # After regular files, process all symlinks with one git cat-file --batch call
    # This is about 100x faster than one call per file for annexed file heavy datasets
    catFileInput = '\n'.join(symlinkObjects)
    catFileProcess = subprocess.run(
        ['git', 'cat-file', '--batch', '--buffer'],
        cwd=dataset_path,
        stdout=subprocess.PIPE,
        input=catFileInput,
        encoding='utf-8',
    )
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
            files.append(
                {
                    'filename': filename,
                    'size': int(size),
                    'id': file_id,
                    'key': key,
                    'urls': [],
                    'annexed': True,
                    'directory': False,
                }
            )
    # Now find URLs for each file if available
    files = get_repo_urls(dataset_path, files)
    # Provide fallbacks for any URLs that did not match rmet exports
    for f in files:
        if not f['directory'] and len(f['urls']) == 0:
            key = f['key']
            fallback = f'{datalad_service.config.CRN_SERVER_URL}/crn/datasets/{dataset}/objects/{key}'
            encoded_url = encode_remote_url(fallback)
            f['urls'].append(encoded_url)
    return files


def get_tag_info(dataset_path, tag):
    """`git annex info <tag>`"""
    git_process = subprocess.run(
        ['git-annex', 'info', '--json', tag], cwd=dataset_path, capture_output=True
    )
    return json.loads(git_process.stdout)


def is_git_annex_remote(dataset_path, remote):
    """Test if a remote is a git-annex remote and active."""
    remote_info = get_tag_info(dataset_path, remote)
    if remote_info['success']:
        # Exists and is a remote
        if remote_info['remote'] == remote:
            return True
        else:
            # Some other object likely matched
            return False
    else:
        # Nothing like this exists
        return False


async def edit_annexed_file(path, expected_content, new_content, encoding='utf-8'):
    """
    Edit a git or annexed file by correctly removing the symlink and writing the new content.

    Check contents to verify the expected object is being modified.
    """
    real_path = os.path.realpath(path)
    # Test if the annexed target exists
    if os.path.exists(real_path):
        # Open the working tree or annexed path to verify contents
        async with aiofiles.open(
            real_path, 'r', encoding='utf-8', newline=''
        ) as annexed_file:
            annexed_file_contents = await annexed_file.read()
            if expected_content != annexed_file_contents:
                raise EditAnnexedFileException('unexpected {path} content')
    # Open the working tree path to overwrite
    if path != real_path:
        os.unlink(path)
    async with aiofiles.open(path, 'w', encoding=encoding, newline='') as changes_file:
        await changes_file.write(new_content)


def test_key_remote(dataset_path, key, remote_name='s3-PUBLIC'):
    """
    Test if a key exists in the named remote and return the rmet URL if so.
    """
    repo = pygit2.Repository(dataset_path)
    try:
        remote_log = git_show(repo, 'git-annex', 'remote.log')
    except KeyError:
        return None
    for line in remote_log.splitlines():
        remote = parse_remote_line(line)
        if remote and remote['name'] == remote_name:
            rmet_path = compute_rmet(key)
            try:
                rmet = git_show(repo, 'git-annex', rmet_path)
            except KeyError:
                return None
            for line in rmet:
                if remote['uuid'] in line:
                    return parse_rmet_line(remote, line)
    return None


def annex_initremote(dataset_path, remote_name, remote_options):
    """Initialize a git-annex remote manually."""
    remote_uuid = str(uuid.uuid4())
    repo = pygit2.Repository(dataset_path)
    branch = repo.branches.get('git-annex')
    if not branch:
        raise InitRemoteException('git-annex branch not found')
    commit = branch.peel()
    tree = commit.tree
    # Read remote.log
    file_content = ''
    log_entry = None
    try:
        # Check if 'remote.log' exists in the tree
        log_entry = tree['remote.log']
        blob = repo.get(log_entry.id)

        # Ensure file is not binary
        if not blob.is_binary:
            file_content = blob.data.decode('utf-8')
        else:
            raise InitRemoteException("'remote.log' is a binary file, cannot read.")
    except KeyError:
        # 'remote.log' doesn't exist yet, we'll create it.
        file_content = ''  # Ensure it's an empty string

    new_content = (
        file_content
        + f'{remote_uuid} name={remote_name} timestamp={int(time.time())}s '
        + ' '.join(remote_options)
    )
    new_blob_oid = repo.create_blob(new_content.encode('utf-8'))
    builder = repo.TreeBuilder(tree)
    builder.insert('remote.log', new_blob_oid, pygit2.GIT_FILEMODE_BLOB)
    new_tree_oid = builder.write()
    author = pygit2.Signature(SERVICE_USER, SERVICE_EMAIL)
    committer = pygit2.Signature(SERVICE_USER, SERVICE_EMAIL)
    commit_message = f'[OpenNeuro] Initialize git-annex remote {remote_name}'
    repo.create_commit(
        branch.name,  # The ref to update (our branch)
        author,  # The commit author
        committer,  # The commit committer
        commit_message,  # The commit message
        new_tree_oid,  # The OID of the new tree
        [commit.id],  # List of parent commit OIDs
    )
    return remote_uuid
