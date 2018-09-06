import os
from enum import Enum
import boto3

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


def setup_s3_sibling(dataset, realm):
    """Add a sibling for an S3 bucket publish."""
    dataset_id = os.path.basename(dataset.path)

    if (realm == DatasetRealm.PUBLIC):
        public = getattr(datalad_service.config, 'DATALAD_S3_PUBLIC_ON_EXPORT')
    else:
        public = 'no'

    # TODO - There may be a better way to do this?
    dataset.repo._run_annex_command(
        'initremote',
        annex_options=[
            realm.s3_remote,
            'type=S3',
            'bucket={}'.format(realm.s3_bucket),
            'exporttree=yes',
            'partsize=1GiB',
            'encryption=none',
            'fileprefix={}/'.format(dataset_id),
            'public={}'.format(public),
            'publicurl={}'.format(public),
            'autoenable=true'
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


def s3_versions(dataset, bucket_name, snapshot='HEAD'):
    dataset_id = os.path.basename(dataset.path)

    # get s3 bucket
    s3 = boto3.resource('s3')
    bucket = s3.Bucket(bucket_name)

    # crawl the list of objects in the s3 bucket with
    # the prefix associated with this dataset
    versions = [] 
    try:
        objects = bucket.objects
        
        url = 'https://s3.amazonaws.com/{}/{}?versionId={}'
        rel = '/crn/datasets/{}/snapshots/{}/files/{}'
        for obj in objects.filter(Prefix='{}'.format(dataset_id)):
            key = obj.key
            filename = key.split(dataset_id + '/')[-1]
            o = s3.Object(bucket_name, key)
            version = o.version_id
            versions.append({
                'filename': key.split(dataset_id + '/')[-1],
                'urls': [url.format(bucket_name, key, version), rel.format(dataset_id, snapshot, filename.replace('/', ':'))]
            })
    finally:
        return versions

