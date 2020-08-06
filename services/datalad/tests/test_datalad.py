"""Test DataLad Celery tasks."""
import os
from mock import patch

from .dataset_fixtures import *
from datalad_service.tasks.dataset import *
from datalad_service.tasks.files import commit_files


def test_create_dataset(datalad_store):
    ds_id = 'ds000002'
    create_dataset(datalad_store, ds_id)
    assert Dataset(os.path.join(
        datalad_store.annex_path, ds_id)).repo is not None


def test_delete_dataset(datalad_store, new_dataset):
    ds_id = os.path.basename(new_dataset.path)
    delete_dataset(datalad_store, ds_id)
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
