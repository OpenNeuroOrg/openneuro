import falcon
import json

from .dataset_fixtures import *
from datalad_service.handlers.history import HistoryResource


def test_history(client):
    response = client.simulate_get(
        '/datasets/{}/history'.format('ds000001'))
    assert response.status == falcon.HTTP_OK
    history = json.loads(
        response.content) if response.content else None
    assert history is not None
    assert len(history["log"]) == 4