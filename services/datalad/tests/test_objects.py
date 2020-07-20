import falcon
from falcon import testing
import json
import pytest
from datalad.api import Dataset

from .dataset_fixtures import *
from datalad_service.handlers.objects import annex_key_to_path


def test_annex_key_to_path():
    key = 'MD5E-s19--8149926e49b677a5ccecf1ad565acccf.nii.gz'
    assert annex_key_to_path(key) == '5p/Vk'


def test_get_git_object(client):
    ds_id = 'ds000001'
    result = client.simulate_get(
        '/datasets/{}/objects/85b9ddf2bfaf1d9300d612dc29774a98cc1d5e25'.format(ds_id), file_wrapper=FileWrapper)
    content_len = int(result.headers['content-length'])
    assert content_len == len(result.content)
    assert json.loads(result.content)['BIDSVersion'] == '1.0.2'


def test_get_annexed_object(client):
    ds_id = 'ds000001'
    result = client.simulate_get(
        '/datasets/{}/objects/MD5E-s19--8149926e49b677a5ccecf1ad565acccf.nii.gz'.format(ds_id), file_wrapper=FileWrapper)
    content_len = int(result.headers['content-length'])
    assert content_len == len(result.content)


def test_no_object_provided(client):
    ds_id = 'ds000001'
    result = client.simulate_get(
        '/datasets/{}/objects/'.format(ds_id)
    )
    assert result.content == b'{"error": "no file key was provided"}'


def test_object_doesnt_exist(client):
    ds_id = 'ds000001'
    result = client.simulate_get(
        '/datasets/{}/objects/this_doesnt_exist'.format(ds_id)
    )
    assert result.content == b'{"error": "file not found"}'
