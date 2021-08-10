import os
from enum import Enum
import subprocess

import datalad_service.config


class S3ConfigException(Exception):
    pass


def get_s3_realm(realm):
    if realm == 'PUBLIC':
        realm = DatasetRealm.PUBLIC
    else:
        realm = DatasetRealm.PRIVATE
    return realm


class DatasetRealm(Enum):
    PRIVATE = 1
    PUBLIC = 2

    @property
    def github_remote(self):
        # This could be extended for private git repos eventually
        return 'github'

    @property
    def s3_remote(self):
        return 's3-{}'.format(self.name)

    @property
    def s3_bucket(self):
        return getattr(datalad_service.config,
                       'AWS_S3_{realm}_BUCKET'.format(realm=self.name))

    @property
    def s3_url(self):
        bucket = self.s3_bucket
        if not bucket:
            raise S3ConfigException('S3 bucket configuration is missing.')
        return 's3://{bucket}'.format(bucket=bucket)


def generate_s3_annex_options(dataset_path, realm):
    dataset_id = os.path.basename(dataset_path)
    annex_options = [
        'type=S3',
        'bucket={}'.format(realm.s3_bucket),
        'exporttree=yes',
        'versioning=yes',
        'partsize=1GiB',
        'encryption=none',
        'fileprefix={}/'.format(dataset_id),
    ]
    if realm == DatasetRealm.PUBLIC:
        public = getattr(datalad_service.config, 'DATALAD_S3_PUBLIC_ON_EXPORT')
        if public == 'yes':
            annex_options += [
                'autoenable=true',
                'publicurl=https://s3.amazonaws.com/{}'.format(

                    realm.s3_bucket),
            ]
    else:
        annex_options += [
            'autoenable=false',
        ]
        public = 'no'
    annex_options.append('public={}'.format(public))
    return annex_options


def setup_s3_sibling(dataset_path, realm):
    """Add a sibling for an S3 bucket publish."""
    annex_options = generate_s3_annex_options(dataset_path, realm)
    subprocess.run(['git-annex', 'initremote', realm.s3_remote] +
                   annex_options, check=True, cwd=dataset_path)


def update_s3_sibling(dataset_path, realm):
    """Update S3 remote with latest config."""
    annex_options = generate_s3_annex_options(dataset_path, realm)
    # note: enableremote command will only upsert config options, none are deleted
    subprocess.run(['git-annex', 'enableremote', realm.s3_remote] +
                   annex_options, check=True, cwd=dataset_path)


def validate_s3_config(dataset_path, realm):
    """Checks that s3-PUBLIC annex-options match those set in setup_s3_siblings"""
    # get annex options for s3 bucket
    remote_log = subprocess.run(['git', 'cat-file', '-p', 'git-annex:remote.log'],
                               cwd=dataset_path, capture_output=True, check=True)
    options_line = ''
    for line in remote_log.stdout:
        if f'name={realm.s3_remote}' in line:
            options_line = line
    # check that each of the expected annex options is what's actually configured
    expected_options = generate_s3_annex_options(dataset_path, realm)
    for expected_option in expected_options:
        if not expected_option in options_line:
            return False
    return True


def s3_export(dataset, target, treeish='HEAD'):
    """Perform an S3 export on a git-annex repo."""
    dataset.repo._run_annex_command(
        'export',
        annex_options=[
            treeish,
            '--to',
            '{}'.format(target),
        ]
    )
