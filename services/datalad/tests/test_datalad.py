"""Test DataLad Celery tasks."""
import os
from mock import patch
import uuid

import pygit2
from datalad.api import Dataset

from datalad_service.tasks.dataset import *
from datalad_service.tasks.files import commit_files


def test_create_dataset(datalad_store):
    ds_id = 'ds000002'
    author = pygit2.Signature('test author', 'test@example.com')
    create_dataset(datalad_store, ds_id, author)
    ds = Dataset(os.path.join(datalad_store.annex_path, ds_id))
    assert ds.repo is not None
    # Verify the dataset is created with datalad config
    assert ds.id is not None
    assert len(ds.id) == 36
    try:
        uuid.UUID(ds.id, version=4)
    except ValueError:
        assert False, "dataset datalad id is not a valid uuid4"


def test_create_dataset_master(datalad_store):
    ds_id = 'ds000025'
    author = pygit2.Signature('test author', 'test@example.com')
    create_dataset(datalad_store, ds_id, author, 'master')
    ds = Dataset(os.path.join(datalad_store.annex_path, ds_id))
    assert ds.repo is not None
    # Verify the dataset is created with datalad config
    assert ds.id is not None
    assert len(ds.id) == 36
    try:
        uuid.UUID(ds.id, version=4)
    except ValueError:
        assert False, "dataset datalad id is not a valid uuid4"
    # Verify the branch is now set to main
    assert ds.repo.get_active_branch() == 'main'


def test_delete_dataset(datalad_store, new_dataset):
    delete_dataset(new_dataset.path)
    assert not os.path.exists(new_dataset.path)


def test_commit_file(datalad_store, new_dataset):
    ds_id = os.path.basename(new_dataset.path)
    # Write some files into the dataset first
    file_path = os.path.join(new_dataset.path, 'LICENSE')
    with open(file_path, 'w') as fd:
        fd.write("""GPL""")
    commit_files(datalad_store, ds_id, ['LICENSE'])
    dataset = Dataset(os.path.join(datalad_store.annex_path, ds_id))
    assert not dataset.repo.dirty
