import pygit2
from datalad_service.common.git import git_tag


def test_git_tag(new_dataset):
    repo = pygit2.Repository(new_dataset.path)
    author = pygit2.Signature('Tagger', 'test@example.com')
    commit = repo.revparse_single('HEAD')
    repo.create_tag(
        '1.0.0', str(commit.id), pygit2.enums.ObjectType.COMMIT, author, 'test tag'
    )
    assert git_tag(repo)[0].name == 'refs/tags/1.0.0'
