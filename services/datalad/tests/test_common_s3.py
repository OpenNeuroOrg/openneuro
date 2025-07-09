import subprocess

import pytest

import datalad_service.config
from datalad_service.common.s3 import (
    get_s3_remote,
    get_s3_bucket,
    generate_s3_annex_options,
    update_s3_sibling,
    validate_s3_config,
)
from datalad_service.tasks.publish import create_remotes


def test_get_s3_remote():
    assert get_s3_remote() == 's3-PUBLIC'


def test_get_s3_bucket(monkeypatch):
    monkeypatch.setattr(
        datalad_service.config, 'AWS_S3_PUBLIC_BUCKET', 'a-fake-test-public-bucket'
    )
    assert get_s3_bucket() == 'a-fake-test-public-bucket'


def test_s3_annex_options(monkeypatch):
    monkeypatch.setattr(
        datalad_service.config, 'AWS_S3_PUBLIC_BUCKET', 'a-fake-test-public-bucket'
    )
    options = generate_s3_annex_options('/tmp/dataset/does/not/exist/test00001')
    assert 'type=S3' in options
    # Verify public=no (ACL deprecation)
    assert 'public=no' in options
    # Verify autoenable=true (not yes)
    assert 'autoenable=true' in options
    # Check prefix and bucket strings are interpolated right
    assert 'fileprefix=test00001/' in options
    assert 'bucket=a-fake-test-public-bucket' in options


def test_update_s3_sibling(monkeypatch, no_init_remote, new_dataset):
    monkeypatch.setattr(
        datalad_service.config, 'AWS_S3_PUBLIC_BUCKET', 'a-fake-test-public-bucket'
    )
    create_remotes(new_dataset.path)
    # This will break this dataset beyond here in tests, but make sure it fails at the enableremote step
    with pytest.raises(subprocess.CalledProcessError):
        update_s3_sibling(new_dataset.path)


def test_validate_s3_config(no_init_remote, new_dataset):
    annex_options = generate_s3_annex_options(new_dataset.path)
    # Set a bad option
    annex_options = ['type=web']
    # check=False because this will fail when talking to S3
    subprocess.run(
        ['git-annex', 'initremote', get_s3_remote()] + annex_options,
        check=False,
        cwd=new_dataset.path,
    )
    assert not validate_s3_config(new_dataset.path)
