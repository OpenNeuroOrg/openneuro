import re
import subprocess

import pygit2
from charset_normalizer import from_bytes

tag_ref = re.compile('^refs/tags/')

COMMITTER_NAME = 'Git Worker'
COMMITTER_EMAIL = 'git@openneuro.org'


class OpenNeuroGitError(Exception):
    """OpenNeuro git repo states that should not arise under normal use but may be a valid git operation in other contexts."""


def git_show(path, committish, obj):
    repo = pygit2.Repository(path)
    commit, _ = repo.resolve_refish(committish)
    data_bytes = (commit.tree / obj).read_raw()
    result = from_bytes(data_bytes).best()
    return str(result)


def git_show_object(path, obj):
    repo = pygit2.Repository(path)
    git_obj = repo.get(obj)
    if git_obj:
        return git_obj.read_raw().decode()
    else:
        raise KeyError('object not found in repository')


def delete_tag(path, tag):
    repo = pygit2.Repository(path)
    repo.references.delete(f'refs/tags/{tag}')


def git_tag(repo):
    return [repo.references[r] for r in repo.references if tag_ref.match(r)]


def git_tag_tree(repo, tag):
    """Return the tree object id for a local tag."""
    tag_reference = repo.references[f'refs/tags/{tag}']
    return repo.get(tag_reference.target).tree_id


def git_rename_master_to_main(repo):
    # Make sure the main branch is used, update if needed
    master_branch = repo.branches.get('master')
    # Only rename master, don't update other branches if set to HEAD
    if master_branch and repo.references['HEAD'].target == 'refs/heads/master':
        main_branch = master_branch.rename('main', True)
        # Abort the commit if this didn't work
        if not main_branch.is_head():
            raise Exception('Unable to rename master branch to main')
        repo.references['HEAD'].set_target('refs/heads/main')


def git_commit(repo, file_paths, author=None, message="[OpenNeuro] Recorded changes", parents=None):
    """Commit array of paths at HEAD."""
    # master -> main if required
    git_rename_master_to_main(repo)
    # Early abort for this commit if HEAD is not main
    if repo.references['HEAD'].target != 'refs/heads/main':
        raise OpenNeuroGitError(
            'HEAD points at invalid branch name ({}) and commit was aborted'.format(repo.references['HEAD'].target))
    # Refresh index with git-annex specific handling
    annex_command = ["git-annex", "add"] + file_paths
    subprocess.run(annex_command, check=True, cwd=repo.workdir)
    repo.index.add_all(file_paths)
    repo.index.write()
    return git_commit_index(repo, author, message, parents)


def git_commit_index(repo, author=None, message="[OpenNeuro] Recorded changes", parents=None):
    """Commit any existing index changes."""
    committer = pygit2.Signature(COMMITTER_NAME, COMMITTER_EMAIL)
    if not author:
        author = committer
    if parents is None:
        parent_commits = [str(repo.head.target)]
    else:
        parent_commits = parents
    tree = repo.index.write_tree()
    commit = repo.create_commit(
        'refs/heads/main', author, committer, message, tree, parent_commits)
    repo.head.set_target(commit)
    return commit
