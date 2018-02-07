import falcon
from falcon import testing
import json
import pytest
from datalad.api import Dataset

from datalad_server.app import create_app

DATASET_ID = 'ds000001'


@pytest.fixture(scope='session')
def annex_path(tmpdir_factory):
    path = tmpdir_factory.mktemp('annexes')
    ds_path = path.join(DATASET_ID)
    # Create an empty dataset for testing
    ds = Dataset(str(ds_path))
    ds.create()
    return path


@pytest.fixture
def client(annex_path):
    return testing.TestClient(create_app(annex_path))


def test_get_dataset(client):
    doc = {
        'accession_number': DATASET_ID
    }

    response = client.simulate_get('/datasets/{}'.format(DATASET_ID))
    result_doc = json.loads(response.content, encoding='utf-8')

    assert doc == result_doc
    assert response.status == falcon.HTTP_OK


def test_get_dataset_404(client):
    response = client.simulate_get('/datasets/dsdoesntexist')
    assert response.status == falcon.HTTP_NOT_FOUND
