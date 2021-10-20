import pygit2
from datalad_service.common.git import git_tag

from .dataset_fixtures import *


def test_git_tag(new_dataset):
    repo = pygit2.Repository(new_dataset.path)
    author = pygit2.Signature('Tagger', 'test@example.com')
    commit = repo.revparse_single('HEAD')
    repo.create_tag('1.0.0', commit.oid.hex,
                    pygit2.GIT_OBJ_COMMIT, author, 'test tag')
    assert git_tag(repo)[0].name == 'refs/tags/1.0.0'
