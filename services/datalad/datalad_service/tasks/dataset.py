"""
Dataset global tasks

Any operations that affect an entire dataset (such as creating snapshots)
"""
import os
import stat

import pygit2

from datalad_service.common.annex import init_annex
from datalad_service.common.git import git_commit, COMMITTER_EMAIL, COMMITTER_NAME

# A list of patterns to avoid annexing in BIDS datasets
GIT_ATTRIBUTES = """* annex.backend=SHA256E
**/.git* annex.largefiles=nothing
*.bval annex.largefiles=nothing
*.bvec annex.largefiles=nothing
*.json annex.largefiles=largerthan=1mb
*.tsv annex.largefiles=largerthan=1mb
dataset_description.json annex.largefiles=nothing
.bidsignore annex.largefiles=nothing
CHANGES annex.largefiles=nothing
README* annex.largefiles=nothing
LICENSE annex.largefiles=nothing
"""


def create_dataset(store, dataset, author=None):
    """Create a DataLad git-annex repo for a new dataset."""
    dataset_path = store.get_dataset_path(dataset)
    if os.path.isdir(dataset_path):
        raise Exception('Dataset already exists')
    if not author:
        author = pygit2.Signature(COMMITTER_NAME, COMMITTER_EMAIL)
    repo = pygit2.init_repository(dataset_path, False)
    init_annex(dataset_path)
    # Setup .gitattributes to limit what files are annexed by default
    with open(os.path.join(dataset_path, '.gitattributes'), 'w') as gitattributes:
        gitattributes.write(GIT_ATTRIBUTES)
    repo.index.add('.gitattributes')
    git_commit(repo, ['.gitattributes'], author,
               '[OpenNeuro] Dataset created', parents=[])
    return repo.head.target.hex


def force_rmtree(root_dir):
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
        for name in dirs:
            dir_path = os.path.join(root, name)
            os.chmod(dir_path, stat.S_IWUSR)
            os.rmdir(dir_path)
    os.rmdir(root_dir)


def delete_dataset(dataset_path):
    """Fully delete a given dataset. Removes all snapshots!"""
    force_rmtree(dataset_path)
