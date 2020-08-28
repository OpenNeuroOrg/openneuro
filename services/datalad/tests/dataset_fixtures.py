import string
import os
import json
import random

import pytest
import fakeredis
from falcon import testing
import requests

import datalad.api
import datalad_service.common.s3
from datalad.api import Dataset
from datalad_service.app import create_app
from datalad_service.datalad import DataladStore

# Test dataset to create
DATASET_ID = 'ds000001'
SNAPSHOT_ID = '000001'
DATASET_DESCRIPTION = {
    'BIDSVersion': '1.0.2',
    'License': 'This is not a real dataset',
    'Name': 'Test fixture dataset',
}
CHANGES = '''1.0.0 2018-01-01
  - Initial version
'''

# A list of patterns to avoid annexing in BIDS datasets
BIDS_NO_ANNEX = [
    '*.tsv',
    '*.json',
    '*.bvec',
    '*.bval',
    'README',
    'CHANGES',
    '.bidsignore'
]


def id_generator(size=8, chars=string.ascii_uppercase + string.digits):
    return ''.join(random.choice(chars) for _ in range(size))


@pytest.fixture(autouse=True)
def no_redis(monkeypatch):
    fake = fakeredis.FakeRedis()
    monkeypatch.setattr('datalad_service.common.redis.redisClient', fake)


@pytest.fixture(autouse=True)
def no_git_config(monkeypatch):
    monkeypatch.setattr(
        'datalad_service.common.annex.CommitInfo.__enter__', lambda s: None)
    monkeypatch.setattr(
        'datalad_service.common.annex.CommitInfo.__exit__', lambda s, x, y, z: None)


@pytest.fixture(scope='session')
def datalad_store(tmpdir_factory):
    path = tmpdir_factory.mktemp('annexes')
    ds_path = str(path.join(DATASET_ID))
    # Create an empty dataset for testing
    ds = Dataset(ds_path)
    ds.create()
    ds.no_annex(BIDS_NO_ANNEX)

    json_path = os.path.join(ds_path, 'dataset_description.json')
    with open(json_path, 'w') as f:
        json.dump(DATASET_DESCRIPTION, f, ensure_ascii=False)
    ds.save(json_path)

    changes_path = os.path.join(ds_path, 'CHANGES')
    with open(changes_path, 'w') as f:
        json.dump(CHANGES, f, ensure_ascii=False)
    ds.save(changes_path)

    ds.save(version_tag=SNAPSHOT_ID)
    # Setup a seed for any new_dataset uses
    random.seed(42)
    return DataladStore(path)


@pytest.fixture
def new_dataset(datalad_store):
    """Create a new dataset with a unique name for one test."""
    ds_path = str(os.path.join(datalad_store.annex_path, id_generator()))
    ds = Dataset(ds_path)
    ds.create()
    ds.no_annex(BIDS_NO_ANNEX)

    json_path = os.path.join(ds_path, 'dataset_description.json')
    dsdesc = {
        'BIDSVersion': '1.0.2',
        'License': 'This is not a real dataset',
        'Name': 'Test fixture new dataset',
    }
    with open(json_path, 'w') as f:
        json.dump(dsdesc, f, ensure_ascii=False)
    ds.save(json_path)

    changes_path = os.path.join(ds_path, 'CHANGES')
    with open(changes_path, 'w') as f:
        f.write(CHANGES)
    ds.save(changes_path)
    return ds


class MockResponse:
    status_code = 200


@pytest.fixture(autouse=True)
def no_posts(monkeypatch):
    """Remove requests.post for all tests."""
    def mock_response(*args, **kwargs):
        return MockResponse()
    monkeypatch.setattr(requests, "post", mock_response)


@pytest.fixture(autouse=True)
def no_init_remote(monkeypatch):
    def mock_publish(*args, **kwargs):
        pass
    monkeypatch.setattr(datalad_service.common.s3,
                        "setup_s3_sibling", mock_publish)
    monkeypatch.setattr(datalad_service.tasks.publish,
                        "publish_target", mock_publish)
    monkeypatch.setattr(datalad.api,
                        "create_sibling_github", mock_publish)


@pytest.fixture(autouse=True)
def mock_jwt_secret(monkeypatch):
    monkeypatch.setenv('JWT_SECRET', 'test-secret-please-ignore')


@pytest.fixture
def client(datalad_store, monkeypatch):
    return testing.TestClient(create_app(datalad_store.annex_path))


class FileWrapper(object):

    def __init__(self, file_like, block_size=8192):
        self.file_like = file_like
        self.block_size = block_size

    def __getitem__(self, key):
        data = self.file_like.read(self.block_size)
        if data:
            return data

        raise IndexError
