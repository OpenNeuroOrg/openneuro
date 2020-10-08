"""Environment based configuration."""
import os


def get_environ(key, fallback=None):
    """Get a key from the environment and set it on this module (or a fallback value)."""
    return os.environ[key] if key in os.environ else fallback


# Configuration specific to the datalad-service
DATALAD_WORKERS = int(get_environ('DATALAD_WORKERS', 1))
DATALAD_GITHUB_ORG = get_environ('DATALAD_GITHUB_ORG')
DATALAD_GITHUB_LOGIN = get_environ('DATALAD_GITHUB_LOGIN')
DATALAD_GITHUB_PASS = get_environ('DATALAD_GITHUB_PASS')
DATALAD_GITHUB_EXPORTS_ENABLED = get_environ('DATALAD_GITHUB_EXPORTS_ENABLED')
DATALAD_S3_PUBLIC_ON_EXPORT = get_environ('DATALAD_S3_PUBLIC_ON_EXPORT')

# Configuration shared with OpenNeuro or AWS CLI
AWS_ACCESS_KEY_ID = get_environ('AWS_ACCESS_KEY_ID')
AWS_SECRET_ACCESS_KEY = get_environ('AWS_SECRET_ACCESS_KEY')
AWS_REGION = get_environ('AWS_REGION')
AWS_ACCOUNT_ID = get_environ('AWS_ACCOUNT_ID')
AWS_S3_PRIVATE_BUCKET = get_environ('AWS_S3_PRIVATE_BUCKET')
AWS_S3_PUBLIC_BUCKET = get_environ('AWS_S3_PUBLIC_BUCKET')
JWT_SECRET = get_environ('JWT_SECRET')

# Sentry monitoring
SENTRY_DSN = get_environ('SENTRY_DSN')

# GraphQL URL - override if not docker-compose
GRAPHQL_ENDPOINT = get_environ(
    'GRAPHQL_ENDPOINT', 'http://server:8111/crn/graphql')

# Redis Host
REDIS_HOST = get_environ('REDIS_HOST', 'redis')

# The path to connect to Elastic APM server
ELASTIC_APM_SERVER_URL = get_environ(
    'ELASTIC_APM_SERVER_URL')
