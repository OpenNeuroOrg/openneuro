import base64
import hashlib
import json
from mmap import mmap
import re
import subprocess
import os
import posixpath
import urllib.parse
import time
import uuid
from collections import defaultdict

import aiofiles
import pygit2

import datalad_service.config
from datalad_service.common.git import git_show
from datalad_service.common.s3_client import get_s3_remote

SERVICE_EMAIL = 'git@openneuro.org'
SERVICE_USER = 'Git Worker'
S3_BUCKETS_WHITELIST = [
    'openneuro.org',
    'openneuro-dev-datalad-public',
    'openneuro-derivatives',
    'bobsrepository',
    'openneuro-datalad-public-nell-test',
]

annex_key_re = re.compile(
    r'^(?P<backend>[A-Z0-9]+)-s(?P<size>[0-9]+)--(?P<hash>[a-f0-9]+)'
)


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


def compute_rmet(key):
    if len(key) == 40:
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
        return {
            'uuid': remoteUuid,
            'url': remoteUrl,
            'name': remoteConfig['name'],
            'x-amz-tagging': remoteConfig.get('x-amz-tagging'),
        }


def parse_rmet_line(remote, rmetLine):
    """Read one rmet line and return a valid URL for this object"""
    remoteContext, remoteData = rmetLine.split('V +')
    slash = '' if remote['url'][-1] == '/' else '/'
    if remoteData[0] == '!':
        try:
            remoteData = base64.b64decode(remoteData[1:]).decode('utf-8')
        except UnicodeDecodeError:
            return None
    s3version, path = remoteData.split('#')
    # Anonymous access for public data or other buckets
    return encode_remote_url(
        '{}{}{}?versionId={}'.format(remote['url'], slash, path, s3version)
    )


def read_rmet_blob(remote, blob_data):
    """Extract URL from raw rmet blob bytes for the given remote."""
    url = None
    for line in blob_data.decode('utf-8').splitlines():
        if remote['uuid'] in line:
            url = encode_remote_url(parse_rmet_line(remote, line))
    return url


def encode_remote_url(url):
    """S3 requires some characters to be encoded"""
    return urllib.parse.quote_plus(url, safe='/:?=')


def get_repo_urls(repo, files):
    """For each file provided, obtain the rmet data and append URLs if possible."""
    try:
        annex_tree = repo.revparse_single('git-annex').peel(pygit2.Tree)
    except KeyError:
        return files

    # Read trust.log
    trust_log = {}
    try:
        trust_blob = repo[annex_tree['trust.log'].id]
        for line in trust_blob.data.decode('utf-8').splitlines():
            line = line.strip()
            if line:
                uuid, trust, timestamp = line.split(' ')
                trust_log[uuid] = trust
    except KeyError:
        pass

    # Read remote.log
    try:
        remote_blob = repo[annex_tree['remote.log'].id]
    except KeyError:
        return files

    remote = None
    for line in remote_blob.data.decode('utf-8').splitlines():
        if not line.strip():
            continue
        matched = parse_remote_line(line.strip())
        # X remotes are dead
        if matched and trust_log.get(matched['uuid']) == 'X':
            continue
        if matched:
            remote = matched

    if not remote:
        return files

    # Build rmet lookup
    rmet_files = defaultdict(list)
    for f in files:
        if not f.get('directory'):
            rmet_path = compute_rmet(f['id'])
            rmet_files[rmet_path].append(f)

    # Resolve URLs from rmet blobs
    for rmet_path, file_list in rmet_files.items():
        try:
            blob = repo[annex_tree[rmet_path].id]
            url = read_rmet_blob(remote, blob.data)
            if url:
                for f in file_list:
                    f['urls'].append(url)
        except KeyError:
            continue

    return files


def _read_tree_pygit2(repo, tree_obj, dataset_path):
    """Read a single tree object using pygit2.

    Returns a list of file entries with annex key resolution where applicable.
    """
    files = []
    for entry in tree_obj:
        if entry.filemode == 0o160000:
            # Skip submodules
            continue

        file_entry = {
            'filename': entry.name,
            'id': str(entry.id),
            'size': 0,
            'urls': [],
            'directory': False,
            'annexed': False,
            'symlink': False,
        }

        if entry.filemode == 0o120000:
            target = repo[entry.id].data.decode('utf-8').rstrip()
            key = target.split('/')[-1]
            if re.match(annex_key_re, key):
                # Annexed file symlink
                file_entry['id'] = key
                file_entry['size'] = int(key.split('-', 2)[1].lstrip('s'))
                file_entry['annexed'] = True
            else:
                # In-tree symlink
                dataset_abs = os.path.abspath(dataset_path)
                target_abs = os.path.abspath(os.path.join(dataset_abs, target))
                # Validate target stays within the dataset
                if os.path.commonpath((dataset_abs, target_abs)) != dataset_abs:
                    continue
                # Disallow .git symlinks except for annex objects
                if '.git' in posixpath.normpath(target).split('/'):
                    continue
                file_entry['symlink'] = True
        elif entry.type == pygit2.GIT_OBJECT_TREE:
            file_entry['directory'] = True
        else:
            # Regular blob
            file_entry['size'] = repo[entry.id].size

        files.append(file_entry)

    return files


async def get_repo_files(dataset_path, trees):
    """Read files for multiple trees using pygit2 with shared URL resolution."""
    repo = pygit2.Repository(dataset_path)
    per_tree_files = {}

    for tree_hash in trees:
        try:
            obj = repo.revparse_single(tree_hash)
            # If this is a commit, peel to its tree
            if obj.type == pygit2.GIT_OBJECT_COMMIT:
                obj = obj.peel(pygit2.Tree)
            if obj is None or obj.type != pygit2.GIT_OBJECT_TREE:
                per_tree_files[tree_hash] = []
                continue
            per_tree_files[tree_hash] = _read_tree_pygit2(repo, obj, dataset_path)
        except (KeyError, ValueError):
            per_tree_files[tree_hash] = []

    # Resolve URLs for all files across all trees in one pass
    all_files = []
    for files in per_tree_files.values():
        all_files.extend(files)
    all_files = get_repo_urls(repo, all_files)

    # Redistribute files back to per-tree results
    offset = 0
    tree_results = {}
    for tree_hash in trees:
        count = len(per_tree_files[tree_hash])
        tree_results[tree_hash] = all_files[offset : offset + count]
        offset += count

    return tree_results


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
            # Normalize only CRLF to LF before comparison
            if expected_content.replace('\r\n', '\n') != annexed_file_contents.replace(
                '\r\n', '\n'
            ):
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
            for line in rmet.splitlines():
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
