import os
import subprocess

from datalad_service.common.celery import app


def setup_validator():
    if not os.path.exists('./node_modules/.bin/bids-validator'):
        subprocess.run(['yarn'])


def validate_dataset(dataset_path):
    setup_validator()
    process = subprocess.run(
        ['./node_modules/.bin/bids-validator', '--json', dataset_path], stdout=subprocess.PIPE)
    return process.stdout


@app.task
def validate_dataset_async(dataset_path, hook):
    output = validate_dataset(dataset_path)
