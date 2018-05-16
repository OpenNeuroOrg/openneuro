"""Environment based configuration."""
import os

DATALAD_WORKERS = os.environ['DATALAD_WORKERS'] if 'DATALAD_WORKERS' in os.environ else 1
DATALAD_GITHUB_ORG = os.environ['DATALAD_GITHUB_ORG'] if 'DATALAD_GITHUB_ORG' in os.environ else None
DATALAD_GITHUB_LOGIN = os.environ['DATALAD_GITHUB_LOGIN'] if 'DATALAD_GITHUB_LOGIN' in os.environ else None
DATALAD_GITHUB_PASS = os.environ['DATALAD_GITHUB_PASS'] if 'DATALAD_GITHUB_PASS' in os.environ else None
