import io

from datalad_service.common.annex import (
    parse_ls_tree_line,
    read_ls_tree_line,
    compute_rmet,
    parse_remote_line,
    parse_rmet_line,
    read_rmet_file,
    encode_remote_url,
)

expected_file_object = {
    'filename': 'dataset_description.json',
    'id': '43502da40903d08b18b533f8897330badd6e1da3',
    'key': '838d19644b3296cf32637bbdf9ae5c87db34842f',
    'size': 101,
}


def test_parse_ls_tree_line():
    filename, mode, obj_type, obj_hash, size = parse_ls_tree_line(
        """100644 blob a786c385bd1812410d01177affb6ce834d85facd     459	dataset_description.json"""
    )
    assert int(size) > 0


def test_parse_ls_tree_line_annexed():
    filename, mode, obj_type, obj_hash, size = parse_ls_tree_line(
        """120000 blob 570cb4a3fd80de6e8491312c935bfe8029066361     141	derivatives/mriqc/reports/sub-01_ses-01_T1w.html"""
    )
    assert int(size) > 0


def test_parse_ls_tree_line_submodule():
    filename, mode, obj_type, obj_hash, size = parse_ls_tree_line(
        """160000 commit fcafd17fbfa44495c7f5f8a0777e5ab610b09500       -	code/facedistid_analysis"""
    )
    assert size == '-'


def test_get_ls_tree_line():
    files = []
    symlinkFilenames = []
    symlinkObjects = []
    read_ls_tree_line(
        """100644 blob a786c385bd1812410d01177affb6ce834d85facd     459	dataset_description.json""",
        files,
        symlinkFilenames,
        symlinkObjects,
    )
    assert files == [
        {
            'filename': 'dataset_description.json',
            'size': 459,
            'id': '78dd92373749f62af23f3ae499b7a8ac33418fff',
            'key': 'a786c385bd1812410d01177affb6ce834d85facd',
            'urls': [],
            'annexed': False,
            'directory': False,
        }
    ]
    assert symlinkFilenames == []
    assert symlinkObjects == []


def test_get_ls_tree_line_ignored():
    files = []
    symlinkFilenames = []
    symlinkObjects = []
    read_ls_tree_line(
        """100644 blob a786c385bd1812410d01177affb6ce834d85facd     459	.gitattributes""",
        files,
        symlinkFilenames,
        symlinkObjects,
    )
    assert files == []
    assert symlinkFilenames == []
    assert symlinkObjects == []


def test_get_ls_tree_line_annexed():
    files = []
    symlinkFilenames = []
    symlinkObjects = []
    read_ls_tree_line(
        """120000 blob 570cb4a3fd80de6e8491312c935bfe8029066361     141	derivatives/mriqc/reports/sub-01_ses-01_T1w.html""",
        files,
        symlinkFilenames,
        symlinkObjects,
    )
    assert files == []
    assert symlinkFilenames == ['derivatives/mriqc/reports/sub-01_ses-01_T1w.html']
    assert symlinkObjects == ['570cb4a3fd80de6e8491312c935bfe8029066361']


def test_get_ls_tree_line_submodule():
    files = []
    symlinkFilenames = []
    symlinkObjects = []
    read_ls_tree_line(
        """160000 commit fcafd17fbfa44495c7f5f8a0777e5ab610b09500       -	code/facedistid_analysis""",
        files,
        symlinkFilenames,
        symlinkObjects,
    )
    assert files == []
    assert symlinkFilenames == []
    assert symlinkObjects == []


def test_compute_rmet_git():
    # Test a git SHA1 key
    assert (
        compute_rmet('99fe93bfea62c16a10488593da870df25d09be81')
        == '0f5/0b4/GIT--99fe93bfea62c16a10488593da870df25d09be81.log.rmet'
    )


def test_compute_rmet_git_legacy():
    # Test a git SHA1 key
    assert (
        compute_rmet('99fe93bfea62c16a10488593da870df25d09be81', legacy=True)
        == '9e2/03e/SHA1--99fe93bfea62c16a10488593da870df25d09be81.log.rmet'
    )


def test_compute_rmet_annex():
    # Test a git annex MD5E key
    assert (
        compute_rmet('MD5E-s12102144--d614929593bf2a7cccea90bea67255f4.bdf')
        == '9ce/c07/MD5E-s12102144--d614929593bf2a7cccea90bea67255f4.bdf.log.rmet'
    )


def test_compute_rmet_sha256_annex():
    # Test a git annex MD5E key
    assert (
        compute_rmet(
            'SHA256E-s311112--c3527d7944a9619afb57863a34e6af7ec3fe4f108e56c860d9e700699ff806fb.nii.gz'
        )
        == '2ed/6ea/SHA256E-s311112--c3527d7944a9619afb57863a34e6af7ec3fe4f108e56c860d9e700699ff806fb.nii.gz.log.rmet'
    )


