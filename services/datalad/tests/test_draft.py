import os

import falcon
import json
import jwt


def test_add_commit_info(client):
    ds_id = 'ds000001'
    file_data = 'Test annotating requests with user info'
    name = 'Test User'
    email = 'user@example.com'
    user = {'name': name, 'email': email, 'sub': '123456', 'admin': False}
    jwt_secret = 'shhhhh'
    os.environ['JWT_SECRET'] = jwt_secret
    access_token = jwt.encode(user, jwt_secret)
    cookie = f'accessToken={access_token}'
    headers = {'Cookie': cookie}
    response = client.simulate_post(
        f'/datasets/{ds_id}/files/USER_ADDED_FILE', body=file_data, headers=headers
    )
    assert response.status == falcon.HTTP_OK
    response = client.simulate_post(
        f'/datasets/{ds_id}/draft', body=file_data, headers=headers
    )
    assert response.status == falcon.HTTP_OK
    response_content = json.loads(response.content)
    assert response_content['name'] == name
    assert response_content['email'] == email


def test_get_draft(client, new_dataset):
    ds_id = os.path.basename(new_dataset.path)
    # Check if new_dataset is not dirty
    response = client.simulate_get(f'/datasets/{ds_id}/draft')
    assert response.status == falcon.HTTP_OK
    assert len(json.loads(response.content)['hexsha']) == 40
