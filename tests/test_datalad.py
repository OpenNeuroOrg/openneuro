"""Test DataLad Celery tasks."""
import os
from mock import patch

from datalad_service.datalad import *
from .dataset_fixtures import *


def test_create_dataset(annex_path):
    ds_id = 'ds000002'
    create_dataset.run(annex_path, ds_id)
    assert Dataset(str(annex_path.join(ds_id))).repo is not None


def test_delete_dataset(annex_path, new_dataset):
    ds_id = os.path.basename(new_dataset.path)
    delete_dataset.run(annex_path, ds_id)
    assert not os.path.exists(new_dataset.path)


def test_commit_file(annex_path, new_dataset):
    ds_id = os.path.basename(new_dataset.path)
    # Write some files into the dataset first
    file_path = os.path.join(new_dataset.path, 'LICENSE')
    with open(file_path, 'w') as fd:
        fd.write("""GPL""")
    commit_files.run(annex_path, ds_id, ['LICENSE'])
    dataset = Dataset(str(annex_path.join(ds_id)))
    assert not dataset.repo.is_dirty()
