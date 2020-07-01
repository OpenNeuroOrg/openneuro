import io

from .dataset_fixtures import *
from datalad_service.common.annex import create_file_obj, parse_ls_tree_line, read_ls_tree_line, compute_rmet, parse_remote_line, parse_rmet_line, read_rmet_file

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
         'size': 459,
         'urls': []
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


def test_compute_rmet_git():
    # Test a git SHA1 key
    assert compute_rmet(
        '99fe93bfea62c16a10488593da870df25d09be81') == '9e2/03e/SHA1--99fe93bfea62c16a10488593da870df25d09be81.log.rmet'


def test_compute_rmet_annex():
    # Test a git annex MD5E key
    assert compute_rmet(
        'MD5E-s12102144--d614929593bf2a7cccea90bea67255f4.bdf') == '9ce/c07/MD5E-s12102144--d614929593bf2a7cccea90bea67255f4.bdf.log.rmet'


def test_parse_remote_line():
    remote = parse_remote_line("""57894849-d0c8-4c62-8418-3627be18a196 autoenable=true bucket=openneuro.org datacenter=US encryption=none exporttree=yes fileprefix=ds002778/ host=s3.amazonaws.com name=s3-PUBLIC partsize=1GiB port=80 public=yes publicurl=http://openneuro.org.s3.amazonaws.com/ storageclass=STANDARD type=S3 versioning=yes timestamp=1588743361.538097946s""")
    assert remote == {'url': 'http://openneuro.org.s3.amazonaws.com/',
                      'uuid': '57894849-d0c8-4c62-8418-3627be18a196'}


def test_parse_rmet_line():
    remote = {'url': 'http://openneuro.org.s3.amazonaws.com/',
              'uuid': '57894849-d0c8-4c62-8418-3627be18a196'}
    url = parse_rmet_line(
        remote, """1590213748.042921433s 57894849-d0c8-4c62-8418-3627be18a196:V +iVcEk18e3J2WQys4zr_ANaTPfpUufW4Y#ds002778/dataset_description.json""")
    assert url == 'http://openneuro.org.s3.amazonaws.com/ds002778/dataset_description.json?versionId=iVcEk18e3J2WQys4zr_ANaTPfpUufW4Y'


def test_read_rmet_file():
    remote = {'url': 'http://openneuro.org.s3.amazonaws.com/',
              'uuid': '57894849-d0c8-4c62-8418-3627be18a196'}
    catFile = io.StringIO(""":::99fe93bfea62c16a10488593da870df25d09be81
    1590213748.042921433s 57894849-d0c8-4c62-8418-3627be18a196:V +iVcEk18e3J2WQys4zr_ANaTPfpUufW4Y#ds002778/dataset_description.json""")
    url = read_rmet_file(remote, catFile)
    assert url == 'http://openneuro.org.s3.amazonaws.com/ds002778/dataset_description.json?versionId=iVcEk18e3J2WQys4zr_ANaTPfpUufW4Y'
