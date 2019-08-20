from .dataset_fixtures import *
from datalad_service.common.annex import create_file_obj, parse_ls_tree_line, read_ls_tree_line

expected_file_object = {
    'filename': 'dataset_description.json',
    'id': '43502da40903d08b18b533f8897330badd6e1da3',
    'key': '838d19644b3296cf32637bbdf9ae5c87db34842f',
    'size': 101
}


def test_create_file_obj_unannexed(new_dataset):
    tree = new_dataset.repo.repo.commit('HEAD').tree
    assert create_file_obj(
        new_dataset, tree, ('dataset_description.json', None)) == expected_file_object


def test_create_file_obj_deleted(new_dataset):
    """Test for the case where this file only exists in ancestor commits"""
    hexsha = new_dataset.repo.repo.head.commit
    new_dataset.remove('dataset_description.json')
    tree = new_dataset.repo.repo.commit(hexsha).tree
    assert create_file_obj(
        new_dataset, tree, ('dataset_description.json', None)) == expected_file_object


def test_parse_ls_tree_line():
    filename, mode, obj_type, obj_hash, size = parse_ls_tree_line(
        """100644 blob a786c385bd1812410d01177affb6ce834d85facd     459	dataset_description.json""")
    assert int(size) > 0


def test_parse_ls_tree_line_annexed():
    filename, mode, obj_type, obj_hash, size = parse_ls_tree_line(
        """120000 blob 570cb4a3fd80de6e8491312c935bfe8029066361     141	derivatives/mriqc/reports/sub-01_ses-01_T1w.html""")
    assert int(size) > 0


def test_parse_ls_tree_line_submodule():
    filename, mode, obj_type, obj_hash, size = parse_ls_tree_line(
        """160000 commit fcafd17fbfa44495c7f5f8a0777e5ab610b09500       -	code/facedistid_analysis""")
    assert size == '-'


def test_get_ls_tree_line():
    files = []
    symlinkFilenames = []
    symlinkObjects = []
    read_ls_tree_line("""100644 blob a786c385bd1812410d01177affb6ce834d85facd     459	dataset_description.json""",
                      files, symlinkFilenames, symlinkObjects)
    assert files == [
        {'filename': 'dataset_description.json',
         'id': '78dd92373749f62af23f3ae499b7a8ac33418fff',
         'key': 'a786c385bd1812410d01177affb6ce834d85facd',
         'size': 459
         }]
    assert symlinkFilenames == []
    assert symlinkObjects == []


def test_get_ls_tree_line_ignored():
    files = []
    symlinkFilenames = []
    symlinkObjects = []
    read_ls_tree_line("""100644 blob a786c385bd1812410d01177affb6ce834d85facd     459	.gitattributes""",
                      files, symlinkFilenames, symlinkObjects)
    assert files == []
    assert symlinkFilenames == []
    assert symlinkObjects == []


def test_get_ls_tree_line_annexed():
    files = []
    symlinkFilenames = []
    symlinkObjects = []
    read_ls_tree_line("""120000 blob 570cb4a3fd80de6e8491312c935bfe8029066361     141	derivatives/mriqc/reports/sub-01_ses-01_T1w.html""",
                      files, symlinkFilenames, symlinkObjects)
    assert files == []
    assert symlinkFilenames == [
        'derivatives/mriqc/reports/sub-01_ses-01_T1w.html']
    assert symlinkObjects == ['570cb4a3fd80de6e8491312c935bfe8029066361']


def test_get_ls_tree_line_submodule():
    files = []
    symlinkFilenames = []
    symlinkObjects = []
    read_ls_tree_line("""160000 commit fcafd17fbfa44495c7f5f8a0777e5ab610b09500       -	code/facedistid_analysis""",
                      files, symlinkFilenames, symlinkObjects)
    assert files == []
    assert symlinkFilenames == []
    assert symlinkObjects == []
