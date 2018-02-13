import falcon
import json
import pytest

from .dataset_fixtures import *


def test_get_snapshot(client):
    # The main test dataset has one revision we can fetch
    response = client.simulate_get(
        '/datasets/{}/snapshot/{}'.format(DATASET_ID, SNAPSHOT_ID))
    result_doc = json.loads(response.content, encoding='utf-8')

    assert {'files': ['dataset_description.json']} == result_doc
    assert response.status == falcon.HTTP_OK
