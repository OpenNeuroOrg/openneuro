import asyncio
import logging
import os.path
import re
from concurrent.futures import ProcessPoolExecutor

import pygit2
import boto3
from github import Github

import datalad_service.common.s3
import datalad_service.common.github
from datalad_service.config import DATALAD_GITHUB_ORG
from datalad_service.config import DATALAD_GITHUB_LOGIN
from datalad_service.config import DATALAD_GITHUB_PASS
from datalad_service.config import DATALAD_GITHUB_EXPORTS_ENABLED
from datalad_service.config import AWS_ACCESS_KEY_ID
from datalad_service.config import AWS_SECRET_ACCESS_KEY
from datalad_service.common.annex import get_tag_info, is_git_annex_remote
from datalad_service.common.openneuro import clear_dataset_cache
from datalad_service.common.git import git_show, git_tag, git_tag_tree
from datalad_service.common.github import github_export
from datalad_service.common.s3 import s3_export, get_s3_remote, get_s3_bucket, update_s3_sibling

logger = logging.getLogger('datalad_service.' + __name__)


delete_executor = ProcessPoolExecutor(4)


def github_sibling(dataset_path, dataset_id):
    """
    Find a GitHub remote or create a new repo and configure the remote.
    """
    if not is_git_annex_remote(dataset_path, 'github'):
        datalad_service.common.github.create_github_repo(
            dataset_path, dataset_id)


def s3_sibling(dataset_path):
    """
    Setup a special remote for a versioned S3 remote.

    The bucket must already exist and be configured.
    """
    if not is_git_annex_remote(dataset_path, get_s3_remote()):
        datalad_service.common.s3.setup_s3_sibling(dataset_path)


def create_remotes_and_export(dataset_path, cookies=None):
    """
    Create public S3 and GitHub remotes and export to them.

    Called by publish handler to make a dataset public initially.
    """
    create_remotes(dataset_path)
    export_dataset(dataset_path, cookies)


def create_remotes(dataset_path):
    dataset = os.path.basename(dataset_path)
    s3_sibling(dataset_path)
    github_sibling(dataset_path, dataset)


def export_dataset(dataset_path, cookies=None, s3_export=s3_export, github_export=github_export, update_s3_sibling=update_s3_sibling, github_enabled=DATALAD_GITHUB_EXPORTS_ENABLED):
    """
    Export dataset to S3 and GitHub.

    If the dataset has not been configured with public remotes, this is a noop.
    """
    if is_git_annex_remote(dataset_path, get_s3_remote()):
        dataset_id = os.path.basename(dataset_path)
        repo = pygit2.Repository(dataset_path)
        tags = sorted(git_tag(repo), key=lambda tag: tag.name)
        # Update configuration for the remote
        update_s3_sibling(dataset_path)
        # Push the most recent tag
        if tags:
            s3_export(dataset_path, get_s3_remote(), tags[-1].name)
            # Once all S3 tags are exported, update GitHub
            if github_enabled:
                # Perform all GitHub export steps
                github_export(dataset_id, dataset_path, tags[-1].name)
        # Drop cache once all exports are complete
        clear_dataset_cache(dataset_id, tags[-1].name, cookies)


def check_remote_has_version(dataset_path, remote, tag):
    try:
        info = get_tag_info(dataset_path, tag)
        remotes = info.get('repositories containing these files', [])
        remote_repo = [r for r in remotes if r.get(
            'description') == f'[{remote}]']
        remote_id_A = remote_repo and remote_repo[0].get('uuid')

        # extract remote uuid and associated git tree id from `git show git-annex:export.log`
        # this command only logs the latest export. previously exported tags will not show
        export_log = git_show(dataset_path, 'git-annex', 'export.log')
        log_remote_id_pattern = re.compile(':(.+) .+$')
        match = log_remote_id_pattern.search(export_log)
        remote_id_B = match.group(1)
        log_tree_id_pattern = re.compile('.* (.+)$')
        match = log_tree_id_pattern.search(export_log)
        tree_id_A = match.group(1)

        # extract git tree id of <tag> from git reference
        repo = pygit2.Repository(dataset_path)
        tree_id_B = git_tag_tree(repo, tag)
    except AttributeError:
        return False
    # if the remote uuids and tree ids exist and match, then
    # <tag> is the latest export to <remote>
    return remote_id_A == remote_id_B and tree_id_A == tree_id_B


def delete_s3_sibling(dataset_id):
    """Run S3 sibling deletion in another process to avoid blocking any callers"""
    delete_executor.submit(delete_s3_sibling_executor, dataset_id)


def delete_s3_sibling_executor(dataset_id):
    """Delete all versions of a dataset from S3."""
    try:
        client = boto3.client(
            's3',
            aws_access_key_id=AWS_ACCESS_KEY_ID,
            aws_secret_access_key=AWS_SECRET_ACCESS_KEY,
        )
        paginator = client.get_paginator('list_object_versions')
        object_delete_list = []
        for response in paginator.paginate(Bucket=get_s3_bucket(), Prefix=f'{dataset_id}/'):
            versions = response.get('Versions', [])
            versions.extend(response.get('DeleteMarkers', []))
            object_delete_list.extend(
                [{'VersionId': version['VersionId'], 'Key': version['Key']} for version in versions])
        for i in range(0, len(object_delete_list), 1000):
            client.delete_objects(
                Bucket=get_s3_bucket(),
                Delete={
                    'Objects': object_delete_list[i:i+1000],
                    'Quiet': True
                }
            )
    except Exception as e:
        raise Exception(
            f'Attempt to delete dataset {dataset_id} from {get_s3_remote()} has failed. ({e})')


async def delete_github_sibling(dataset_id):
    ses = Github(DATALAD_GITHUB_LOGIN, DATALAD_GITHUB_PASS)
    org = ses.get_organization(DATALAD_GITHUB_ORG)
    repos = org.get_repos()
    try:
        r = next(r for r in repos if r.name == dataset_id)
        r.delete()
        # Yield between deletes
        await asyncio.sleep(0)
    except StopIteration as e:
        raise Exception(
            f'Attempt to delete dataset {dataset_id} from GitHub has failed, because the dataset does not exist. ({e})')


async def delete_siblings(dataset_id):
    delete_s3_sibling(dataset_id)
    await delete_github_sibling(dataset_id)


def monitor_remote_configs(dataset_path):
    """Check remote configs and correct invalidities."""
    s3_ok = datalad_service.common.s3.validate_s3_config(dataset_path)
    if not s3_ok:
        update_s3_sibling(dataset_path)
