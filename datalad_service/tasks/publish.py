import os

from datalad.api import create_sibling_github

from datalad_service.common.celery import dataset_task


def create_github_repo(dataset, repo_name):
    """Setup a github sibling / remote."""
    try:
        org = os.environ['DATALAD_GITHUB_ORG']
        login = os.environ['DATALAD_GITHUB_LOGIN']
        password = os.environ['DATALAD_GITHUB_PASS']
        # this adds github remote to config and also creates repo
        return create_sibling_github(repo_name, github_login=login,
                                     github_passwd=password, github_organization=org, dataset=dataset, access_protocol='ssh')
    except KeyError:
        raise Exception(
            'DATALAD_GITHUB_LOGIN, DATALAD_GITHUB_PASS, DATALAD_GITHUB_ORG must be defined to create remote repos')


def get_sibling_by_name(name, siblings):
    return any(
        filter(lambda sibling: sibling['name'] == name, siblings)
    )


def github_sibling(ds, repo_name, siblings):
    sibling = get_sibling_by_name('github', siblings)
    if not sibling:
        create_github_repo(ds, repo_name)
    return sibling


def s3_sibling(siblings):
    sibling = get_sibling_by_name('s3', siblings)
    if not sibling:
        # TODO - Create the special S3 remote for export
        pass
    return sibling


def publish_target(dataset, target):
    """
    Publish target of dataset.

    This exists so the actual publish can be easily mocked.
    """
    return dataset.publish(to=target)


@dataset_task
def publish_snapshot(store, dataset, snapshot, s3=False, github=False):
    """Publish a snapshot tag to S3, GitHub or both."""
    dataset_id = dataset
    ds = store.get_dataset(dataset)
    siblings = ds.siblings()
    if s3:
        s3_remote = s3_sibling(siblings)
        publish_target(ds, 's3')
    if github:
        github_remote = github_sibling(ds, dataset_id, siblings)
        publish_target(ds, 'github')
