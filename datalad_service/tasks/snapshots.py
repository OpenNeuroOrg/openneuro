import os
from datalad_service.common.celery import dataset_task
from datalad_service.tasks.files import commit_files
from datetime import datetime
import re


@dataset_task
def get_snapshot(store, dataset, snapshot):
    # Get metadata for a snapshot (hexsha)
    ds = store.get_dataset(dataset)
    hexsha = ds.repo.repo.commit(snapshot).hexsha
    return {'id': '{}:{}'.format(dataset, snapshot), 'tag': snapshot, 'hexsha': hexsha}


@dataset_task
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

def edit_changes(changes, new_changes, tag):
    current_date = datetime.today().strftime('%Y-%m-%d')
    formatted_new_changes = [
        f'{tag} {current_date}',
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

@dataset_task
def update_changes(store, dataset, tag, new_changes):
    ds = store.get_dataset(dataset)
    changes = ds.repo.repo.git.show(
        'HEAD:CHANGES')
    if new_changes is not None and len(new_changes) > 0:
        updated = edit_changes(changes, new_changes, tag)
        path = os.path.join(
            store.get_dataset_path(dataset), 
            'CHANGES')
        with open(path, 'r+', encoding='utf-8') as changes_file:
            changes_file_contents = changes_file.read()
            if changes.strip() != changes_file_contents.strip():
                raise Exception('unexpected CHANGES content')
            changes_file.seek(0)
            changes_file.truncate(0)
            changes_file.write(updated)
        # Commit new content, run validator
        commit_files.run(store.annex_path, dataset, ['CHANGES'])
        return updated
    else:
        return changes