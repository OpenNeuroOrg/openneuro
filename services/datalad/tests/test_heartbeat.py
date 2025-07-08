import falcon
import json


def test_heartbeat(client):
    doc = {'alive': True}

    response = client.simulate_get('/heartbeat')
    result_doc = json.loads(response.content)

    assert doc == result_doc
    assert response.status == falcon.HTTP_OK
