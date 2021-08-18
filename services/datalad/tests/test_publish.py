import os

from .dataset_fixtures import *

from datalad_service.tasks.publish import publish_snapshot, create_github_repo


def test_publish(s3_creds, datalad_store, new_dataset):
    ds_id = os.path.basename(new_dataset.path)
    publish_snapshot(
        new_dataset.path, snapshot='test-version')


def test_publish_private(s3_creds, datalad_store, new_dataset):
    ds_id = os.path.basename(new_dataset.path)
    publish_snapshot(
        new_dataset.path, snapshot='test-version', cookies=None, realm='PRIVATE')


def test_publish_public(s3_creds, monkeypatch, github_dryrun, datalad_store, new_dataset):
    monkeypatch.setenv('DATALAD_GITHUB_ORG', 'test')
    monkeypatch.setenv('DATALAD_GITHUB_LOGIN', 'user')
    monkeypatch.setenv('DATALAD_GITHUB_PASS', 'password')
    publish_snapshot(
        new_dataset.path, snapshot='test-version', cookies=None, realm='PUBLIC')
