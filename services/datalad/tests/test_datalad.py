"""Test DataLad tasks."""

import os
import uuid

import pytest
import pygit2
from datalad.api import Dataset

from datalad_service.common.annex import init_annex
from datalad_service.common.git import OpenNeuroGitError
from datalad_service.tasks.dataset import create_dataset, delete_dataset
from datalad_service.tasks.files import commit_files


async def test_create_dataset(datalad_store):
    ds_id = 'ds000002'
    author = pygit2.Signature('test author', 'test@example.com')
    await create_dataset(datalad_store, ds_id, author)
    ds = Dataset(os.path.join(datalad_store.annex_path, ds_id))
    assert ds.repo is not None
    # Verify the dataset is created with datalad config
    assert ds.id is not None
    assert len(ds.id) == 36
    try:
        uuid.UUID(ds.id, version=4)
    except ValueError:
        assert False, 'dataset datalad id is not a valid uuid4'


async def test_create_dataset_master(datalad_store):
    ds_id = 'ds000025'
    ds_path = os.path.join(datalad_store.annex_path, ds_id)
    repo = pygit2.init_repository(ds_path, False, initial_head='master')
    # Create an empty commit
    tree = repo.index.write_tree()
    test_author = pygit2.Signature('Test User', 'test@example.com')
    repo.create_commit('refs/heads/master', test_author, test_author, 'test', tree, [])
    # Setup empty annex
    init_annex(ds_path)
    ds = Dataset(ds_path)
    assert ds.repo is not None
    # Create a new commit
    file_path = os.path.join(ds.path, 'LICENSE')
    with open(file_path, 'w') as fd:
        fd.write("""MIT""")
    await commit_files(datalad_store, ds_id, ['LICENSE'])
    # Verify the branch is now set to main
    assert ds.repo.get_active_branch() == 'main'


async def test_create_dataset_unusual_default_branch(datalad_store):
    ds_id = 'ds000026'
    author = pygit2.Signature('test author', 'test@example.com')
    # Create dataset will commit data and this should fail since HEAD is something 'unusual'
    # (such as the git-annex branch as a plausible example)
    with pytest.raises(OpenNeuroGitError) as e:
        await create_dataset(datalad_store, ds_id, author, 'unusual')


async def test_delete_dataset(datalad_store, new_dataset):
    await delete_dataset(new_dataset.path)
    assert not os.path.exists(new_dataset.path)


async def test_commit_file(datalad_store, new_dataset):
    ds_id = os.path.basename(new_dataset.path)
    # Write some files into the dataset first
    file_path = os.path.join(new_dataset.path, 'LICENSE')
    with open(file_path, 'w') as fd:
        fd.write("""GPL""")
    await commit_files(datalad_store, ds_id, ['LICENSE'])
    dataset = Dataset(os.path.join(datalad_store.annex_path, ds_id))
    assert not dataset.repo.dirty
