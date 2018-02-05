import falcon
from falcon import testing
import json
import pytest

from datalad_server.app import api

@pytest.fixture
def client():
    return testing.TestClient(api)

def test_heartbeat(client):
  doc = {
    'alive': True
  }

  response = client.simulate_get('/heartbeat')
  result_doc = json.loads(response.content, encoding='utf-8')

  assert doc == result_doc
  assert response.status == falcon.HTTP_OK
