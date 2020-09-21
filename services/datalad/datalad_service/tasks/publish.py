import requests
import subprocess
from datalad.api import create_sibling_github

from datalad_service.config import DATALAD_GITHUB_ORG
from datalad_service.config import DATALAD_GITHUB_LOGIN
from datalad_service.config import DATALAD_GITHUB_PASS
from datalad_service.config import DATALAD_GITHUB_EXPORTS_ENABLED
from datalad_service.config import GRAPHQL_ENDPOINT
from datalad_service.config import AWS_ACCESS_KEY_ID
from datalad_service.config import AWS_SECRET_ACCESS_KEY
import datalad_service.common.s3
from datalad_service.common.s3 import DatasetRealm, s3_export, get_s3_realm
from datalad_service.common.s3 import validate_s3_config, update_s3_sibling

import boto3
from github import Github

def create_github_repo(dataset, repo_name):
    """Setup a github sibling / remote."""
    try:
        # raise exception if github exports are not enabled
        if not DATALAD_GITHUB_EXPORTS_ENABLED:
            raise Exception(
                'DATALAD_GITHUB_EXPORTS_ENABLED must be defined to create remote repos')

        # this adds github remote to config and also creates repo
        return create_sibling_github(repo_name,
                                     github_login=DATALAD_GITHUB_LOGIN,
                                     github_passwd=DATALAD_GITHUB_PASS,
                                     github_organization=DATALAD_GITHUB_ORG,
                                     dataset=dataset,
                                     access_protocol='ssh')
    except KeyError:
        raise Exception(
            'DATALAD_GITHUB_LOGIN, DATALAD_GITHUB_PASS, and DATALAD_GITHUB_ORG must be defined to create remote repos')


def get_sibling_by_name(name, siblings):
    return any(
        filter(lambda sibling: sibling['name'] == name, siblings)
    )


def github_sibling(ds, repo_name, siblings):
    """
    Find a GitHub remote or create a new repo and configure the remote.
    """
    sibling = get_sibling_by_name('github', siblings)
    if not sibling:
        create_github_repo(ds, repo_name)
    return sibling


def s3_sibling(dataset, siblings, realm=DatasetRealm.PRIVATE):
    """
    Setup a special remote for a versioned S3 remote.

    The bucket must already exist and be configured.
    """
    sibling = get_sibling_by_name(realm.s3_remote, siblings)
    if not sibling:
        datalad_service.common.s3.setup_s3_sibling(dataset, realm)
    return sibling


def github_export(dataset, target):
    """
    Publish GitHub repo and tags.
    """
    dataset.publish(to=target)
    gitProcess = subprocess.check_call(
        ['git', 'push', '--tags', target], cwd=dataset.path)


def publish_target(dataset, target, treeish):
    """
    Publish target of dataset.

    This exists so the actual publish can be easily mocked.
    """
    if target == 'github':
        return github_export(dataset, target)
    else:
        return s3_export(dataset, target, treeish)


def get_dataset_realm(ds, siblings, realm=None):
    # if realm parameter is not included, find the best target
    if realm is None:
        # if the dataset has a public sibling, use this as the export target
        # otherwise, use the private as the export target
        public_bucket_name = DatasetRealm(DatasetRealm.PUBLIC).s3_remote
        has_public_bucket = get_sibling_by_name(public_bucket_name, siblings)
        if has_public_bucket:
            realm = DatasetRealm(DatasetRealm.PUBLIC)
        else:
            realm = DatasetRealm(DatasetRealm.PRIVATE)
    else:
        realm = get_s3_realm(realm=realm)
    return realm


def migrate_to_bucket(store, dataset, cookies=None, realm='PUBLIC'):
    """Migrate a dataset and all snapshots to an S3 bucket"""
    realm = get_s3_realm(realm=realm)
    dataset_id = dataset
    ds = store.get_dataset(dataset)
    tags = [tag['name'] for tag in ds.repo.get_tags()]
    siblings = ds.siblings()
    s3_remote = s3_sibling(ds, siblings, realm=realm)
    for tag in tags:
        publish_target(ds, realm.s3_remote, tag)
        # Public publishes to GitHub
        if realm == DatasetRealm.PUBLIC and DATALAD_GITHUB_EXPORTS_ENABLED:
            github_remote = github_sibling(ds, dataset_id, siblings)
            publish_target(ds, realm.github_remote, tag)


