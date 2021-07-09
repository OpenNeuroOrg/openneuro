import re

import pygit2

tag_ref = re.compile('^refs/tags/')


def git_show(path, commitish, obj):
    repo = pygit2.Repository(path)
    commit, _ = repo.resolve_refish(commitish)
    data = (commit.tree / obj).read_raw().decode()
    return data


def delete_tag(path, tag):
    repo = pygit2.Repository(path)
    repo.references.delete(f'refs/tags/{tag}')


def git_tag(path):
    repo = pygit2.Repository(path)
    return [repo.references[r] for r in repo.references if tag_ref.match(r)]
