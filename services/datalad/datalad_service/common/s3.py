import os
import subprocess

import datalad_service.config


class S3ConfigException(Exception):
    pass


def get_s3_remote():
    return 's3-PUBLIC'


def get_s3_backup_remote():
    return 's3-BACKUP'


def get_s3_bucket():
    return getattr(datalad_service.config, 'AWS_S3_PUBLIC_BUCKET')


def get_s3_backup_bucket():
    return getattr(datalad_service.config, 'GCP_S3_BACKUP_BUCKET')


def generate_s3_annex_options(dataset_path, backup=False):
    dataset_id = os.path.basename(dataset_path)
    annex_options = [
        'type=S3',
        'partsize=1GiB',
        'encryption=none',
        f'fileprefix={dataset_id}/',
        'public=no',
    ]
    if backup:
        annex_options += [
            f'bucket={get_s3_backup_bucket()}',
            'cost=400',
            'host=storage.googleapis.com',
            'storageclass=ARCHIVE',
        ]
    else:
        annex_options += [
            'exporttree=yes',
            'versioning=yes',
            f'bucket={get_s3_bucket()}',
            'autoenable=true',
            f'publicurl=https://s3.amazonaws.com/{get_s3_bucket()}',
        ]
    return annex_options


def backup_remote_env():
    """Copy and modify the environment for setup/modification of backup remote settings."""
    backup_remote_env = os.environ.copy()
    # Overwrite the AWS keys with the GCP key
    backup_remote_env['AWS_ACCESS_KEY_ID'] = backup_remote_env['GCP_ACCESS_KEY_ID']
    backup_remote_env['AWS_SECRET_ACCESS_KEY'] = backup_remote_env[
        'GCP_SECRET_ACCESS_KEY'
    ]
    return backup_remote_env


def setup_s3_sibling(dataset_path):
    """Add a sibling for an S3 bucket publish."""
    # Public remote
    subprocess.run(
        ['git-annex', 'initremote', get_s3_remote()]
        + generate_s3_annex_options(dataset_path),
        cwd=dataset_path,
    )
    # Backup remote
    subprocess.run(
        ['git-annex', 'initremote', get_s3_backup_remote()]
        + generate_s3_annex_options(dataset_path, backup=True),
        cwd=dataset_path,
        env=backup_remote_env(),
    )


def update_s3_sibling(dataset_path):
    """Update S3 remote with latest config."""
    # note: enableremote command will only upsert config options, none are deleted
    subprocess.run(
        ['git-annex', 'enableremote', get_s3_remote()]
        + generate_s3_annex_options(dataset_path),
        check=True,
        cwd=dataset_path,
    )
    subprocess.run(
        ['git-annex', 'enableremote', get_s3_backup_remote()]
        + generate_s3_annex_options(dataset_path, backup=True),
        check=True,
        cwd=dataset_path,
        env=backup_remote_env(),
    )


def validate_s3_config(dataset_path):
    """Checks that s3-PUBLIC annex-options match those set in setup_s3_siblings"""
    # get annex options for s3 bucket
    try:
        remote_log = subprocess.run(
            ['git', 'cat-file', '-p', 'git-annex:remote.log'],
            cwd=dataset_path,
            capture_output=True,
            check=True,
            encoding='utf-8',
        )
    except subprocess.CalledProcessError as err:
        if err.returncode == 128:
            # git-annex:remote.log is most likely not created yet, skip validation
            return True
        else:
            raise
    options_line = ''
    for line in remote_log.stdout.split('\n'):
        if f'name={get_s3_remote()}' in line:
            options_line = line
    if options_line:
        # check that each of the expected annex options is what's actually configured
        expected_options = generate_s3_annex_options(dataset_path)
        for expected_option in expected_options:
            if not expected_option in options_line:
                return False
    return True


def s3_export(dataset_path, target, treeish):
    """Perform an S3 export on a git-annex repo."""
    subprocess.check_call(
        ['git-annex', 'export', treeish, '--to', target], cwd=dataset_path
    )


def s3_backup_push(dataset_path):
    """Perform an S3 push to the backup remote on a git-annex repo."""
    print(backup_remote_env())
    subprocess.check_call(
        ['git-annex', 'push', get_s3_backup_remote()],
        cwd=dataset_path,
        env=backup_remote_env(),
    )
