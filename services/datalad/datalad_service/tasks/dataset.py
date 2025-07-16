"""
Dataset global tasks

Any operations that affect an entire dataset (such as creating snapshots)
"""

import asyncio
import os
import stat
import uuid

import pygit2

from datalad_service.common.annex import init_annex
from datalad_service.common.git import git_commit, COMMITTER_EMAIL, COMMITTER_NAME

# A list of patterns to avoid annexing in BIDS datasets
GIT_ATTRIBUTES = """* annex.backend=SHA256E
**/.git* annex.largefiles=nothing
*.bval annex.largefiles=nothing
*.bvec annex.largefiles=nothing
*.json text eol=lf annex.largefiles=largerthan=1mb
*.tsv text eol=lf annex.largefiles=largerthan=1mb
phenotype/*.tsv annex.largefiles=anything
dataset_description.json annex.largefiles=nothing
datacite.yml annex.largefiles=nothing
datacite.yaml annex.largefiles=nothing
.bidsignore annex.largefiles=nothing
CHANGES text eol=lf annex.largefiles=nothing
README* text eol=lf annex.largefiles=nothing
LICENSE* text eol=lf annex.largefiles=nothing
CITATION.cff text eol=lf annex.largefiles=nothing
"""

DATALAD_CONFIG = """[datalad "dataset"]
	id = {}
"""


def create_datalad_config(dataset_path):
    config = DATALAD_CONFIG.format(str(uuid.uuid4()))
    os.makedirs(os.path.join(dataset_path, '.datalad'), exist_ok=True)
    with open(os.path.join(dataset_path, '.datalad/config'), 'w') as configfile:
        configfile.write(config)


def create_dataset(store, dataset, author=None, initial_head='main'):
    """Create a DataLad git-annex repo for a new dataset.

    initial_head is only meant for tests and is overridden by the implementation of git_commit
    """
    dataset_path = store.get_dataset_path(dataset)
    if os.path.isdir(dataset_path):
        raise Exception('Dataset already exists')
    if not author:
        author = pygit2.Signature(COMMITTER_NAME, COMMITTER_EMAIL)
    repo = pygit2.init_repository(dataset_path, False, initial_head=initial_head)
    init_annex(dataset_path)
    # Setup .gitattributes to limit what files are annexed by default
    with open(os.path.join(dataset_path, '.gitattributes'), 'w') as gitattributes:
        gitattributes.write(GIT_ATTRIBUTES)
    repo.index.add('.gitattributes')
    # Set a datalad UUID
    create_datalad_config(dataset_path)
    repo.index.add('.datalad/config')
    git_commit(
        repo,
        ['.gitattributes', '.datalad/config'],
        author,
        '[OpenNeuro] Dataset created',
        parents=[],
    )
    return str(repo.head.target)


async def force_rmtree(root_dir):
    """Delete a git tree no matter what. Be CAREFUL calling this!"""
    for root, dirs, files in os.walk(root_dir, topdown=False):
        for name in files:
            file_path = os.path.join(root, name)
            if os.path.isfile(file_path):
                os.chmod(file_path, stat.S_IWUSR | stat.S_IRUSR)
                os.chmod(root, stat.S_IWUSR | stat.S_IRUSR | stat.S_IXUSR)
                os.remove(file_path)
            elif os.path.islink(file_path):
                os.unlink(file_path)
        await asyncio.sleep(0)
        for name in dirs:
            dir_path = os.path.join(root, name)
            os.chmod(dir_path, stat.S_IWUSR)
            os.rmdir(dir_path)
        await asyncio.sleep(0)
    os.rmdir(root_dir)


async def delete_dataset(dataset_path):
    """Fully delete a given dataset. Removes all snapshots!"""
    await force_rmtree(dataset_path)
