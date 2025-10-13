"""Environment based configuration."""

import os


# Configuration specific to the datalad-service
DATALAD_WORKERS = int(os.getenv('DATALAD_WORKERS', 1))
DATALAD_GITHUB_ORG = os.getenv('DATALAD_GITHUB_ORG')
DATALAD_GITHUB_TOKEN = os.getenv('DATALAD_GITHUB_TOKEN')
DATALAD_GITHUB_EXPORTS_ENABLED = os.getenv('DATALAD_GITHUB_EXPORTS_ENABLED')
DATALAD_S3_PUBLIC_ON_EXPORT = os.getenv('DATALAD_S3_PUBLIC_ON_EXPORT')
DATALAD_DATASET_PATH = os.getenv('DATALAD_DATASET_PATH')

# Configuration shared with OpenNeuro or AWS CLI
AWS_ACCESS_KEY_ID = os.getenv('AWS_ACCESS_KEY_ID')
AWS_SECRET_ACCESS_KEY = os.getenv('AWS_SECRET_ACCESS_KEY')
AWS_REGION = os.getenv('AWS_REGION')
AWS_ACCOUNT_ID = os.getenv('AWS_ACCOUNT_ID')
AWS_S3_PRIVATE_BUCKET = os.getenv('AWS_S3_PRIVATE_BUCKET')
AWS_S3_PUBLIC_BUCKET = os.getenv('AWS_S3_PUBLIC_BUCKET')

# GCP S3 compatible object storage
GCP_ACCESS_KEY_ID = os.getenv('GCP_ACCESS_KEY_ID')
GCP_SECRET_ACCESS_KEY = os.getenv('GCP_SECRET_ACCESS_KEY')
GCP_S3_BACKUP_BUCKET = os.getenv('GCP_S3_BACKUP_BUCKET')


# GraphQL URL - override if not docker-compose
GRAPHQL_ENDPOINT = os.getenv('GRAPHQL_ENDPOINT', 'http://server:8111/crn/graphql')

# Site URL
CRN_SERVER_URL = os.getenv('CRN_SERVER_URL')


# Redit connection for task queue
REDIS_HOST = os.getenv('REDIS_HOST')
REDIS_PORT = os.getenv('REDIS_PORT')


def get_jwt_secret():
    """Returns the JWT_SECRET from environment variables."""
    return os.getenv('JWT_SECRET')
