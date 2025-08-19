import os
from datetime import datetime
import re

import pygit2

from datalad_service.common.annex import edit_annexed_file
from datalad_service.common.git import git_show, git_show_content, git_tag
from datalad_service.tasks.dataset import create_datalad_config
from datalad_service.tasks.description import update_description
from datalad_service.tasks.files import commit_files
from datalad_service.common.onchange import on_tag


class SnapshotExistsException(Exception):
    """Snapshot conflicts with existing name."""

    pass


def get_snapshot(store, dataset, snapshot):
    # Get metadata for a snapshot (hexsha)
    repo = pygit2.Repository(store.get_dataset_path(dataset))
    commit, _ = repo.resolve_refish(snapshot)
    hexsha = str(commit.id)
    created = commit.commit_time
    tree = str(commit.tree_id)
    return {
        'id': f'{dataset}:{snapshot}',
        'tag': snapshot,
        'hexsha': hexsha,
        'created': created,
        'tree': tree,
    }


def get_snapshots(store, dataset):
    path = store.get_dataset_path(dataset)
    repo_tags = git_tag(pygit2.Repository(path))
    # Include an extra id field to uniquely identify snapshots
    tags = [
        {
            'id': f'{dataset}:{tag.shorthand}',
            'tag': tag.shorthand,
            'hexsha': str(tag.target),
            'created': tag.peel().commit_time,
        }
        for tag in repo_tags
    ]
    return tags


cpan_version_prog = re.compile(r'^(\S+) (\d{4}-\d{2}-\d{2})$')


def find_version(changelog_lines, tag):
    # extract the lines for the version being updated, if already in changelog
    found_version_start = False
    for i, line in enumerate(changelog_lines):
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
        *list(map(lambda change: f'  - {change}', new_changes)),
    ]
    changelog_lines = changes.rstrip().splitlines()
    (start, end) = find_version(changelog_lines, tag)
    if start is None:
        # add new version
        changelog_lines = [*formatted_new_changes, *changelog_lines]
    else:
        # update existing version
        changelog_lines = [
            *changelog_lines[:start],
            *formatted_new_changes,
            *changelog_lines[end:],
        ]
    return '\n'.join(changelog_lines) + '\n'


async def get_head_changes(dataset_path):
    try:
        repo = pygit2.Repository(dataset_path)
        changes_stream, size = await git_show_content(repo, 'HEAD', 'CHANGES')
        if changes_stream:
            changes_bytes_list = []
            async for chunk in changes_stream:
                changes_bytes_list.append(chunk)
            return b''.join(changes_bytes_list).decode()
    except KeyError:
        return ''


async def write_new_changes(dataset_path, tag, new_changes, date):
    changes = await get_head_changes(dataset_path)
    updated = edit_changes(changes, new_changes, tag, date)
    path = os.path.join(dataset_path, 'CHANGES')
    await edit_annexed_file(path, changes, updated)
    return updated


async def update_changes(store, dataset, tag, new_changes):
    dataset_path = store.get_dataset_path(dataset)
    if new_changes is not None and len(new_changes) > 0:
        current_date = datetime.today().strftime('%Y-%m-%d')
        updated = await write_new_changes(dataset_path, tag, new_changes, current_date)
        # Commit new content, run validator
        await commit_files(store, dataset, ['CHANGES'])
        return updated
    else:
        return await get_head_changes(dataset_path)


def validate_snapshot_name(store, dataset, snapshot):
    tags = git_tag(pygit2.Repository(store.get_dataset_path(dataset)))
    # Search for any existing tags
    tagged = [tag for tag in tags if tag.name == snapshot]
    if tagged:
        raise SnapshotExistsException(f'Tag "{snapshot}" already exists, name conflict')


async def validate_datalad_config(store, dataset):
    """Add a .datalad/config file if one does not exist."""
    dataset_path = store.get_dataset_path(dataset)
    repo = store.get_dataset_repo(dataset)
    try:
        git_show(repo, 'HEAD', '.datalad/config')
    except KeyError:
        create_datalad_config(dataset_path)
        await commit_files(store, dataset, ['.datalad/config'])


async def save_snapshot(store, dataset, snapshot):
    ds_path = store.get_dataset_path(dataset)
    repo = pygit2.Repository(ds_path)
    repo.references.create(f'refs/tags/{snapshot}', str(repo.head.target))
    await on_tag(ds_path, snapshot)


async def create_snapshot(
    store, dataset, snapshot, description_fields, snapshot_changes
):
    """
    Create a new snapshot (git tag).

    Raises an exception if the tag already exists.
    """
    validate_snapshot_name(store, dataset, snapshot)
    await validate_datalad_config(store, dataset)
    await update_description(store, dataset, description_fields)
    await update_changes(store, dataset, snapshot, snapshot_changes)
    await save_snapshot(store, dataset, snapshot)
    return get_snapshot(store, dataset, snapshot)
