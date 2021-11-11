import falcon
import json
import pygit2

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
    for entry in history["log"]:
        assert isinstance(entry["authorEmail"], str)
        assert '@' in entry["authorEmail"]
        assert isinstance(entry["authorName"], str)
        assert isinstance(entry["date"], int)
        assert isinstance(entry["message"], str)
        assert isinstance(entry["id"], str)
        assert len(entry["id"]) == 40
        assert isinstance(entry["references"], str)
        # If there is any references content, check the format
        if (len(entry["references"]) > 0):
            for ref in entry["references"].split(','):
                # Full references will always have at least "refs" prefixed
                assert len(ref) > 4
                pygit2.reference_is_valid_name(ref)
