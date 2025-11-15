import boto3
from botocore.client import Config

import datalad_service.config

boto3_session = None
boto3_s3_client = None


def get_s3_client():
    """Setup a reusable boto3 session and S3 client."""
    global boto3_session
    if not boto3_session:
        aws_access_key_id = getattr(datalad_service.config, 'AWS_ACCESS_KEY_ID')
        aws_secret_access_key = getattr(datalad_service.config, 'AWS_SECRET_ACCESS_KEY')
        boto3_session = boto3.session.Session(aws_access_key_id, aws_secret_access_key)
    global boto3_s3_client
    if not boto3_s3_client:
        boto3_config = Config(s3={'addressing_style': 'path'})
        boto3_s3_client = boto3_session.client('s3', config=boto3_config)
    return boto3_s3_client


def presign_remote_url(key, version, expiration=604800):
    """Presign URLs for the public bucket on S3."""
    bucket = get_s3_bucket()
    s3_client = get_s3_client()
    return s3_client.generate_presigned_url(
        ClientMethod='get_object',
        Params={
            'Bucket': bucket,
            'Key': key,
            'VersionId': version,
        },
        ExpiresIn=expiration,
    )


def get_s3_remote():
    return 's3-PUBLIC'


def get_s3_backup_remote():
    return 's3-BACKUP'


def get_s3_bucket():
    return getattr(datalad_service.config, 'AWS_S3_PUBLIC_BUCKET')


def get_s3_backup_bucket():
    return getattr(datalad_service.config, 'GCP_S3_BACKUP_BUCKET')