def test_parse_remote_line():
    remote = parse_remote_line(
        """57894849-d0c8-4c62-8418-3627be18a196 autoenable=true bucket=openneuro.org datacenter=US encryption=none exporttree=yes fileprefix=ds002778/ host=s3.amazonaws.com name=s3-PUBLIC partsize=1GiB port=80 public=yes publicurl=http://openneuro.org.s3.amazonaws.com/ storageclass=STANDARD type=S3 versioning=yes timestamp=1588743361.538097946s"""
    )
    assert remote == {
        'url': 'http://openneuro.org.s3.amazonaws.com/',
        'uuid': '57894849-d0c8-4c62-8418-3627be18a196',
        'name': 's3-PUBLIC',
    }


def test_parse_rmet_line():
    remote = {
        'name': 's3-PUBLIC',
        'url': 'http://openneuro.org.s3.amazonaws.com/',
        'uuid': '57894849-d0c8-4c62-8418-3627be18a196',
    }
    url = parse_rmet_line(
        remote,
        """1590213748.042921433s 57894849-d0c8-4c62-8418-3627be18a196:V +iVcEk18e3J2WQys4zr_ANaTPfpUufW4Y#ds002778/dataset_description.json""",
    )
    assert (
        'https://s3.amazonaws.com/a-fake-test-public-bucket/ds002778/dataset_description.json?versionId=iVcEk18e3J2WQys4zr_ANaTPfpUufW4Y&AWSAccessKeyId=aws-id'
        in url
    )
    assert 'Signature=' in url


def test_parse_rmet_line_https():
    remote = {
        'name': 's3-PUBLIC',
        'url': 'https://s3.amazonaws.com/openneuro.org',
        'uuid': '57894849-d0c8-4c62-8418-3627be18a196',
    }
    url = parse_rmet_line(
        remote,
        """1590213748.042921433s 57894849-d0c8-4c62-8418-3627be18a196:V +iVcEk18e3J2WQys4zr_ANaTPfpUufW4Y#ds002778/dataset_description.json""",
    )
    assert (
        'https://s3.amazonaws.com/a-fake-test-public-bucket/ds002778/dataset_description.json?versionId=iVcEk18e3J2WQys4zr_ANaTPfpUufW4Y&AWSAccessKeyId=aws-id'
        in url
    )
    assert 'Signature=' in url


def test_parse_rmet_line_base64():
    remote = {
        'name': 's3-PUBLIC',
        'url': 'https://s3.amazonaws.com/openneuro.org',
        'uuid': '57894849-d0c8-4c62-8418-3627be18a196',
    }
    url = parse_rmet_line(
        remote,
        """1590213748.042921433s 57894849-d0c8-4c62-8418-3627be18a196:V +!aVZjRWsxOGUzSjJXUXlzNHpyX0FOYVRQZnBVdWZXNFkjZHMwMDI3NzgvZGF0YXNldF9kZXNjcmlwdGlvbi5qc29u""",
    )
    assert (
        'https://s3.amazonaws.com/a-fake-test-public-bucket/ds002778/dataset_description.json?versionId=iVcEk18e3J2WQys4zr_ANaTPfpUufW4Y&AWSAccessKeyId=aws-id'
        in url
    )
    assert 'Signature=' in url


def test_read_rmet_file():
    remote = {
        'name': 's3-PUBLIC',
        'url': 'http://openneuro.org.s3.amazonaws.com/',
        'uuid': '57894849-d0c8-4c62-8418-3627be18a196',
    }
    catFile = io.BytesIO(b""":::99fe93bfea62c16a10488593da870df25d09be81
    1590213748.042921433s 57894849-d0c8-4c62-8418-3627be18a196:V +iVcEk18e3J2WQys4zr_ANaTPfpUufW4Y#ds002778/dataset_description.json""")
    url = read_rmet_file(remote, catFile)
    assert (
        'https://s3.amazonaws.com/a-fake-test-public-bucket/ds002778/dataset_description.json?versionId=iVcEk18e3J2WQys4zr_ANaTPfpUufW4Y&AWSAccessKeyId=aws-id'
        in url
    )
    assert 'Signature=' in url


def test_remote_url_encoding():
    assert (
        encode_remote_url(
            'https://s3.amazonaws.com/openneuro.org/ds000248/derivatives/freesurfer/subjects/sub-01/mri/aparc+aseg.mgz?versionId=2Wx7w.fCYeGzGWLnW9sxWsPdztl.2HL0'
        )
        == 'https://s3.amazonaws.com/openneuro.org/ds000248/derivatives/freesurfer/subjects/sub-01/mri/aparc%2Baseg.mgz?versionId=2Wx7w.fCYeGzGWLnW9sxWsPdztl.2HL0'
    )
    assert (
        encode_remote_url(
            'https://s3.amazonaws.com/openneuro.org/ds000248/sub-01/anat/sub-01_T1w.nii.gz?versionId=8uTXIQ10Blcp2GeAVJJCHL5PimkSaQZL'
        )
        == 'https://s3.amazonaws.com/openneuro.org/ds000248/sub-01/anat/sub-01_T1w.nii.gz?versionId=8uTXIQ10Blcp2GeAVJJCHL5PimkSaQZL'
    )
    assert encode_remote_url('=') == '='
