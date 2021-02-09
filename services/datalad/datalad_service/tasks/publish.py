import requests
import subprocess
import re
import json
from datalad.api import create_sibling_github

from datalad_service.config import DATALAD_GITHUB_ORG
from datalad_service.config import DATALAD_GITHUB_LOGIN
from datalad_service.config import DATALAD_GITHUB_PASS
from datalad_service.config import DATALAD_GITHUB_EXPORTS_ENABLED
from datalad_service.config import GRAPHQL_ENDPOINT
from datalad_service.config import AWS_ACCESS_KEY_ID
from datalad_service.config import AWS_SECRET_ACCESS_KEY
from datalad_service.common.openneuro import clear_dataset_cache
import datalad_service.common.s3
from datalad_service.common.s3 import DatasetRealm, s3_export, get_s3_realm
from datalad_service.common.s3 import validate_s3_config, update_s3_sibling

import boto3
from github import Github
import gevent
from datalad_service.common.elasticsearch import ReexportLogger

import logging
logger = logging.getLogger('datalad_service.' + __name__)

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


def publish_dataset(store, dataset, cookies=None, realm='PUBLIC'):
    def get_realm(ds, siblings):
        return get_s3_realm(realm=realm)
    def should_export(ds, tags):
        return True
    export_all_tags(store, dataset, cookies, get_realm, should_export)

def reexport_dataset(store, dataset, cookies=None, realm=None):
    def get_realm(ds, siblings):
        return get_dataset_realm(ds, siblings, realm)
    def should_export(ds, tags):
        latest_tag = tags[-1:][0]
        # If remote has latest snapshot, do not reexport.
        # Reexporting all snapshots could make a previous snapshot latest in s3.
        return not check_remote_has_version(ds, DatasetRealm.PUBLIC.s3_remote, latest_tag)
    # logs to elasticsearch
    esLogger = ReexportLogger(dataset)
    export_all_tags(store, dataset, cookies, get_realm, should_export, esLogger)
        
def publish_snapshot(store, dataset, cookies=None, snapshot=None, realm=None):
    def get_realm(ds, siblings):
        return get_dataset_realm(ds, siblings, realm)
    def should_export(ds, tags):
        return True
    export_all_tags(store, dataset, cookies, get_realm, should_export)
    

def export_all_tags(store, dataset, cookies, get_realm, check_should_export, esLogger=None):
    """Migrate a dataset and all snapshots to an S3 bucket"""

    dataset_id = dataset
    ds = store.get_dataset(dataset)
    tags = [tag['name'] for tag in ds.repo.get_tags()]
    siblings = ds.siblings()
    realm = get_realm(ds, siblings)
    s3_sibling(ds, siblings, realm=realm)
    if check_should_export(ds, tags):
        for tag in tags:
            s3_export_successful = False
            github_export_successful = False
            error = None
            try:
                publish_target(ds, realm.s3_remote, tag)
                gevent.sleep()
                s3_export_successful = True
                # Public publishes to GitHub
                if realm == DatasetRealm.PUBLIC and DATALAD_GITHUB_EXPORTS_ENABLED:
                    github_sibling(ds, dataset_id, siblings)
                    publish_target(ds, realm.github_remote, tag)
                    gevent.sleep()
                    github_export_successful = True
            except Exception as err:
                error = err
            finally:
                if esLogger:
                    esLogger.log(tag, s3_export_successful, github_export_successful, error)
        clear_dataset_cache(dataset, cookies)

def check_remote_has_version(dataset, remote, tag):
    try:
        # extract remote uuid from `git annex info <tag>`
        response = dataset.repo._run_annex_command(
            'info',
            annex_options=[
                '--json',
                tag,
            ]
        )
        info = json.loads(response[0])
        remotes = info.get('repositories containing these files', [])
        remote_repo = [r for r in remotes if r.get('description') == f'[{remote}]']
        remote_id_A = remote_repo and remote_repo[0].get('uuid')

        # extract remote uuid and associated git tree id from `git show git-annex:export.log`
        # this command only logs the latest export. previously exported tags will not show
        response = dataset.repo.call_git(['show', 'git-annex:export.log'])
        log_remote_id_pattern = re.compile(':(.+) .+$')
        match = log_remote_id_pattern.search(response)
        remote_id_B = match.group(1)
        log_tree_id_pattern = re.compile('.* (.+)$')
        match = log_tree_id_pattern.search(response)
        tree_id_A = match.group(1)

        # extract git tree id of <tag> with `git show -s <tag>`
        response = dataset.repo.call_git(['show', '-s', '--pretty=raw', tag])
        tree_id_pattern = re.compile('^tree (.+)$', re.MULTILINE)
        match = tree_id_pattern.search(response)
        tree_id_B = match.group(1)
    except AttributeError:
        return False
    # if the remote uuids and tree ids exist and match, then
    # <tag> is the latest export to <remote>
    return remote_id_A == remote_id_B and tree_id_A == tree_id_B

def delete_s3_sibling(dataset_id, siblings, realm):
    sibling = get_sibling_by_name(realm.s3_remote, siblings)
    if sibling:
        try:
            client = boto3.client(
                's3',
                aws_access_key_id=AWS_ACCESS_KEY_ID,
                aws_secret_access_key=AWS_SECRET_ACCESS_KEY,
            )
            paginator = client.get_paginator('list_object_versions')
            object_delete_list = []
            for response in paginator.paginate(Bucket=realm.s3_bucket, Prefix=f'{dataset_id}/'):
                versions = response.get('Versions', [])
                versions.extend(response.get('DeleteMarkers', []))
                object_delete_list.extend(
                    [{'VersionId': version['VersionId'], 'Key': version['Key']} for version in versions])
            for i in range(0, len(object_delete_list), 1000):
                client.delete_objects(
                    Bucket=realm.s3_bucket,
                    Delete={
                        'Objects': object_delete_list[i:i+1000],
                        'Quiet': True
                    }
                )
        except Exception as e:
            raise Exception(
                f'Attempt to delete dataset {dataset_id} from {realm.s3_remote} has failed. ({e})')

def delete_github_sibling(dataset_id):
    ses = Github(DATALAD_GITHUB_LOGIN, DATALAD_GITHUB_PASS)
    org = ses.get_organization(DATALAD_GITHUB_ORG)
    repos = org.get_repos()
    try:
        r = next(r for r in repos if r.name == dataset_id)
        r.delete()
    except StopIteration as e:
        raise Exception(
            f'Attempt to delete dataset {dataset_id} from GitHub has failed, because the dataset does not exist. ({e})')


def delete_siblings(store, dataset_id):
    ds = store.get_dataset(dataset_id)

    siblings = ds.siblings()
    delete_s3_sibling(dataset_id, siblings, DatasetRealm.PRIVATE)
    delete_s3_sibling(dataset_id, siblings, DatasetRealm.PUBLIC)

    remotes = ds.repo.get_remotes()
    if DatasetRealm.PUBLIC.github_remote in remotes:
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
