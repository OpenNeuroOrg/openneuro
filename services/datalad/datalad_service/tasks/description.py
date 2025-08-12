import aiofiles
import json
import os

from datalad_service.common.annex import edit_annexed_file
from datalad_service.common.git import git_show_content
from datalad_service.tasks.files import commit_files


def edit_description(description, new_fields):
    updated = description.copy()
    updated.update(new_fields)
    return updated


async def update_description(store, dataset, description_fields, name=None, email=None):
    repo = store.get_dataset_repo(dataset)
    description_stream, description_size = await git_show_content(
        repo, 'HEAD', 'dataset_description.json'
    )
    all_content_bytes_list = []
    async for chunk in description_stream:
        all_content_bytes_list.append(chunk)
    description = b''.join(all_content_bytes_list).decode()
    description_json = json.loads(description)
    if description_json.get('License') != 'CC0':
        description_fields = edit_description(description_fields, {'License': 'CC0'})
    if description_fields is not None and any(description_fields):
        updated = edit_description(description_json, description_fields)
        path = os.path.join(store.get_dataset_path(dataset), 'dataset_description.json')
        await edit_annexed_file(
            path, description, json.dumps(updated, indent=4, ensure_ascii=False)
        )
        # Commit new content, run validator
        await commit_files(store, dataset, ['dataset_description.json'])
        return updated
    else:
        return description_json
