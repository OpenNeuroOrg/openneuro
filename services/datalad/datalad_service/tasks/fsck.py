import json
import io
import logging
import subprocess

import pygit2

from datalad_service.broker import broker
from datalad_service.common.openneuro import update_file_check


def get_head_commit_and_references(repo):
    """
    Returns the current HEAD commit and any references (tags) pointing to it.
    """
    head_commit = repo[repo.head.target]
    references = []
    for ref in repo.references:
        if (
            ref.startswith('refs/tags/')
            and repo.lookup_reference(ref).target == head_commit.id
        ):
            references.append(ref)
    return head_commit, references


@broker.task
def git_annex_fsck_local(dataset_path):
    """Run git-annex fsck for local annexed objects in the draft. Runs on commits, verifies checksums."""
    try:
        commit, references = get_head_commit_and_references(
            pygit2.Repository(dataset_path)
        )
    except pygit2.GitError:
        logging.error(f'Could not open git repository for {dataset_path}')
        return
    annex_command = (
        'git-annex',
        'fsck',
        '--json',
        '--json-error-messages',
        '--incremental-schedule',
        '7d',
    )
    annex_process = subprocess.Popen(
        annex_command, cwd=dataset_path, stdout=subprocess.PIPE
    )
    bad_files = []
    for annexed_file_json in io.TextIOWrapper(annex_process.stdout, encoding='utf-8'):
        annexed_file = json.loads(annexed_file_json)
        if not annexed_file['success']:
            bad_files.append(annexed_file)
    if len(bad_files) > 0:
        logging.error(f'missing or corrupt annexed objects found in {dataset_path}')
    update_file_check(dataset_path, commit, references, bad_files)


@broker.task
def git_annex_fsck_remote(dataset_path, branch=None, remote='s3-PUBLIC'):
    """Run incremental fsck for one branch (tag) and remote."""
    try:
        repo = pygit2.Repository(dataset_path)
        commit, references = get_head_commit_and_references(repo)
    except pygit2.GitError:
        logging.error(f'Could not open git repository for {dataset_path}')
        return
    if not branch:
        # Find the newest tag chronologically
        all_tags = sorted(
            [tag for tag in repo.references if tag.startswith('refs/tags/')],
            key=lambda tag: repo.lookup_reference(tag).target.commit_time,
            reverse=True,
        )
        if all_tags:
            branch = all_tags[0]
        else:
            logging.info(
                f'No tags found for dataset: {dataset_path}. Skipping remote fsck.'
            )
            return

    # Run at most once per month per dataset
    annex_command = (
        'git-annex',
        'fsck',
        f'--branch={branch}',
        '--from={remote}',
        '--fast',
        '--json',
        '--json-error-messages',
        '--incremental-schedule=7d',
    )
    annex_process = subprocess.Popen(
        annex_command, cwd=dataset_path, stdout=subprocess.PIPE
    )
    bad_files = []
    for annexed_file_json in io.TextIOWrapper(annex_process.stdout, encoding='utf-8'):
        annexed_file = json.loads(annexed_file_json)
        if not annexed_file['success']:
            bad_files.append(annexed_file)
    if len(bad_files) > 0:
        logging.error(
            f'{dataset_path} remote {remote} has missing or corrupt annexed objects'
        )
    update_file_check(dataset_path, commit, references, bad_files, remote)
