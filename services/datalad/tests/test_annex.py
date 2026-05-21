from unittest import mock

from datalad_service.common.annex import (
    compute_rmet,
    parse_remote_line,
    parse_rmet_line,
    read_rmet_blob,
    encode_remote_url,
    test_key_remote as annex_test_key_remote,
)


def test_compute_rmet_git():
    # Test a git SHA1 key
    assert (
        compute_rmet('99fe93bfea62c16a10488593da870df25d09be81')
        == '0f5/0b4/GIT--99fe93bfea62c16a10488593da870df25d09be81.log.rmet'
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
        'x-amz-tagging': None,
    }


def test_parse_rmet_line():
    remote = {
        'name': 's3-PUBLIC',
        'url': 'https://s3.amazonaws.com/a-fake-test-public-bucket',
        'uuid': '57894849-d0c8-4c62-8418-3627be18a196',
    }
    url = parse_rmet_line(
        remote,
        """1590213748.042921433s 57894849-d0c8-4c62-8418-3627be18a196:V +iVcEk18e3J2WQys4zr_ANaTPfpUufW4Y#ds002778/dataset_description.json""",
    )
    assert (
        'https://s3.amazonaws.com/a-fake-test-public-bucket/ds002778/dataset_description.json?versionId=iVcEk18e3J2WQys4zr_ANaTPfpUufW4Y'
        in url
    )


def test_parse_rmet_line_https():
    remote = {
        'name': 's3-PUBLIC',
        'url': 'https://s3.amazonaws.com/a-fake-test-public-bucket',
        'uuid': '57894849-d0c8-4c62-8418-3627be18a196',
    }
    url = parse_rmet_line(
        remote,
        """1590213748.042921433s 57894849-d0c8-4c62-8418-3627be18a196:V +iVcEk18e3J2WQys4zr_ANaTPfpUufW4Y#ds002778/dataset_description.json""",
    )
    assert (
        'https://s3.amazonaws.com/a-fake-test-public-bucket/ds002778/dataset_description.json?versionId=iVcEk18e3J2WQys4zr_ANaTPfpUufW4Y'
        in url
    )


def test_parse_rmet_line_base64():
    remote = {
        'name': 's3-PUBLIC',
        'url': 'https://s3.amazonaws.com/a-fake-test-public-bucket',
        'uuid': '57894849-d0c8-4c62-8418-3627be18a196',
    }
    url = parse_rmet_line(
        remote,
        """1590213748.042921433s 57894849-d0c8-4c62-8418-3627be18a196:V +!aVZjRWsxOGUzSjJXUXlzNHpyX0FOYVRQZnBVdWZXNFkjZHMwMDI3NzgvZGF0YXNldF9kZXNjcmlwdGlvbi5qc29u""",
    )
    assert (
        'https://s3.amazonaws.com/a-fake-test-public-bucket/ds002778/dataset_description.json?versionId=iVcEk18e3J2WQys4zr_ANaTPfpUufW4Y'
        in url
    )


def test_read_rmet_blob():
    remote = {
        'name': 's3-PUBLIC',
        'url': 'https://s3.amazonaws.com/a-fake-test-public-bucket',
        'uuid': '57894849-d0c8-4c62-8418-3627be18a196',
    }
    blob_data = b"""1590213748.042921433s 57894849-d0c8-4c62-8418-3627be18a196:V +iVcEk18e3J2WQys4zr_ANaTPfpUufW4Y#ds002778/dataset_description.json"""
    url = read_rmet_blob(remote, blob_data)
    assert (
        'https://s3.amazonaws.com/a-fake-test-public-bucket/ds002778/dataset_description.json?versionId=iVcEk18e3J2WQys4zr_ANaTPfpUufW4Y'
        in url
    )


def test_key_remote_finds_s3_url(monkeypatch):
    """Keys not stored locally should resolve to their S3 URL via the rmet log."""
    key = 'SHA256E-s4266076--9952d0328f159fdabbcdc8928411bfe02c74d321c75c7a396664866c3387a236.pial.sub-0475_acq-t1mprtrap2iso_run-1_T1w.gii'
    remote_uuid = '57894849-d0c8-4c62-8418-3627be18a196'
    remote_log = (
        f'{remote_uuid} autoenable=true bucket=openneuro.org datacenter=US '
        'encryption=none exporttree=yes fileprefix=ds000001/ host=s3.amazonaws.com '
        'name=s3-PUBLIC partsize=1GiB port=80 public=yes '
        'publicurl=http://openneuro.org.s3.amazonaws.com/ storageclass=STANDARD '
        'type=S3 versioning=yes timestamp=1588743361.538097946s'
    )
    rmet_content = (
        f'1590213748.042921433s {remote_uuid}:V '
        '+iVcEk18e3J2WQys4zr_ANaTPfpUufW4Y'
        '#ds000001/sub-0475/anat/sub-0475_acq-t1mprtrap2iso_run-1_T1w.gii\n'
    )

    def mock_git_show(repo, committish, obj):
        if obj == 'remote.log':
            return remote_log
        return rmet_content

    monkeypatch.setattr(
        'datalad_service.common.annex.pygit2.Repository', lambda _: mock.MagicMock()
    )
    monkeypatch.setattr('datalad_service.common.annex.git_show', mock_git_show)

    result = annex_test_key_remote('/fake/path', key)
    assert result is not None
    assert 'ds000001' in result
    assert 'sub-0475' in result


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
