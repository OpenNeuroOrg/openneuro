import os
from datalad_service.tasks.files import commit_files
from datetime import datetime
import re
from subprocess import CalledProcessError

from datalad_service.common.git import git_show


def get_snapshot(store, dataset, snapshot):
    # Get metadata for a snapshot (hexsha)
    ds = store.get_dataset(dataset)
    hexsha = ds.repo.get_hexsha(commitish=snapshot)
    return {'id': '{}:{}'.format(dataset, snapshot), 'tag': snapshot, 'hexsha': hexsha}


def get_snapshots(store, dataset):
    ds = store.get_dataset(dataset)
    repo_tags = ds.repo.get_tags()
    # Include an extra id field to uniquely identify snapshots
    tags = [{'id': '{}:{}'.format(dataset, tag['name']), 'tag': tag['name'], 'hexsha': tag['hexsha']}
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


def get_head_changes(ds):
    try:
        return git_show(ds.path, 'HEAD:CHANGES')
    except CalledProcessError:
        return None


def write_new_changes(ds, tag, new_changes, date):
    changes = get_head_changes(ds)
    # Prevent adding the git error if the file does not exist in HEAD
    if not changes:
        changes = ''
    updated = edit_changes(changes, new_changes, tag, date)
    path = os.path.join(ds.path, 'CHANGES')
    with open(path, 'a+', encoding='utf-8') as changes_file:
        # Seek first, this is r+ but creates the file if needed
        changes_file.seek(0)
        changes_file_contents = changes_file.read()
        if changes.strip() != changes_file_contents.strip():
            raise Exception('unexpected CHANGES content')
        # Now that we have the file, overwrite it with the new one
        changes_file.seek(0)
        changes_file.truncate(0)
        changes_file.write(updated)
    return updated


def update_changes(store, dataset, tag, new_changes):
    ds = store.get_dataset(dataset)
    if new_changes is not None and len(new_changes) > 0:
        current_date = datetime.today().strftime('%Y-%m-%d')
        updated = write_new_changes(ds, tag, new_changes, current_date)
        # Commit new content, run validator
        commit_files(store, dataset, ['CHANGES'])
        return updated
    else:
        return get_head_changes(ds)
