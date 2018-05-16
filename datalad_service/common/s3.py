from enum import Enum

import datalad_service.config


class S3ConfigException(Exception):
    pass


class S3Realms(Enum):
    PRIVATE = 1
    PUBLIC = 2

    @property
    def remote_name(self):
        return 's3-{}'.format(self.name)

    @property
    def url(self):
        bucket = getattr(datalad_service.config,
                         'AWS_S3_{realm}_BUCKET'.format(realm=self.name))
        if not bucket:
            raise S3ConfigException('S3 bucket configuration is missing.')
        return 's3://{}'.format(bucket)


def setup_s3_sibling(dataset, variant):
    """Add a sibling for an S3 bucket publish."""
    dataset.siblings(action='add', name=variant.remote_name,
                     url=variant.url, pushurl=variant.url)
