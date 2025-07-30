from datalad_service.tasks.fsck import git_annex_fsck_local, git_annex_fsck_remote


async def on_head(dataset_path):
    """Called after any change to HEAD."""
    await git_annex_fsck_local.kiq(dataset_path)


async def on_tag(dataset_path, tag):
    """Called after any new tag."""
    await git_annex_fsck_remote.kiq(dataset_path, tag)
