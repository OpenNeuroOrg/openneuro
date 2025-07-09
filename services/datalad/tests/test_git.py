import os
import zlib

import falcon
from falcon import testing
import pygit2

from datalad_service.common import git
from datalad_service.handlers.git import _parse_commit
from datalad.api import Dataset


gzip_compress = zlib.compressobj(9, zlib.DEFLATED, zlib.MAX_WBITS | 16)


test_auth = 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJmZDQ0ZjVjNS1iMjFiLTQyMGItOTU1NS1hZjg1NmVmYzk0NTIiLCJlbWFpbCI6Im5lbGxAc3F1aXNoeW1lZGlhLmNvbSIsInByb3ZpZGVyIjoiZ29vZ2xlIiwibmFtZSI6Ik5lbGwgSGFyZGNhc3RsZSIsImFkbWluIjp0cnVlLCJzY29wZXMiOlsiZGF0YXNldDpnaXQiXSwiZGF0YXNldCI6ImRzMDAwMDAxIiwiaWF0IjoxNjA4NDEwNjEyLCJleHAiOjIxNDc0ODM2NDd9.0aA9cZWMieYr9zbmVrTeFEhpATqmT_X4tVX1VR1uabA'


def test_git_show(new_dataset):
    repo = pygit2.Repository(new_dataset.path)
    assert (
        git.git_show(repo, 'HEAD', 'dataset_description.json')
        == '{"BIDSVersion": "1.0.2", "License": "This is not a real dataset", "Name": "Test fixture new dataset"}'
    )


non_utf8_events = b"""onset	duration	trial_type	stim_file
6	90	Scramble Fix B\xff\xfd\xff\xfd	cond2_run-02.mp4
105	90	Intact A	cond2_run-02.mp4
204	90	Scramble Rnd C V3	cond2_run-02.mp4
303	90	Intact A	cond2_run-02.mp4
402	90	Scramble Fix B	cond2_run-02.mp4
501	90	Scramble Rnd C V4	cond2_run-02.mp4"""


def test_git_show_non_iso_test(new_dataset):
    ds = Dataset(new_dataset.path)
    events_path = os.path.join(ds.path, 'events.tsv')
    with open(events_path, 'wb') as f:
        f.write(non_utf8_events)
    ds.save(events_path)
    ds.close()
    repo = pygit2.Repository(new_dataset.path)
    assert git.git_show(repo, 'HEAD', 'events.tsv') == non_utf8_events.decode('cp852')


dataset_description_4096 = """{
    "Name": "Auditory Tones",
    "BIDSVersion": "1.8.0",
    "DatasetType": "raw",
    "Authors": [
        "Lonike K Faes",
        "Agustin Lage-Castellanos",
        "Giancarlo Valente",
        "Zidan Yu",
        "Martijn A. Cloos",
        "Luca Vizioli",
        "Steen Moeller",
        "Essa Yacoub",
        "Federico De Martino"
    ],
    "Funding": [
        "National Institute of Health grant (RF1MH116978-01)",
        "National Institute of Health grant (P41EB027061)",
        "European Research Council (ERC) under the European Union’s Horizon 2020 research and innovation programme (grant agreement No. 101001270)"
    ]
}""".encode()


def test_git_show_unicode_after_4096(new_dataset):
    ds = Dataset(new_dataset.path)
    desc_path = os.path.join(ds.path, 'dataset_description.json')
    with open(desc_path, 'wb') as f:
        f.write(dataset_description_4096)
    ds.save(desc_path)
    ds.close()
    repo = pygit2.Repository(new_dataset.path)
    assert git.git_show(
        repo, 'HEAD', 'dataset_description.json'
    ) == dataset_description_4096.decode('utf-8')


def test_git_tag(new_dataset):
    repo = pygit2.Repository(new_dataset.path)
    assert git.git_tag(repo) == []
    # Create a tag and check again
    repo.references.create('refs/tags/test-tag', str(repo.head.target))
    assert git.git_tag(repo)[0].name == 'refs/tags/test-tag'


def test_git_refs_resource(client):
    ds_id = 'ds000001'
    response = client.simulate_get(
        f'/git/0/{ds_id}/info/refs?service=git-receive-pack',
        headers={'authorization': test_auth},
    )
    assert response.status == falcon.HTTP_OK
    # A basic check for the terminator sequence at the end
    assert b'0000' == response.content[-4:]
    lines = response.content.decode().split('\n')
    # We expect preamble, three objects, and a 0000 terminator
    assert len(lines) == 6
    assert 'service=git-receive-pack' in lines[0]
    # Check master ref looks right
    assert lines[3][0:4] == '003d'
    assert lines[3][4:44].isalnum()  # 40 character sha256
    assert lines[3][44] == ' '  # delimiter
    assert lines[3][45:] == 'refs/heads/main'


