"""Test DataLad Celery tasks."""
import os
from mock import patch

import pygit2

from .dataset_fixtures import *
from datalad_service.tasks.dataset import *
from datalad_service.tasks.files import commit_files


def test_create_dataset(datalad_store):
    ds_id = 'ds000002'
    author = pygit2.Signature('test author', 'test@example.com')
    create_dataset(datalad_store, ds_id, author)
    ds = Dataset(os.path.join(
        datalad_store.annex_path, ds_id))
    assert ds.repo is not None
    assert len(ds.id) == 36


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
