import os
import shutil
import traceback

import requests
from datalad_service.handlers.upload import move_files_into_repo
from datalad_service.config import GRAPHQL_ENDPOINT


def download_file(url, destination_filename):
    with requests.get(url, stream=True) as r:
        with open(destination_filename, 'wb') as f:
            shutil.copyfileobj(r.raw, f)


def remote_dataset_import(
    dataset_path, upload_path, import_id, url, name, email, cookies
):
    """Given a zip file URL, download and unpack the URL into a dataset."""
    download_path = os.path.join(upload_path, f'{import_id}.zip')
    os.makedirs(upload_path, exist_ok=True)
    download_file(url, download_path)

    # Unpack the archive into a temporary directory
    unpack_path = os.path.join(upload_path, import_id)
    shutil.unpack_archive(download_path, unpack_path)

    top_level_dirs = os.listdir(unpack_path)
    # ezBIDS uses a 'bids' directory in bundles - prefer that if available
    if 'bids' in top_level_dirs:
        data_path = os.path.join(unpack_path, 'bids')
    else:
        data_path = os.path.join(unpack_path, top_level_dirs[0])

    # Copy into the repo
    dataset_id = os.path.basename(dataset_path)
    move_files_into_repo(dataset_id, dataset_path, data_path, name, email, cookies)

    # Clean up all upload temporary data
    shutil.rmtree(upload_path)


def import_complete_mutation(import_id, success, message=''):
    return {
        'query': 'mutation ($id: ID!, $success: Boolean!, $message: String) { finishImportRemoteDataset(id: $id, success: $success, message: $message) }',
        'variables': {
            'id': import_id,
            'success': success,
            'message': message,
        },
    }


def notify_import_complete(import_id, success, message, cookies):
    """Update the API when an import is complete."""
    r = requests.post(
        url=GRAPHQL_ENDPOINT,
        json=import_complete_mutation(import_id, success, message),
        cookies=cookies,
    )
    if r.status_code != 200:
        raise Exception(r.text)


def remote_import(dataset_path, upload_path, import_id, url, name, email, cookies):
    """Import a dataset bundle into an existing dataset and notify when complete."""
    success = True
    message = ''
    try:
        remote_dataset_import(
            dataset_path, upload_path, import_id, url, name, email, cookies
        )
    except Exception as e:
        success = False
        message = ''.join(traceback.format_exception(type(e), e, e.__traceback__))
    finally:
        notify_import_complete(import_id, success, message, cookies)
