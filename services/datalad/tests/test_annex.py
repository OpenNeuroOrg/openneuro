from .dataset_fixtures import *
from datalad_service.common.annex import create_file_obj, parse_ls_tree_line, read_ls_tree_line, read_where_is_line

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
    gitAnnexUrls = {}
    files = []
    symlinkFilenames = []
    symlinkObjects = []
    read_ls_tree_line("""100644 blob a786c385bd1812410d01177affb6ce834d85facd     459	dataset_description.json""",
                      gitAnnexUrls, files, symlinkFilenames, symlinkObjects)
    assert files == [
        {'filename': 'dataset_description.json',
         'id': '78dd92373749f62af23f3ae499b7a8ac33418fff',
         'key': 'a786c385bd1812410d01177affb6ce834d85facd',
         'size': 459,
         'urls': []
         }]
    assert symlinkFilenames == []
    assert symlinkObjects == []


def test_get_ls_tree_line_ignored():
    gitAnnexUrls = {}
    files = []
    symlinkFilenames = []
    symlinkObjects = []
    read_ls_tree_line("""100644 blob a786c385bd1812410d01177affb6ce834d85facd     459	.gitattributes""",
                      gitAnnexUrls, files, symlinkFilenames, symlinkObjects)
    assert files == []
    assert symlinkFilenames == []
    assert symlinkObjects == []


def test_get_ls_tree_line_annexed():
    gitAnnexUrls = {}
    files = []
    symlinkFilenames = []
    symlinkObjects = []
    read_ls_tree_line("""120000 blob 570cb4a3fd80de6e8491312c935bfe8029066361     141	derivatives/mriqc/reports/sub-01_ses-01_T1w.html""",
                      gitAnnexUrls, files, symlinkFilenames, symlinkObjects)
    assert files == []
    assert symlinkFilenames == [
        'derivatives/mriqc/reports/sub-01_ses-01_T1w.html']
    assert symlinkObjects == ['570cb4a3fd80de6e8491312c935bfe8029066361']


def test_get_ls_tree_line_submodule():
    gitAnnexUrls = {}
    files = []
    symlinkFilenames = []
    symlinkObjects = []
    read_ls_tree_line("""160000 commit fcafd17fbfa44495c7f5f8a0777e5ab610b09500       -	code/facedistid_analysis""",
                      gitAnnexUrls, files, symlinkFilenames, symlinkObjects)
    assert files == []
    assert symlinkFilenames == []
    assert symlinkObjects == []


def test_read_where_is_line():
    gitAnnexUrls = {}
    exampleAnnexedLine = """{"command":"whereis","note":"2 copies\\n\\t87fe6ba3-eb5e-4419-b7ce-839dd8fd1308 -- root@35763ede081b:/datalad/ds002002 [here]\\n \\tdd8cfd6d-a11e-419b-bbbc-35085d98051a -- [s3-PUBLIC]\\n\\ns3-PUBLIC: http://openneuro-datalad-public-nell-test.s3.amazonaws.com/ds002002/sub-01/anat/sub-01_T1w.nii.gz?versionId=yuHcJT5RxnjxNVuwEx3yq15oDrpb7H9z\\n","success":true,"untrusted":[],"key":"MD5E-s311112--bc8bbbacfd2ff823c2047ead1afec9b3.nii.gz","whereis":[{"here":true,"uuid":"87fe6ba3-eb5e-4419-b7ce-839dd8fd1308","urls":[],"description":"root@35763ede081b:/datalad/ds002002"},{"here":false,"uuid":"dd8cfd6d-a11e-419b-bbbc-35085d98051a","urls":["http://openneuro-datalad-public-nell-test.s3.amazonaws.com/ds002002/sub-01/anat/sub-01_T1w.nii.gz?versionId=yuHcJT5RxnjxNVuwEx3yq15oDrpb7H9z"],"description":"[s3-PUBLIC]"}],"file":null}"""
    read_where_is_line(gitAnnexUrls, exampleAnnexedLine)
    assert "MD5E-s311112--bc8bbbacfd2ff823c2047ead1afec9b3.nii.gz" in gitAnnexUrls
    assert gitAnnexUrls["MD5E-s311112--bc8bbbacfd2ff823c2047ead1afec9b3.nii.gz"] == [
        'http://openneuro-datalad-public-nell-test.s3.amazonaws.com/ds002002/sub-01/anat/sub-01_T1w.nii.gz?versionId=yuHcJT5RxnjxNVuwEx3yq15oDrpb7H9z']


def test_read_where_is_line_git_file():
    gitAnnexUrls = {}
    exampleAnnexedLine = """{"command":"whereis","note":"1 copy\\n\\tdd8cfd6d-a11e-419b-bbbc-35085d98051a -- [s3-PUBLIC]\\n\\ns3-PUBLIC: http://openneuro-datalad-public-nell-test.s3.amazonaws.com/ds002002/T1w.json?versionId=65LPwCLmnBAOYlJ0WBW0itAo3ooGAw4j\\n","success":true,"untrusted":[],"key":"SHA1--b08aa0ec5b5e716479824859524a22140fb2af82","whereis":[{"here":false,"uuid":"dd8cfd6d-a11e-419b-bbbc-35085d98051a","urls":["http://openneuro-datalad-public-nell-test.s3.amazonaws.com/ds002002/T1w.json?versionId=65LPwCLmnBAOYlJ0WBW0itAo3ooGAw4j"],"description":"[s3-PUBLIC]"}],"file":null}"""
    read_where_is_line(gitAnnexUrls, exampleAnnexedLine)
    assert "SHA1--b08aa0ec5b5e716479824859524a22140fb2af82" in gitAnnexUrls
    assert gitAnnexUrls["SHA1--b08aa0ec5b5e716479824859524a22140fb2af82"] == [
        'http://openneuro-datalad-public-nell-test.s3.amazonaws.com/ds002002/T1w.json?versionId=65LPwCLmnBAOYlJ0WBW0itAo3ooGAw4j']
