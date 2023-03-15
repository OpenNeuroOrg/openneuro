import json

from datalad_service.common.git import git_show


def read_dataset_description(dataset_path, commit):
    try:
        raw_description = git_show(
            dataset_path, commit, 'dataset_description.json')
        return json.loads(raw_description)
    except json.decoder.JSONDecodeError:
        return None
    except KeyError:
        # dataset_description.json does not exist
        return None


def dataset_sort(file):
    """BIDS aware sorting of dataset file listings"""
    filename = file.get('filename')
    return (file.get('directory'), not (filename == 'dataset_description.json' or filename == 'CHANGES' or filename == 'README' or filename == 'LICENSE'), filename)
