import os

from .dataset_fixtures import *

import datalad_service.tasks.publish
from datalad.api import create_sibling_github
from datalad_service.tasks.publish import publish_snapshot, create_github_repo


def mock_create_github(dataset, repo_name):
    return True


@pytest.fixture
def github_dryrun(monkeypatch):
    monkeypatch.setattr(datalad_service.tasks.publish,
                        'create_github_repo',
                        mock_create_github)


@pytest.fixture(autouse=True)
def no_publish(monkeypatch):
    monkeypatch.setattr(datalad_service.tasks.publish,
                        'publish_target', lambda dataset, target, treeish: True)
    monkeypatch.setattr(
        'datalad_service.common.s3.setup_s3_sibling', lambda dataset, realm: True)


@pytest.fixture
def s3_creds(monkeypatch):
    monkeypatch.setenv('AWS_S3_PUBLIC_BUCKET', 'a-fake-test-public-bucket')
    monkeypatch.setenv('AWS_S3_PRIVATE_BUCKET', 'a-fake-test-private-bucket')


def test_publish(s3_creds, annex_path, new_dataset):
    ds_id = os.path.basename(new_dataset.path)
    published = publish_snapshot.run(
        annex_path, ds_id, 'test_version')


def test_publish_private(s3_creds, annex_path, new_dataset):
    ds_id = os.path.basename(new_dataset.path)
    published = publish_snapshot.run(
        annex_path, ds_id, 'test_version', cookies=None, realm='PRIVATE')


def test_publish_public(s3_creds, monkeypatch, github_dryrun, annex_path, new_dataset):
    monkeypatch.setenv('DATALAD_GITHUB_ORG', 'test')
    monkeypatch.setenv('DATALAD_GITHUB_LOGIN', 'user')
    monkeypatch.setenv('DATALAD_GITHUB_PASS', 'password')
    ds_id = os.path.basename(new_dataset.path)
    published = publish_snapshot.run(
        annex_path, ds_id, 'test_version', cookies=None, realm='PUBLIC')