def test_git_upload_resource(client):
    ds_id = 'ds000001'
    get_response = client.simulate_get(
        f'/git/0/{ds_id}/info/refs?service=git-upload-pack',
        headers={'authorization': test_auth},
    )
    lines = get_response.content.decode().split('\n')
    # Grab two refs to ask for
    annex = lines[2][4:44]
    head = lines[3][4:44]
    upload_pack_input = '0032want {}\n0032want {}\n00000009done\n'.format(head, annex)
    # Ask for them
    response = client.simulate_post(
        f'/git/0/{ds_id}/git-upload-pack',
        headers={'authorization': test_auth},
        body=upload_pack_input,
    )
    assert response.status == falcon.HTTP_OK
    # Just look for the start of a pack stream
    assert response.content[0:12] == b'0008NAK\nPACK'


def test_git_upload_resource_gzip(client):
    ds_id = 'ds000001'
    get_response = client.simulate_get(
        f'/git/0/{ds_id}/info/refs?service=git-upload-pack',
        headers={'authorization': test_auth},
    )
    lines = get_response.content.decode().split('\n')
    # Grab two refs to ask for
    annex = lines[2][4:44]
    head = lines[3][4:44]
    upload_pack_input = '0032want {}\n0032want {}\n00000009done\n'.format(head, annex)
    gzipped_input = (
        gzip_compress.compress(upload_pack_input.encode()) + gzip_compress.flush()
    )
    # Ask for them
    response = client.simulate_post(
        f'/git/0/{ds_id}/git-upload-pack',
        headers={'authorization': test_auth, 'content-encoding': 'gzip'},
        body=gzipped_input,
    )
    assert response.status == falcon.HTTP_OK
    # Just look for the start of a pack stream
    assert response.content[0:12] == b'0008NAK\nPACK'


def test_git_receive_resource(client):
    ds_id = 'ds000001'
    get_response = client.simulate_get(
        f'/git/0/{ds_id}/info/refs?service=git-upload-pack',
        headers={'authorization': test_auth},
    )
    lines = get_response.content.decode().split('\n')
    # Just try a noop push to avoid changing the test dataset
    receive_pack_input = '0000'
    response = client.simulate_post(
        f'/git/0/{ds_id}/git-receive-pack',
        headers={'authorization': test_auth},
        body=receive_pack_input,
    )
    assert response.status == falcon.HTTP_OK


def test_parse_commit():
    noop = b'0000'
    single = b'00677d1665144a3a975c05f1f43902ddaf084e784dbe 74730d410fcb6603ace96f1dc55ea6196122532d refs/heads/debug\x00 report-status-v20000PACK\x00\x00\x00\x02'
    multiple = b'00677d1665144a3a975c05f1f43902ddaf084e784dbe 74730d410fcb6603ace96f1dc55ea6196122532d refs/heads/debug\n006874730d410fcb6603ace96f1dc55ea6196122532d 5a3f6be755bbb7deae50065988cbfa1ffa9ab68a refs/heads/master\n0000\nextra data\n'
    assert _parse_commit(noop) == []
    assert _parse_commit(single) == [
        ('74730d410fcb6603ace96f1dc55ea6196122532d', 'refs/heads/debug')
    ]
    assert _parse_commit(multiple) == [
        ('74730d410fcb6603ace96f1dc55ea6196122532d', 'refs/heads/debug'),
        ('5a3f6be755bbb7deae50065988cbfa1ffa9ab68a', 'refs/heads/master'),
    ]


def test_git_tag_tree(new_dataset):
    tag = '1.0.0'
    repo = pygit2.Repository(new_dataset.path)
    # Create a tag
    repo.references.create(f'refs/tags/{tag}', str(repo.head.target))
    assert git.git_tag_tree(repo, tag) == repo.get(repo.head.target).tree_id


def test_git_tree(new_dataset):
    repo = pygit2.Repository(new_dataset.path)
    tree = git.git_tree(repo, str(repo.head.target), 'dataset_description.json')
    assert tree.id == repo.get(repo.head.target).tree_id
