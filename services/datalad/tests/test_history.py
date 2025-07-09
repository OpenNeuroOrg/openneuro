import json
import os

import falcon
import pygit2

from datalad_service.handlers.history import HistoryResource


def test_history(client, new_dataset):
    ds_id = os.path.basename(new_dataset.path)
    response = client.simulate_get(f'/datasets/{ds_id}/history')
    assert response.status == falcon.HTTP_OK
    history = json.loads(response.content) if response.content else None
    assert history is not None
    assert len(history['log']) == 4
    for entry in history['log']:
        assert isinstance(entry['authorEmail'], str)
        assert '@' in entry['authorEmail']
        assert isinstance(entry['authorName'], str)
        assert isinstance(entry['date'], int)
        assert isinstance(entry['message'], str)
        assert isinstance(entry['id'], str)
        assert len(entry['id']) == 40
        assert isinstance(entry['references'], str)
        # If there is any references content, check the format
        if len(entry['references']) > 0:
            for ref in entry['references'].split(','):
                # Full references will always have at least "refs" prefixed
                assert len(ref) > 4
                pygit2.reference_is_valid_name(ref)


def test_history_tags(client, new_dataset):
    ds_id = os.path.basename(new_dataset.path)
    # Create a snapshot so we test tag references
    response = client.simulate_post(f'/datasets/{ds_id}/snapshots/1.0.0', body='')
    assert response.status == falcon.HTTP_OK
    response = client.simulate_get(f'/datasets/{ds_id}/history')
    assert response.status == falcon.HTTP_OK
    history = json.loads(response.content) if response.content else None
    assert history is not None
    # Check that most recent history contains the tag reference
    assert history['log'][0]['references'] == 'refs/tags/1.0.0'
    assert len(history['log']) == 5
    for entry in history['log']:
        assert isinstance(entry['authorEmail'], str)
        assert '@' in entry['authorEmail']
        assert isinstance(entry['authorName'], str)
        assert isinstance(entry['date'], int)
        assert isinstance(entry['message'], str)
        assert isinstance(entry['id'], str)
        assert len(entry['id']) == 40
        assert isinstance(entry['references'], str)
        # If there is any references content, check the format
        if len(entry['references']) > 0:
            for ref in entry['references'].split(','):
                # Full references will always have at least "refs" prefixed
                assert len(ref) > 4
                pygit2.reference_is_valid_name(ref)
