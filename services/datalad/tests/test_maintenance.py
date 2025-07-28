from datalad_service.tasks.maintenance import gc_dataset, git_fsck_dataset


def test_gc_dataset(new_dataset):
    gc_dataset(new_dataset.path)


def test_git_fsck_dataset(new_dataset):
    git_fsck_dataset(new_dataset.path)
