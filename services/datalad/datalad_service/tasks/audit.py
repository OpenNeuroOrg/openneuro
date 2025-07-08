import json
import os
import subprocess
import random
import pygit2


def audit_datasets(store):
    dataset_dirs = os.listdir(store.annex_path)
    dataset = random.choice(dataset_dirs)
    audit_remotes(store, dataset)


def fsck_remote(dataset_path, remote):
    """Run fsck for one dataset remote"""
    # Run at most once per month per dataset
    annex_command = (
        'git-annex',
        'fsck',
        '--all',
        f'--from={remote}',
        '--fast',
        '--json',
        '--json-error-messages',
        '--incremental',
        '--incremental-schedule=30d',
        '--time-limit=15m',
    )
    annex_process = subprocess.Popen(
        annex_command, cwd=dataset_path, stdout=subprocess.PIPE, encoding='utf-8'
    )
    bad_files = []
    for annexed_file_json in annex_process.stdout:
        annexed_file = json.loads(annexed_file_json)
        if not annexed_file.success:
            # Oops, log it!
            bad_files.append(annexed_file)
    # TODO - Add an admin notification when this is reactivated


def audit_remotes(store, dataset):
    """
    Iterate over all defined S3 special remotes and run git-annex fsck.

    This is memoized by the git-annex incremental option to reduce duplicate calls.

    Audits run on the publish worker for now. This introduces some delay publishing
    but prevents deadlocks of the main dataset workers.
    """
    dataset_path = store.get_dataset_path(dataset)
    repo = pygit2.Repository(dataset_path)
    for sib in repo.remotes:
        # Only check S3 remotes for now
        if sib.name.startswith('s3-'):
            fsck_remote(dataset_path, sib['name'])
