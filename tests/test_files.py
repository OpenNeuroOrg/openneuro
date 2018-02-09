import falcon
from falcon import testing
import json
import pytest
from datalad.api import Dataset

from datalad_server.app import create_app
from .dataset_fixtures import *


def test_add_file(client, annex_path):
    ds_id = 'ds000002'
    file_data = 'Test dataset README'
    response = client.simulate_post('/datasets/{}/files/README'.format(ds_id), body=file_data)
    assert response.status == falcon.HTTP_OK
    #assert Dataset(str(annex_path.join(ds_id))).repo is not None
