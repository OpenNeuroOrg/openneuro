from datalad_service.common.celery import dataset_task


@dataset_task
def get_snapshot(store, dataset, snapshot):
    # Get metadata for a snapshot (hexsha)
    ds = store.get_dataset(dataset)
    hexsha = ds.repo.repo.commit(snapshot).hexsha
    return {'id': '{}:{}'.format(dataset, snapshot), 'tag': snapshot, 'hexsha': hexsha}


@dataset_task
def get_snapshots(store, dataset):
    ds = store.get_dataset(dataset)
    repo_tags = ds.repo.get_tags()
    # Include an extra id field to uniquely identify snapshots
    tags = [{'id': '{}:{}'.format(dataset, tag['name']), 'tag': tag['name'], 'hexsha': tag['hexsha']}
            for tag in repo_tags]
    return tags
