import json
import os

import falcon
import pygit2


def test_info(client, new_dataset):
    ds_id = os.path.basename(new_dataset.path)
    response = client.simulate_get(f'/datasets/{ds_id}/info')
    assert response.status == falcon.HTTP_OK
    info = json.loads(response.content) if response.content else None
    assert info is not None
    assert info['success'] is True
    assert info['annexed files in working tree'] == 0
    assert info['local annex keys'] == 0


def test_info_tag(client, new_dataset):
    ds_id = os.path.basename(new_dataset.path)
    # Create a snapshot so we test tag reference
    response = client.simulate_post(f'/datasets/{ds_id}/snapshots/1.0.0', body='')
    assert response.status == falcon.HTTP_OK
    response = client.simulate_get(f'/datasets/{ds_id}/info/1.0.0')
    assert response.status == falcon.HTTP_OK
    info = json.loads(response.content) if response.content else None
    assert info is not None
    assert info['success'] is True
    assert info['tree'] == '1.0.0'
    assert info['local annex keys'] == 0
