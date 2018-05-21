from enum import Enum

import datalad_service.config


class S3ConfigException(Exception):
    pass


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


def setup_s3_sibling(dataset, realm):
    """Add a sibling for an S3 bucket publish."""
    # TODO - There may be a better way to do this?
    dataset.repo._run_annex_command(
        'initremote',
        annex_options=[
            realm.s3_remote,
            'type=S3',
            'bucket={}'.format(realm.s3_bucket),
            'exporttree=yes',
            'partsize=1GiB',
            'encryption=none'
        ])


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
