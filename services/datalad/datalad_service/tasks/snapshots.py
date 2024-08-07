import os
from datetime import datetime
import re

import pygit2

from datalad_service.common.git import git_show, git_tag
from datalad_service.tasks.dataset import create_datalad_config
from datalad_service.tasks.description import update_description
from datalad_service.tasks.files import commit_files


class SnapshotExistsException(Exception):
    """Snapshot conflicts with existing name."""
    pass


class SnapshotDescriptionException(Exception):
    """An error processing the snapshot description"""
    pass


def get_snapshot(store, dataset, snapshot):
    # Get metadata for a snapshot (hexsha)
    repo = pygit2.Repository(store.get_dataset_path(dataset))
    commit, _ = repo.resolve_refish(snapshot)
    hexsha = str(commit.id)
    created = commit.commit_time
    tree = str(commit.tree_id)
    return {'id': f'{dataset}:{snapshot}', 'tag': snapshot, 'hexsha': hexsha, 'created': created, 'tree': tree}


def get_snapshots(store, dataset):
    path = store.get_dataset_path(dataset)
    repo_tags = git_tag(pygit2.Repository(path))
    # Include an extra id field to uniquely identify snapshots
    tags = [{'id': f'{dataset}:{tag.shorthand}', 'tag': tag.shorthand, 'hexsha': str(tag.target), 'created': tag.peel().commit_time}
            for tag in repo_tags]
    return tags


cpan_version_prog = re.compile(r'^(\S+) (\d{4}-\d{2}-\d{2})$')


def find_version(changelog_lines, tag):
    # extract the lines for the version being updated, if already in changelog
    found_version_start = False
    for (i, line) in enumerate(changelog_lines):
        # check for version heading lines eg. "x.x.x yyyy-mm-dd"
        if cpan_version_prog.match(line):
            if line.startswith(tag):
                found_version_start = True
                start = i
            elif found_version_start:
                end = i
                return (start, end)
    if found_version_start:
        # for end of file
        end = len(changelog_lines)
        return (start, end)
    # version does not already exist
    return (None, None)


def edit_changes(changes, new_changes, tag, date):
    formatted_new_changes = [
        f'{tag} {date}',
        *list(map(lambda change: f'  - {change}', new_changes))
    ]
    changelog_lines = changes.rstrip().splitlines()
    (start, end) = find_version(changelog_lines, tag)
    if start is None:
        # add new version
        changelog_lines = [
            *formatted_new_changes,
            *changelog_lines
        ]
    else:
        # update existing version
        changelog_lines = [
            *changelog_lines[:start],
            *formatted_new_changes,
            *changelog_lines[end:]
        ]
    return '\n'.join(changelog_lines) + '\n'


def get_head_changes(dataset_path):
    try:
        return git_show(dataset_path, 'HEAD', 'CHANGES')
    except KeyError:
        return None


def write_new_changes(dataset_path, tag, new_changes, date):
    changes = get_head_changes(dataset_path)
    # Prevent adding the git error if the file does not exist in HEAD
    if not changes:
        changes = ''
    updated = edit_changes(changes, new_changes, tag, date)
    path = os.path.join(dataset_path, 'CHANGES')
    with open(path, 'a+', encoding='utf-8') as changes_file:
        # Seek first, this is r+ but creates the file if needed
        changes_file.seek(0)
        changes_file_contents = changes_file.read()
        if changes.strip() != changes_file_contents.strip():
            raise SnapshotDescriptionException('unexpected CHANGES content')
        # Now that we have the file, overwrite it with the new one
        changes_file.seek(0)
        changes_file.truncate(0)
        changes_file.write(updated)
    return updated


def update_changes(store, dataset, tag, new_changes):
    dataset_path = store.get_dataset_path(dataset)
    if new_changes is not None and len(new_changes) > 0:
        current_date = datetime.today().strftime('%Y-%m-%d')
        updated = write_new_changes(
            dataset_path, tag, new_changes, current_date)
        # Commit new content, run validator
        commit_files(store, dataset, ['CHANGES'])
        return updated
    else:
        return get_head_changes(dataset_path)


def validate_snapshot_name(store, dataset, snapshot):
    tags = git_tag(pygit2.Repository(store.get_dataset_path(dataset)))
    # Search for any existing tags
    tagged = [tag for tag in tags if tag.name == snapshot]
    if tagged:
        raise SnapshotExistsException(
            f'Tag "{snapshot}" already exists, name conflict')


def validate_datalad_config(store, dataset):
    """Add a .datalad/config file if one does not exist."""
    dataset_path = store.get_dataset_path(dataset)
    try:
        git_show(dataset_path, 'HEAD', '.datalad/config')
    except KeyError:
        create_datalad_config(dataset_path)
        commit_files(store, dataset, ['.datalad/config'])


def save_snapshot(store, dataset, snapshot):
    repo = pygit2.Repository(store.get_dataset_path(dataset))
    repo.references.create(f'refs/tags/{snapshot}', str(repo.head.target))


def create_snapshot(store, dataset, snapshot, description_fields, snapshot_changes):
    """
    Create a new snapshot (git tag).

    Raises an exception if the tag already exists.
    """
    validate_snapshot_name(store, dataset, snapshot)
    validate_datalad_config(store, dataset)
    update_description(store, dataset, description_fields)
    update_changes(store, dataset, snapshot, snapshot_changes)
    save_snapshot(store, dataset, snapshot)
    return get_snapshot(store, dataset, snapshot)
