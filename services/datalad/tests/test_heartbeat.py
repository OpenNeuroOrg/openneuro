import falcon
from falcon import testing
import json
import pytest

from datalad_service.app import create_app


@pytest.fixture
def client():
    return testing.TestClient(create_app(''))


def test_heartbeat(client):
    doc = {
        'alive': True
    }

    response = client.simulate_get('/heartbeat')
    result_doc = json.loads(response.content)

    assert doc == result_doc
    assert response.status == falcon.HTTP_OK
