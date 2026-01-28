import os
import json
import uuid

import falcon
from datalad.api import Dataset
import pygit2

from datalad_service.tasks.snapshots import write_new_changes
from datalad_service.common.git import git_show, git_show_content


def test_get_snapshot(client):
    # The main test dataset has one revision we can fetch
    response = client.simulate_get(
        '/datasets/{}/snapshots/{}'.format('ds000001', '000001')
    )
    result_doc = json.loads(response.content)
    assert response.status == falcon.HTTP_OK
    assert result_doc['tag'] == '000001'
    assert result_doc['id'] == '{}:{}'.format('ds000001', '000001')
    assert type(result_doc['created']) == int
    assert type(result_doc['hexsha']) == str
    assert len(result_doc['hexsha']) == 40


def test_create_snapshot(client, new_dataset):
    ds_id = os.path.basename(new_dataset.path)
    snapshot_id = '1'
    response = client.simulate_post(
        f'/datasets/{ds_id}/snapshots/{snapshot_id}', body=''
    )
    assert response.status == falcon.HTTP_OK


def test_create_snapshot_no_config(datalad_store, client, new_dataset):
    """Validate adding a datalad config if one is missing during snapshot creation"""
    ds_id = os.path.basename(new_dataset.path)
    snapshot_id = '1'
    # Delete the default config first
    response = client.simulate_delete(
        '/datasets/{}/files'.format(ds_id), body='{ "filenames": [".datalad/config"] }'
    )
    assert response.status == falcon.HTTP_OK
    assert json.loads(response.content)['deleted'] == ['.datalad/config']
    ds = Dataset(os.path.join(datalad_store.annex_path, ds_id))
    assert ds.id is None
    ds.close()
    # Try to snapshot now
    response = client.simulate_post(
        f'/datasets/{ds_id}/snapshots/{snapshot_id}', body=''
    )
    assert response.status == falcon.HTTP_OK
    # Verify the dataset now has an ID
    ds = Dataset(os.path.join(datalad_store.annex_path, ds_id))
    assert ds.id is not None
    try:
        uuid.UUID(ds.id, version=4)
    except ValueError:
        assert False, 'datalad id is not a valid uuid4'


def test_pre_snapshot_edit(client, new_dataset):
    ds_id = os.path.basename(new_dataset.path)
    snapshot_id = '1.0.0'
    file_data = json.dumps(
        {'BIDSVersion': '1.0.2', 'License': 'CC0', 'Name': 'Test fixture new dataset'},
        indent=4,
    )
    # Update a file
    response = client.simulate_post(
        f'/datasets/{ds_id}/files/dataset_description.json', body=file_data
    )
    assert response.status == falcon.HTTP_OK
    # Commit changes
    response = client.simulate_post(
        f'/datasets/{ds_id}/draft', params={'validate': 'false'}
    )
    assert response.status == falcon.HTTP_OK
    commit_ref = response.json['ref']
    # Make a snapshot
    response = client.simulate_post(
        f'/datasets/{ds_id}/snapshots/{snapshot_id}', json={'skip_publishing': True}
    )
    assert response.status == falcon.HTTP_OK
    # Validate that create_snapshot has not moved main commit
    with open(os.path.join(new_dataset.path, '.git/refs/heads/main')) as fd:
        current_ref = fd.read()[:-1]
        assert commit_ref == current_ref


def test_duplicate_snapshot(client, new_dataset):
    ds_id = os.path.basename(new_dataset.path)
    snapshot_id = '2'
    # body = json.dumps({
    #     'snapshot_changes': ['test']
    # })
    response = client.simulate_post(f'/datasets/{ds_id}/snapshots/{snapshot_id}')
    assert response.status == falcon.HTTP_OK
    try:
        response = client.simulate_post(f'/datasets/{ds_id}/snapshots/{snapshot_id}')
        assert response.status == falcon.HTTP_CONFLICT
    except:
        # In eager mode, eat the exception
        pass


def test_get_snapshots(client, new_dataset):
    ds_id = os.path.basename(new_dataset.path)
    # body = json.dumps({
    #     'snapshot_changes': ['test']
    # })
    response = client.simulate_post('/datasets/{}/snapshots/{}'.format(ds_id, 'v1.0.0'))
    assert response.status == falcon.HTTP_OK
    response = client.simulate_post('/datasets/{}/snapshots/{}'.format(ds_id, 'v2.0.0'))
    assert response.status == falcon.HTTP_OK
    response = client.simulate_get(f'/datasets/{ds_id}/snapshots')
    result_doc = json.loads(response.content)
    assert response.status == falcon.HTTP_OK
    assert result_doc['snapshots'][0]['hexsha'] == result_doc['snapshots'][1]['hexsha']
    assert result_doc['snapshots'][0]['id'] == '{}:{}'.format(ds_id, 'v1.0.0')
    assert result_doc['snapshots'][0]['tag'] == 'v1.0.0'
    assert result_doc['snapshots'][1]['tag'] == 'v2.0.0'


