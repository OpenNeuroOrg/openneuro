import string
import os
import json
import random

import pytest
from falcon import testing

from datalad.api import Dataset
from datalad_service.app import create_app
from datalad_service.common.celery import app as celeryapp
from datalad_service.datalad import DataladStore

# Test dataset to create
DATASET_ID = 'ds000001'
SNAPSHOT_ID = '000001'
DATASET_DESCRIPTION = {
    'BIDSVersion': '1.0.2',
    'License': 'This is not a real dataset',
    'Name': 'Test fixture dataset',
}


def id_generator(size=8, chars=string.ascii_uppercase + string.digits):
    return ''.join(random.choice(chars) for _ in range(size))


@pytest.fixture(scope='session')
def annex_path(tmpdir_factory):
    path = tmpdir_factory.mktemp('annexes')
    ds_path = str(path.join(DATASET_ID))
    # Create an empty dataset for testing
    ds = Dataset(ds_path)
    ds.create()
    json_path = os.path.join(ds_path, 'dataset_description.json')
    with open(json_path, 'w') as f:
        json.dump(DATASET_DESCRIPTION, f, ensure_ascii=False)
    ds.add(json_path)
    ds.save(version_tag=SNAPSHOT_ID)
    # Setup a seed for any new_dataset uses
    random.seed(42)
    return path


@pytest.fixture
def new_dataset(annex_path):
    """Create a new dataset with a unique name for one test."""
    ds_path = str(annex_path.join(id_generator()))
    ds = Dataset(ds_path)
    ds.create()
    json_path = os.path.join(ds_path, 'dataset_description.json')
    dsdesc = {
        'BIDSVersion': '1.0.2',
        'License': 'This is not a real dataset',
        'Name': 'Test fixture new dataset',
    }
    with open(json_path, 'w') as f:
        json.dump(dsdesc, f, ensure_ascii=False)
    ds.add(json_path)
    return ds


@pytest.fixture
def client(annex_path):
    return testing.TestClient(create_app(annex_path))


class FileWrapper(object):

    def __init__(self, file_like, block_size=8192):
        self.file_like = file_like
        self.block_size = block_size

    def __getitem__(self, key):
        data = self.file_like.read(self.block_size)
        if data:
            return data

        raise IndexError


@pytest.fixture(scope='session')
def celery_app(request):
    """Allow celery tasks to run in eager mode for integration tests."""
    celeryapp.conf.update(task_always_eager=True)
    return celeryapp
