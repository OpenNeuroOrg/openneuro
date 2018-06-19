import falcon
from falcon import testing
import json
import pytest
from datalad.api import Dataset

from .dataset_fixtures import *


def test_get_git_object(client, celery_app):
    ds_id = 'ds000001'
    result = client.simulate_get(
        '/datasets/{}/objects/85b9ddf2bfaf1d9300d612dc29774a98cc1d5e25'.format(ds_id), file_wrapper=FileWrapper)
    content_len = int(result.headers['content-length'])
    print(result.content)
    assert content_len == len(result.content)
    assert json.loads(result.content)['BIDSVersion'] == '1.0.2'

def test_get_annexed_object(client, celery_app):
    ds_id = 'ds000001'
    result = client.simulate_get(
        '/datasets/{}/objects/MD5E-s19--8149926e49b677a5ccecf1ad565acccf.nii.gz'.format(ds_id), file_wrapper=FileWrapper)
    content_len = int(result.headers['content-length'])
    print(result)
    assert content_len == len(result.content)