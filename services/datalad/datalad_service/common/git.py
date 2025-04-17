import pathlib
import re
import subprocess
import logging
import sentry_sdk

import pygit2
from charset_normalizer import from_bytes

tag_ref = re.compile('^refs/tags/')

COMMITTER_NAME = 'Git Worker'
COMMITTER_EMAIL = 'git@openneuro.org'

logger = logging.getLogger(__name__)

class OpenNeuroGitError(Exception):
    """OpenNeuro git repo states that should not arise under normal use but may be a valid git operation in other contexts."""


def git_show(repo, committish, obj):
    """Equivalent to `git show <committish>:<obj>` on `repo` repository."""
    commit, _ = repo.resolve_refish(committish)
    data_bytes = (commit.tree / obj).read_raw()
    result = from_bytes(data_bytes).best()
    return str(result)


def git_show_object(repo, obj):
    git_obj = repo.get(obj)
    if git_obj:
        return git_obj.read_raw().decode()
    else:
        raise KeyError('object not found in repository')


def git_tree(repo, committish, filepath):
    """Retrieve the tree parent for a given commit and filename."""
    path = pathlib.Path(filepath)
    commit, _ = repo.resolve_refish(committish)
    tree = commit.tree
    for part in path.parts[:-1]:
        tree = tree / part
    return tree


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
    try:
        subprocess.run(annex_command, check=True, capture_output=True, cwd=repo.workdir)
    except subprocess.CalledProcessError as e:
        sentry_sdk.capture_exception(e)
        logger.error(f"Error running git-annex add for paths {file_paths}: {e}")
        logger.error(f"Stderr: {e.stderr}")
        logger.error(f"Stdout: {e.stdout}")
        raise OpenNeuroGitError(f"git-annex add failed: {e.stderr}") from e
    # git-annex add updates the index, make sure we reload it
    try:
        repo.index.read(force=True)
        logger.debug("Reloaded index after git-annex add.")
    except Exception as e:
        sentry_sdk.capture_exception(e)
        logger.error(f"Failed to read index after git-annex add: {e}")
        raise OpenNeuroGitError(f"Failed to read index: {e}") from e
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