def test_description_update(client, new_dataset):
    key = 'ReferencesAndLinks'
    value = ['https://www.wikipedia.org']
    body = json.dumps(
        {
            'description_fields': {key: value},
            'snapshot_changes': ['change'],
            'skip_publishing': True,
        }
    )

    ds_id = os.path.basename(new_dataset.path)
    update_response = client.simulate_post(
        '/datasets/{}/snapshots/{}'.format(ds_id, 'v1.0.0'), body=body
    )
    assert update_response.status == falcon.HTTP_OK

    check_response = client.simulate_get(
        f'/datasets/{ds_id}/files/dataset_description.json'
    )
    assert check_response.status == falcon.HTTP_OK
    ds_description = json.loads(check_response.content)
    assert ds_description[key] == value


async def test_write_new_changes(datalad_store, new_dataset):
    ds_id = os.path.basename(new_dataset.path)
    await write_new_changes(new_dataset.path, '1.0.1', ['Some changes'], '2019-01-01')
    # Manually make the commit without validation
    new_dataset.save('CHANGES')
    # Get a fresh dataset object and verify correct CHANGES
    dataset = Dataset(os.path.join(datalad_store.annex_path, ds_id))
    assert not dataset.repo.dirty
    repo = datalad_store.get_dataset_repo(ds_id)
    assert (
        git_show(repo, 'HEAD', 'CHANGES')
        == """1.0.1 2019-01-01
  - Some changes
1.0.0 2018-01-01
  - Initial version
"""
    )


async def test_write_with_empty_changes(datalad_store, new_dataset):
    ds_id = os.path.basename(new_dataset.path)
    new_dataset.remove('CHANGES')
    await write_new_changes(new_dataset.path, '1.0.1', ['Some changes'], '2019-01-01')
    # Manually make the commit without validation
    new_dataset.save('CHANGES')
    # Get a fresh dataset object and verify correct CHANGES
    dataset = Dataset(os.path.join(datalad_store.annex_path, ds_id))
    assert not dataset.repo.dirty
    repo = datalad_store.get_dataset_repo(ds_id)
    assert (
        git_show(repo, 'HEAD', 'CHANGES')
        == """1.0.1 2019-01-01
  - Some changes
"""
    )


async def test_annexed_changes_snapshot_update(client, new_dataset, datalad_store):
    """
    Tests creating a snapshot when CHANGES is an annexed file.
    1. Modify .gitattributes to make CHANGES annexable and commit.
    2. Use git-annex add to make CHANGES an annexed symlink and commit.
    3. Create a snapshot via API, which updates CHANGES.
    4. Verify CHANGES is still annexed and its content is updated in the snapshot.
    """
    ds_id = os.path.basename(new_dataset.path)
    dataset_path = new_dataset.path

    # Get initial CHANGES content from the fixture-created file
    initial_changes_content = new_dataset.pathobj.joinpath('CHANGES').read_text()

    gitattributes_path = new_dataset.pathobj.joinpath('.gitattributes')
    gitattributes_path.write_text(
        '* annex.backend=SHA256E\n* annex.largefiles=nothing\nCHANGES annex.largefiles=anything\n'
    )

    # Convert CHANGES to an annexed file
    new_dataset.repo.call_git(['rm', '--cached', 'CHANGES'])
    new_dataset.repo.call_annex(['add', '.gitattributes', 'CHANGES'])

    # Commit the annexed CHANGES file
    new_dataset.save(message='Annex CHANGES file (now a symlink)')

    # Verify CHANGES is now a symlink (annexed) in the working tree
    assert os.path.islink(os.path.join(dataset_path, 'CHANGES')), (
        'CHANGES file was not annexed as expected before snapshot.'
    )

    # Define snapshot details
    snapshot_tag = '1.1.0'
    snapshot_desc_fields = {'Name': 'Dataset with Annexed CHANGES'}
    snapshot_changes_list = ['A new entry for the annexed CHANGES file.']

    # Create the snapshot
    async with client as conductor:
        response = await conductor.simulate_post(
            f'/datasets/{ds_id}/snapshots/{snapshot_tag}',
            json={
                'description_fields': snapshot_desc_fields,
                'snapshot_changes': snapshot_changes_list,
                'skip_publishing': True,
            },
        )
        assert response.status == falcon.HTTP_OK, (
            f'Snapshot creation failed: {response.text}'
        )
        created_snapshot_data = response.json
        snapshot_hexsha = created_snapshot_data['hexsha']

    # Verify the CHANGES file in the created snapshot
    repo = datalad_store.get_dataset_repo(ds_id)
    commit = repo.revparse_single(snapshot_hexsha)

    # Check if CHANGES is still a symlink (annexed)
    changes_entry = commit.tree['CHANGES']
    assert changes_entry.filemode == pygit2.GIT_FILEMODE_LINK, (
        'CHANGES file is not a symlink in the snapshot commit.'
    )

    # Verify the content of CHANGES
    actual_changes_content, size = await git_show_content(
        repo, snapshot_hexsha, 'CHANGES'
    )
    lines_list = (
        b''.join([chunk async for chunk in actual_changes_content])
        .decode()
        .splitlines()
    )

    assert lines_list[0].startswith(snapshot_tag)
    assert lines_list[1].strip() == f'- {snapshot_changes_list[0]}'
    expected_initial_part_in_snapshot = initial_changes_content.strip()
    actual_initial_part_in_snapshot = '\n'.join(lines_list[2:]).strip()
    assert actual_initial_part_in_snapshot == expected_initial_part_in_snapshot, (
        'Initial CHANGES content not preserved correctly in snapshot.'
    )


