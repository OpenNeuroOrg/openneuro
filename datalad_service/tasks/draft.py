"""Working tree / draft related tasks."""
from datalad_service.common.celery import dataset_task


@dataset_task
def is_dirty(store, dataset):
    """Check if a dataset is dirty."""
    ds = store.get_dataset(dataset)
    return ds.repo.is_dirty()
