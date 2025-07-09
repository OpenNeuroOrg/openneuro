import sys
import string
import os
import json
import subprocess
import random

import pytest
from falcon import testing
import requests

import datalad_service.common.s3
import datalad_service.common.github
from datalad.api import Dataset
from datalad_service.app import create_app
from datalad_service.datalad import DataladStore
import datalad_service.tasks.publish


# boto has a hopelessly outdated vendored version of six that breaks
# pytest imports. Until datalad removes boto, purge the six importer.
boto_importers = [
    importer for importer in sys.meta_path if importer.__module__ == 'boto.vendored.six'
]
for importer in boto_importers:
    sys.meta_path.remove(importer)

# Test dataset to create
DATASET_ID = 'ds000001'
SNAPSHOT_ID = '000001'
DATASET_DESCRIPTION = {
    'BIDSVersion': '1.0.2',
    'License': 'This is not a real dataset',
    'Name': 'Test fixture dataset',
}
CHANGES = """1.0.0 2018-01-01
  - Initial version
"""

# A list of patterns to avoid annexing in BIDS datasets
BIDS_NO_ANNEX = [
    '*.tsv',
    '*.json',
    '*.bvec',
    '*.bval',
    'README',
    'CHANGES',
    '.bidsignore',
]


def id_generator(size=8, chars=string.ascii_uppercase + string.digits):
    return ''.join(random.choice(chars) for _ in range(size))


@pytest.fixture(scope='session')
def datalad_store(tmpdir_factory):
    path = tmpdir_factory.mktemp('annexes')
    ds_path = str(path.join(DATASET_ID))
    # Create an empty dataset for testing
    ds = Dataset(ds_path)
    ds.create(initopts=['--initial-branch', 'main'])
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
    ds.close()
    return ds


class MockResponse:
    status_code = 200


@pytest.fixture(autouse=True)
def no_posts(monkeypatch):
    """Remove requests.post for all tests."""

    def mock_response(*args, **kwargs):
        return MockResponse()

    monkeypatch.setattr(requests, 'post', mock_response)


@pytest.fixture(autouse=True)
def no_init_remote(monkeypatch, tmpdir_factory):
    def mock_s3_remote_setup(dataset_path):
        path = tmpdir_factory.mktemp('fake_s3_remote')
        subprocess.run(
            [
                'git',
                'annex',
                'initremote',
                's3-PUBLIC',
                'type=directory',
                f'directory={path}',
                'encryption=none',
                'exporttree=yes',
            ],
            check=True,
            cwd=dataset_path,
        )

    def mock_github_remote_setup(dataset_path, dataset_id):
        path = tmpdir_factory.mktemp('fake_github_remote')
        # Setup our fake GitHub remote
        subprocess.run(['git', 'init'], check=True, cwd=path)
        subprocess.run(['git-annex', 'init'], check=True, cwd=path)
        # Add it to the dataset repo
        subprocess.run(
            ['git', 'remote', 'add', 'github', f'file:///{path}'],
            check=True,
            cwd=dataset_path,
        )

    monkeypatch.setattr(
        datalad_service.common.s3, 'setup_s3_sibling', mock_s3_remote_setup
    )
    monkeypatch.setattr(
        datalad_service.common.github, 'create_github_repo', mock_github_remote_setup
    )


def mock_create_github(dataset, repo_name):
    return True


@pytest.fixture
def github_dryrun(monkeypatch):
    monkeypatch.setattr(
        datalad_service.tasks.publish, 'create_github_repo', mock_create_github
    )


@pytest.fixture(autouse=True)
def no_publish(monkeypatch):
    monkeypatch.setattr(
        datalad_service.tasks.publish, 'github_export', lambda dataset, treeish: True
    )
    monkeypatch.setattr(
        datalad_service.common.s3, 's3_export', lambda dataset, target, treeish: True
    )


@pytest.fixture
def s3_creds(monkeypatch):
    monkeypatch.setenv('AWS_S3_PUBLIC_BUCKET', 'a-fake-test-public-bucket')
    monkeypatch.setenv('AWS_S3_PRIVATE_BUCKET', 'a-fake-test-private-bucket')


@pytest.fixture(autouse=True)
def mock_jwt_secret(monkeypatch):
    monkeypatch.setenv('JWT_SECRET', 'test-secret-please-ignore')


@pytest.fixture(autouse=True)
def mock_server_url(monkeypatch):
    monkeypatch.setattr(
        datalad_service.config, 'CRN_SERVER_URL', 'http://localhost:9876'
    )


@pytest.fixture
def client(datalad_store, monkeypatch):
    monkeypatch.setenv('DATALAD_DATASET_PATH', str(datalad_store.annex_path))
    monkeypatch.setattr(
        datalad_service.config, 'DATALAD_DATASET_PATH', str(datalad_store.annex_path)
    )
    return testing.TestClient(create_app())


@pytest.fixture(autouse=True)
def mock_validate_dataset_task(monkeypatch):
    """
    Mocks the validate_dataset task to prevent event loop errors in tests.
    """

    async def async_noop_validator(*args, **kwargs):
        return None

    monkeypatch.setattr(
        'datalad_service.tasks.files.validate_dataset', async_noop_validator
    )
