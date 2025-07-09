import os

from pygit2 import Repository

from datalad_service.common.bids import dataset_sort, read_dataset_description
from datalad_service.common.git import git_commit


def test_sort_bids_top_level():
    files = [
        {
            'id': 'c1905b369e84cbb3016022ebf1ea1574087e20c2',
            'key': 'd8ced4c2adedad6d69c264f94a71df6be20a2241',
            'filename': 'README',
            'size': 807,
            'directory': False,
            'annexed': False,
        },
        {
            'id': 'efe97703c81a388ae7891bf10927bea6f0849645',
            'key': 'dc191c3637b7c49465d29fa6290308c5b1429e32',
            'filename': 'participants.tsv',
            'size': 179,
            'directory': False,
            'annexed': False,
        },
        {
            'id': '962a9c0777cb55a42524ca80d2da224b3f179502',
            'key': '06626c52488fd36db8cafb452dbb816f85e0a408',
            'filename': 'task-rhymejudgment_bold.json',
            'size': 63,
            'directory': False,
            'annexed': False,
        },
        {
            'id': '2cd97b8779f0d585293b9a134aa60be05e46bd52',
            'key': None,
            'filename': 'derivatives',
            'size': 0,
            'directory': True,
            'annexed': False,
        },
        {
            'id': '7293821ae8d5c647351cb2a31484162097a442c4',
            'key': '8f6598628c1e0938397e9a3994ba71416a674f9b',
            'filename': 'dataset_description.json',
            'size': 150,
            'directory': False,
            'annexed': False,
        },
        {
            'id': '92e695a42470f48ad581ac8dd0894c07ebc4a9b8',
            'key': '87b0d1e84b52af82a50100edc269f5c24e4caba5',
            'filename': 'CHANGES',
            'size': 273,
            'directory': False,
            'annexed': False,
        },
    ]

    sorted_files = sorted(files, key=dataset_sort)

    assert sorted_files[0].get('filename') == 'CHANGES'
    assert sorted_files[1].get('filename') == 'README'
    assert sorted_files[2].get('filename') == 'dataset_description.json'


def test_read_dataset_description(new_dataset):
    description = read_dataset_description(new_dataset.path, 'HEAD')
    assert description['Name'] == 'Test fixture new dataset'


def test_read_dataset_description_invalid_json(new_dataset):
    repo = Repository(new_dataset.path)
    open(os.path.join(new_dataset.path, 'dataset_description.json'), 'w').close()
    git_commit(repo, ['dataset_description.json'])
    description = read_dataset_description(new_dataset.path, 'HEAD')
    assert description is None


def test_read_dataset_description_missing(new_dataset):
    description = read_dataset_description(new_dataset.path, 'git-annex')
    assert description is None
