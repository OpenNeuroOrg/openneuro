import falcon
from falcon import testing

from .dataset_fixtures import *


def test_upload_file_no_auth(client):
    ds_id = 'ds000001'
    upload_id = '5da16a13-6028-4a53-808e-e828f5f280e5'
    file_data = 'Test dataset README'
    response = client.simulate_post(
        '/uploads/1/{}/{}/README'.format(ds_id, upload_id), body=file_data)
    assert response.status == falcon.HTTP_UNAUTHORIZED


def test_upload_file(client, datalad_store):
    ds_id = 'ds000001'
    upload_id = '5da16a13-6028-4a53-808e-e828f5f280e5'
    file_data = 'Test dataset README for new upload'
    response = client.simulate_post(
        '/uploads/1/{}/{}/README'.format(ds_id, upload_id), body=file_data, headers={'cookie': 'accessToken=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJmZDQ0ZjVjNS1iMjFiLTQyMGItOTU1NS1hZjg1NmVmYzk0NTIiLCJlbWFpbCI6Im5lbGxAc3F1aXNoeW1lZGlhLmNvbSIsInByb3ZpZGVyIjoiZ29vZ2xlIiwibmFtZSI6Ik5lbGwgSGFyZGNhc3RsZSIsImFkbWluIjp0cnVlLCJzY29wZXMiOlsiZGF0YXNldDp1cGxvYWQiXSwiZGF0YXNldCI6ImRzMDAwMDAxIiwiaWF0IjoxNTk2NTU4MTU0LCJleHAiOjE1OTcxNjI5NTR9.mx01qqsVEy2hoIXt4LIQHB2RfVOnelaTy23TwXHwMyA'})
    assert response.status == falcon.HTTP_OK
    readme_path = os.path.join(
        datalad_store.get_upload_path(ds_id, upload_id), 'README')
    # Check for the file in the upload bucket
    with open(readme_path) as f:
        assert f.read() == file_data
