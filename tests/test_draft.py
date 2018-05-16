import falcon

from .dataset_fixtures import *


def test_add_commit_info(celery_app, client):
    ds_id = 'ds000001'
    file_data = 'Test annotating requests with user info'
    name = 'Test User'
    email = 'user@example.com'
    headers = {
        'From': '"{}" <{}>'.format(name, email)
    }
    response = client.simulate_post(
        '/datasets/{}/files/USER_ADDED_FILE'.format(ds_id), body=file_data, headers=headers)
    assert response.status == falcon.HTTP_OK
    response = client.simulate_post(
        '/datasets/{}/draft'.format(ds_id), body=file_data, headers=headers)
    assert response.status == falcon.HTTP_OK
    response_content = json.loads(response.content)
    assert response_content['name'] == name
    assert response_content['email'] == email
