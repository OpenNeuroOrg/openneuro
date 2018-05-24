from datalad.api import create_sibling_github

from datalad_service.config import DATALAD_GITHUB_ORG
from datalad_service.config import DATALAD_GITHUB_LOGIN
from datalad_service.config import DATALAD_GITHUB_PASS
import datalad_service.common.s3
from datalad_service.common.s3 import DatasetRealm, s3_export, s3_versions
from datalad_service.common.celery import dataset_task

import requests

GRAPHQL_ENDPOINT = 'http://server:8111/crn/graphql'

def create_github_repo(dataset, repo_name):
    """Setup a github sibling / remote."""
    try:
        # this adds github remote to config and also creates repo
        return create_sibling_github(repo_name,
                                     github_login=DATALAD_GITHUB_LOGIN,
                                     github_passwd=DATALAD_GITHUB_PASS,
                                     github_organization=DATALAD_GITHUB_ORG,
                                     dataset=dataset,
                                     access_protocol='ssh')
    except KeyError:
        raise Exception(
            'DATALAD_GITHUB_LOGIN, DATALAD_GITHUB_PASS, DATALAD_GITHUB_ORG must be defined to create remote repos')


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


def publish_target(dataset, target, treeish):
    """
    Publish target of dataset.

    This exists so the actual publish can be easily mocked.
    """
    if target == 'github':
        return dataset.publish(to=target)
    else:
        return s3_export(dataset, target, treeish)


@dataset_task
def publish_snapshot(store, dataset, snapshot, realm='PRIVATE'):
    """Publish a snapshot tag to S3, GitHub or both."""
    realm = DatasetRealm[realm]
    dataset_id = dataset
    ds = store.get_dataset(dataset)
    siblings = ds.siblings()
    s3_remote = s3_sibling(ds, siblings)
    publish_target(ds, realm.s3_remote, snapshot)
    versions = s3_versions(ds, realm, snapshot)
    if (len(versions)):
        r = requests.post(
            url=GRAPHQL_ENDPOINT, json=file_urls_mutation(dataset_id, snapshot, versions))
        if r.status_code != 200:
            raise Exception(r.text)
    # Public publishes to GitHub
    if realm == DatasetRealm.PUBLIC:
        github_remote = github_sibling(ds, dataset_id, siblings)
        publish_target(ds, realm.github_remote, snapshot)

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