async def test_annexed_description_snapshot_update(client, new_dataset, datalad_store):
    """
    Tests creating a snapshot when dataset_description.json is an annexed file.
    """
    ds_id = os.path.basename(new_dataset.path)
    dataset_path = new_dataset.path

    # Get initial dataset_description.json content
    initial_description_path = new_dataset.pathobj.joinpath('dataset_description.json')
    initial_description_content = json.loads(initial_description_path.read_text())

    gitattributes_path = new_dataset.pathobj.joinpath('.gitattributes')
    # Ensure other BIDS metadata files are not annexed by default, then add rule for dataset_description.json
    gitattributes_path.write_text(
        '* annex.backend=SHA256E\n* annex.largefiles=nothing\ndataset_description.json annex.largefiles=anything\n'
    )

    # Convert dataset_description.json to an annexed file
    new_dataset.repo.call_git(['rm', '--cached', 'dataset_description.json'])
    new_dataset.repo.call_annex(['add', '.gitattributes', 'dataset_description.json'])

    # Commit the annexed dataset_description.json file
    new_dataset.save(message='Annex dataset_description.json file (now a symlink)')

    # Verify dataset_description.json is now a symlink (annexed) in the working tree
    assert os.path.islink(os.path.join(dataset_path, 'dataset_description.json')), (
        'dataset_description.json file was not annexed as expected before snapshot.'
    )

    # Define snapshot details
    snapshot_tag = '1.1.0'
    updated_name = 'Dataset with Annexed Description'
    snapshot_desc_fields = {'Name': updated_name}
    snapshot_changes_list = ['Updated dataset_description.json while it was annexed.']

    # Create the snapshot
    async with client as conductor:
        response = await conductor.simulate_post(
            f'/datasets/{ds_id}/snapshots/{snapshot_tag}',
            json={
                'description_fields': snapshot_desc_fields,
                'snapshot_changes': snapshot_changes_list,
                'skip_publishing': True,
            },
        )
        assert response.status == falcon.HTTP_OK, (
            f'Snapshot creation failed: {response.text}'
        )
        created_snapshot_data = response.json
        snapshot_hexsha = created_snapshot_data['hexsha']

    # Verify the dataset_description.json file in the created snapshot
    repo = datalad_store.get_dataset_repo(ds_id)
    commit = repo.revparse_single(snapshot_hexsha)

    # Check if dataset_description.json is still a symlink (annexed)
    description_entry = commit.tree['dataset_description.json']
    assert description_entry.filemode == pygit2.GIT_FILEMODE_LINK, (
        'dataset_description.json file is not a symlink in the snapshot commit.'
    )

    # Verify the content of dataset_description.json
    actual_description_content_stream, size = await git_show_content(
        repo, snapshot_hexsha, 'dataset_description.json'
    )
    actual_description_content_bytes = b''.join(
        [chunk async for chunk in actual_description_content_stream]
    )
    actual_description_data = json.loads(actual_description_content_bytes.decode())

    assert actual_description_data['Name'] == updated_name, (
        'Dataset Name not updated correctly in annexed description.'
    )
    # Check if other fields from the initial description are preserved
    for key, value in initial_description_content.items():
        if (
            key != 'Name' and key != 'License'
        ):  # The field we explicitly updated and LICENSE (updated automatically)
            assert actual_description_data.get(key) == value, (
                f"Field '{key}' from initial description not preserved correctly."
            )
