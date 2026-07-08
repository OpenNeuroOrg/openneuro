from pathlib import Path

import pygit2

from datalad_service.tasks.fsck import git_annex_fsck_local
from datalad_service.tasks.validator import validate_dataset


async def on_head(dataset_path):
    """Called after any change to HEAD."""
    dataset_id = Path(dataset_path).name
    ref = pygit2.Repository(dataset_path).head.target
    await validate_dataset.kiq(dataset_id, dataset_path, str(ref))
    await git_annex_fsck_local.kiq(dataset_path)


async def on_tag(dataset_path, tag):
    """Called after any new tag."""
    pass
