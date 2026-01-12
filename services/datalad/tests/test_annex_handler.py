import falcon
from falcon import testing

from datalad_service.handlers.annex import hashdirmixed, key_to_path


test_auth = 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJmZDQ0ZjVjNS1iMjFiLTQyMGItOTU1NS1hZjg1NmVmYzk0NTIiLCJlbWFpbCI6Im5lbGxAc3F1aXNoeW1lZGlhLmNvbSIsInByb3ZpZGVyIjoiZ29vZ2xlIiwibmFtZSI6Ik5lbGwgSGFyZGNhc3RsZSIsImFkbWluIjp0cnVlLCJzY29wZXMiOlsiZGF0YXNldDpnaXQ6d3JpdGUiLCJkYXRhc2V0OmdpdDpyZWFkIl0sImRhdGFzZXQiOiJkczAwMDAwMSIsImlhdCI6MTYwODQxMDYxMiwiZXhwIjoyMTQ3NDgzNjQ3fQ.UctrTJ7OKNRpEMftzhFIMmTkjYDDYl1zrSsNxhtNeO0'


def test_hashdirmixed():
    assert hashdirmixed('MD5E-s311112--bc8bbbacfd2ff823c2047ead1afec9b3.nii.gz') == (
        'z0',
        'fG',
    )


def test_key_to_path():
    assert (
        key_to_path('MD5E-s311112--bc8bbbacfd2ff823c2047ead1afec9b3.nii.gz')
        == '.git/annex/objects/z0/fG/MD5E-s311112--bc8bbbacfd2ff823c2047ead1afec9b3.nii.gz/MD5E-s311112--bc8bbbacfd2ff823c2047ead1afec9b3.nii.gz'
    )


def test_key_add_remove(client):
    ds_id = 'ds000001'
    key = 'MD5E-s24--e04bb0391ed06622b018aac26c736870.nii'
    random_value = b'ooQuieshaz4of2Aip3Niec2e'
    url = f'/git/0/{ds_id}/annex/{key}'
    response = client.simulate_post(
        url, headers={'authorization': test_auth}, body=random_value
    )
    assert response.status == falcon.HTTP_OK
    response = client.simulate_get(url, headers={'authorization': test_auth})
    assert response.status == falcon.HTTP_OK
    assert response.content == random_value


def test_key_get_head(client):
    ds_id = 'ds000001'
    key = 'MD5E-s24--00e7097e83570b24b69cc509fc8f3cbf.nii'
    random_value = b'soo2aid1po5teiJoowufah4i'
    url = f'/git/0/{ds_id}/annex/{key}'
    # Test failure first
    response = client.simulate_head(url, headers={'authorization': test_auth})
    assert response.status == falcon.HTTP_NOT_FOUND
    # Add file and check again
    response = client.simulate_post(
        url, headers={'authorization': test_auth}, body=random_value
    )
    assert response.status == falcon.HTTP_OK
    response = client.simulate_head(url, headers={'authorization': test_auth})
    assert response.status == falcon.HTTP_OK
