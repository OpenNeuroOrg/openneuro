import falcon
from falcon import testing
import json
import pytest
from datalad.api import Dataset

from datalad_server.app import create_app
from .dataset_fixtures import *


def test_add_file(client, annex_path):
    ds_id = 'ds000001'
    file_data = 'Test dataset README'
    response = client.simulate_post(
        '/datasets/{}/files/README'.format(ds_id), body=file_data)
    assert response.status == falcon.HTTP_OK
    # Load the dataset to check for this file
    ds_obj = Dataset(str(annex_path.join(ds_id)))
    test_files = ds_obj.get('README')
    assert test_files
    assert len(test_files) == 1
    with open(test_files.pop()['path']) as f:
        assert f.read() == file_data
