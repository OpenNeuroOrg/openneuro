import json
import os
from datalad_service.common.celery import dataset_task


def edit_description(description, new_fields):
    updated = description.copy()
    updated.update(new_fields)
    return updated


@dataset_task
def update_description(store, dataset, description_fields):
    ds = store.get_dataset(dataset)
    description = ds.repo.repo.git.show(
        'HEAD:dataset_description.json')
    description_json = json.loads(description)
    if any(description_fields):
        updated = edit_description(description_json, description_fields)
        path = os.path.join(store.get_dataset_path(
            dataset), 'dataset_description.json')
        with open(path, 'r+', encoding='utf-8') as description_file:
            description_file_contents = description_file.read()
            if description_file_contents[-1] == '\n':
                description_file_contents = description_file_contents[:-1]
            if description != description_file_contents:
                raise Exception('unexpected dataset_description.json contents')
            description_file.seek(0)
            description_file.truncate(0)
            description_file.write(json.dumps(updated, indent=4))
        ds.add(path=path, message='update dataset_description')
        return updated
    else:
        return description_json
