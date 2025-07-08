import falcon
import pytest
import os
import json


def test_update(client, new_dataset):
    key = 'Name'
    value = 'Guthrum'
    body = json.dumps({'description_fields': {key: value}})

    ds_id = os.path.basename(new_dataset.path)
    update_response = client.simulate_post(f'/datasets/{ds_id}/description', body=body)
    assert update_response.status == falcon.HTTP_OK
    updated_ds = (
        json.loads(update_response.content) if update_response.content else None
    )
    assert updated_ds is not None

    check_response = client.simulate_get(
        f'/datasets/{ds_id}/files/dataset_description.json'
    )
    assert check_response.status == falcon.HTTP_OK
    ds_description = json.loads(check_response.content)
    assert ds_description[key] == value


def post_and_check_description(
    client, new_dataset, base_description, key='Name', value='Guthrum'
):
    body = json.dumps({'description_fields': {key: value}})

    ds_id = os.path.basename(new_dataset.path)
    update_response = client.simulate_post(
        f'/datasets/{ds_id}/files/dataset_description.json', body=base_description
    )
    assert update_response.status == falcon.HTTP_OK
    # Commit files
    response = client.simulate_post(
        f'/datasets/{ds_id}/draft', params={'validate': 'false'}
    )
    assert response.status == falcon.HTTP_OK

    update_response = client.simulate_post(f'/datasets/{ds_id}/description', body=body)
    assert update_response.status == falcon.HTTP_OK
    updated_ds = (
        json.loads(update_response.content) if update_response.content else None
    )
    assert updated_ds is not None

    check_response = client.simulate_get(
        f'/datasets/{ds_id}/files/dataset_description.json'
    )
    assert check_response.status == falcon.HTTP_OK
    return check_response.content


def test_update_with_trailing_newline(client, new_dataset):
    base_description = '{ "json stuff": "True", "Name": "Uhtred" }\n'
    content = post_and_check_description(client, new_dataset, base_description)
    ds_description = json.loads(content)
    assert ds_description['Name'] == 'Guthrum'


def test_update_with_trailing_double_newline(client, new_dataset):
    base_description = '{ "json stuff": "True", "Name": "Uhtred" }\n\n'
    content = post_and_check_description(client, new_dataset, base_description)
    ds_description = json.loads(content)
    assert ds_description['Name'] == 'Guthrum'


def test_update_with_trailing_windows_newline(client, new_dataset):
    base_description = '{ "json stuff": "True", "Name": "Uhtred" }\r\n'
    content = post_and_check_description(client, new_dataset, base_description)
    ds_description = json.loads(content)
    assert ds_description['Name'] == 'Guthrum'


def test_update_with_trailing_mac_newline(client, new_dataset):
    base_description = '{ "json stuff": "True", "Name": "Uhtred" }\r'
    content = post_and_check_description(client, new_dataset, base_description)
    ds_description = json.loads(content)
    assert ds_description['Name'] == 'Guthrum'


def test_update_with_trailing_wat_newline(client, new_dataset):
    base_description = '{ "json stuff": "True", "Name": "Uhtred" }\n\r'
    content = post_and_check_description(client, new_dataset, base_description)
    ds_description = json.loads(content)
    assert ds_description['Name'] == 'Guthrum'


def test_update_with_unicode_characters(client, new_dataset):
    base_description = (
        '{ "json stuff": "True", "Name": "Uhtred", "Authors": ["香母酢"] }\n'
    )
    content = post_and_check_description(
        client, new_dataset, base_description, 'Name', '柴犬'
    ).decode()
    # Verify that escaped characters did not make it into the file
    assert '\\u67f4' not in content
    assert '\\u72ac' not in content
    ds_description = json.loads(content)
    assert ds_description['Authors'][0] == '香母酢'


def test_description_formatting(client, new_dataset):
    key = 'Name'
    value = 'Guthrum'
    body = json.dumps({'description_fields': {key: value}})

    ds_id = os.path.basename(new_dataset.path)
    update_response = client.simulate_post(f'/datasets/{ds_id}/description', body=body)
    assert update_response.status == falcon.HTTP_OK
    updated_ds = (
        json.loads(update_response.content) if update_response.content else None
    )
    assert updated_ds is not None

    check_response = client.simulate_get(
        f'/datasets/{ds_id}/files/dataset_description.json'
    )
    assert check_response.status == falcon.HTTP_OK
    decoded_response = check_response.content.decode('utf-8')
    # Verify the 4 space indent in the encoded file
    assert decoded_response[:6] == '{\n    '
    assert decoded_response[6] != ' '
