import falcon
import jwt
import os

from .dataset_fixtures import *


def test_add_commit_info(celery_app, client):
    ds_id = 'ds000001'
    file_data = 'Test annotating requests with user info'
    name = 'Test User'
    email = 'user@example.com'
    user = {
        'name': name,
        'email': email,
        'sub': '123456',
        'admin': False
    }
    jwt_secret = 'shhhhh'
    os.environ['JWT_SECRET'] = jwt_secret
    access_token = jwt.encode(user, jwt_secret).decode('utf-8')
    cookie = 'accessToken={}'.format(access_token)
    headers = {
        'Cookie': cookie
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


def test_is_dirty(celery_app, client, new_dataset):
    ds_id = os.path.basename(new_dataset.path)
    # Check if new_dataset is not dirty
    response = client.simulate_get(
        '/datasets/{}/draft'.format(ds_id))
    assert response.status == falcon.HTTP_OK
    assert json.loads(response.content)['partial'] == False
    # Make the dataset dirty
    response = client.simulate_post(
        '/datasets/{}/files/NEW_FILE'.format(ds_id), body='some file data')
    assert response.status == falcon.HTTP_OK
    # Check if partial state is now true
    response = client.simulate_get(
        '/datasets/{}/draft'.format(ds_id))
    assert response.status == falcon.HTTP_OK
    assert json.loads(response.content)['partial'] == True
