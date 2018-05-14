import os
from datalad_service.publish import publish_snapshot

from .dataset_fixtures import *


def test_publish(annex_path, new_dataset):
    ds_id = os.path.basename(new_dataset.path)
    published = publish_snapshot.run(
        annex_path, ds_id, 'test_version')
    here = filter(lambda sibling: sibling['name'] == 'here', published)
    assert any(here)


def test_publish_github_remote(annex_path, new_dataset):
    ds_id = os.path.basename(new_dataset.path)
    published = publish_snapshot.run(
        annex_path, ds_id, 'test_version', github=True)
    github = filter(lambda sibling: sibling['name'] == 'github', published)
    assert any(github)


def test_publish_s3_remote(annex_path, new_dataset):
    ds_id = os.path.basename(new_dataset.path)
    published = publish_snapshot.run(
        annex_path, ds_id, 'test_version', s3=True)
    s3 = filter(lambda sibling: sibling['name'] == 's3', published)
    assert any(s3)