def publish_snapshot(store, dataset, snapshot, cookies=None, realm=None):
    """Publish a snapshot tag to S3, GitHub or both."""
    ds = store.get_dataset(dataset)
    siblings = ds.siblings()

    realm = get_dataset_realm(ds, siblings, realm)

    # Create the sibling if it does not exist
    s3_sibling(ds, siblings)

    # Export to S3 and GitHub in another worker
    publish_s3_async(store, dataset, snapshot,
                     realm.s3_remote, realm.s3_bucket, cookies)

    # Public publishes to GitHub
    if realm == DatasetRealm.PUBLIC and DATALAD_GITHUB_EXPORTS_ENABLED:
        # Create Github sibling only if GitHub is enabled
        github_sibling(ds, dataset, siblings)
        publish_github_async(store, dataset, snapshot, realm.github_remote)


def publish_s3_async(store, dataset, snapshot, s3_remote, s3_bucket, cookies):
    """Actual S3 remote push. Can run on another queue, so it's its own task."""
    ds = store.get_dataset(dataset)
    publish_target(ds, s3_remote, snapshot)


def publish_github_async(store, dataset, snapshot, github_remote):
    """Actual Github remote push. Can run on another queue, so it's its own task."""
    ds = store.get_dataset(dataset)
    publish_target(ds, github_remote, snapshot)

def delete_s3_sibling(dataset_id, siblings, realm):
    sibling = get_sibling_by_name(realm.s3_remote, siblings)
    if sibling:
        client = boto3.client(
            's3',
            aws_access_key_id=AWS_ACCESS_KEY_ID,
            aws_secret_access_key=AWS_SECRET_ACCESS_KEY,
        )
        # print(realm.s3_remote)
        # print(AWS_ACCESS_KEY_ID)
        # print(AWS_SECRET_ACCESS_KEY)
        # print(realm.s3_bucket)
        # print(dataset_id)
        client.delete_object(Bucket=realm.s3_bucket, Key=dataset_id)

def delete_github_sibling(dataset_id):
    ses = Github(DATALAD_GITHUB_LOGIN, DATALAD_GITHUB_PASS)
    org = ses.get_organization(DATALAD_GITHUB_ORG)
    repos = org.get_repos()
    try:
        r = next(r for r in repos if r.name == dataset_id)
        r.delete()
    except StopIteration:
        raise Exception(f'Attempt to delete dataset {dataset_id} from GitHub failed, because dataset does not exist.')

def delete_siblings(store, dataset_id):
    ds = store.get_dataset(dataset_id)

    siblings = ds.siblings()
    delete_s3_sibling(dataset_id, siblings, DatasetRealm(1))
    delete_s3_sibling(dataset_id, siblings, DatasetRealm(2))

    remotes = ds.repo.get_remotes()
    if DatasetRealm(1).github_remote in remotes:
        delete_github_sibling(dataset_id)

    for remote in remotes:
        ds.siblings('remove', remote)

def file_urls_mutation(dataset_id, snapshot_tag, file_urls):
    """
    Return the OpenNeuro mutation to update the file urls of a snapshot filetree
    """
    file_update = {
        'datasetId': dataset_id,
        'tag': snapshot_tag,
        'files': file_urls
    }
    return {
        'query': 'mutation ($files: FileUrls!) { updateSnapshotFileUrls(fileUrls: $files)}',
        'variables':
        {
            'files': file_update
        }
    }


def monitor_remote_configs(store, dataset, snapshot, realm=None):
    """Check remote configs and correct invalidities."""
    ds = store.get_dataset(dataset)
    siblings = ds.siblings()
    realm = get_dataset_realm(ds, siblings, realm)

    s3_ok = validate_s3_config(ds, realm)
    if not s3_ok:
        update_s3_sibling(ds, realm)
