import asyncio
import logging
import os.path
import re
import subprocess
from concurrent.futures import ProcessPoolExecutor

import pygit2
import boto3
from github import Github
from taskiq_pipelines import Pipeline

import datalad_service.common.s3
import datalad_service.common.github
from datalad_service.common.asyncio import run_check
from datalad_service.config import DATALAD_GITHUB_ORG
from datalad_service.config import DATALAD_GITHUB_TOKEN
from datalad_service.config import DATALAD_GITHUB_EXPORTS_ENABLED
from datalad_service.config import AWS_ACCESS_KEY_ID
from datalad_service.config import AWS_SECRET_ACCESS_KEY
from datalad_service.config import GCP_ACCESS_KEY_ID
from datalad_service.config import GCP_SECRET_ACCESS_KEY
from datalad_service.common.annex import get_tag_info, is_git_annex_remote
from datalad_service.common.openneuro import clear_dataset_cache
from datalad_service.common.git import git_show, git_tag, git_tag_tree
from datalad_service.common.github import github_export
from datalad_service.common.s3 import (
    s3_export,
    s3_backup_push,
    get_s3_remote,
    get_s3_backup_remote,
    get_s3_bucket,
    get_s3_backup_bucket,
    update_s3_sibling,
)
from datalad_service.broker import broker
from datalad_service.tasks.fsck import git_annex_fsck_remote

logger = logging.getLogger('datalad_service.' + __name__)


delete_executor = ProcessPoolExecutor(4)


def github_sibling(dataset_path, dataset_id):
    """
    Find a GitHub remote or create a new repo and configure the remote.
    """
    if not is_git_annex_remote(dataset_path, 'github'):
        datalad_service.common.github.create_github_repo(dataset_path, dataset_id)


def s3_sibling(dataset_path):
    """
    Setup a special remote for a versioned S3 remote.

    The bucket must already exist and be configured.
    """
    if not is_git_annex_remote(dataset_path, get_s3_remote()):
        datalad_service.common.s3.setup_s3_sibling(dataset_path)
    if not is_git_annex_remote(dataset_path, get_s3_backup_remote()):
        datalad_service.common.s3.setup_s3_backup_sibling_workaround(dataset_path)


@broker.task
async def create_remotes_and_export(dataset_path):
    """
    Create public S3 and GitHub remotes and export to them.

    Called by publish handler to make a dataset public initially.
    """
    create_remotes(dataset_path)
    await export_dataset(dataset_path)


def create_remotes(dataset_path):
    dataset = os.path.basename(dataset_path)
    s3_sibling(dataset_path)
    github_sibling(dataset_path, dataset)


async def export_backup_and_drop(dataset_path):
    """
    Export dataset to S3 backup, verify s3-PUBLIC, and drop local data.
    """
    repo = pygit2.Repository(dataset_path)
    tags = sorted(git_tag(repo), key=lambda tag: tag.name)
    if tags:
        await s3_backup_push(dataset_path)
        for tag in tags:
            # Check and clean local annexed files once export is complete
            pipeline = Pipeline(broker, git_annex_fsck_remote).call_next(
                annex_drop,
                dataset_path=dataset_path,
                branch=tag,
                remote=get_s3_remote(),
            )
            # Call the pipeline (arguments for git_annex_fsck_remote)
            await pipeline.kiq(
                dataset_path,
                branch=tag,  # Check the history from the new tag just exported
                remote=get_s3_remote(),
            )


@broker.task
async def export_dataset(
    dataset_path,
    s3_export=s3_export,
    github_export=github_export,
    update_s3_sibling=update_s3_sibling,
    github_enabled=DATALAD_GITHUB_EXPORTS_ENABLED,
):
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
            new_tag = tags[-1].name
            await s3_export(dataset_path, get_s3_remote(), new_tag)
            await s3_backup_push(dataset_path)
            # Once all S3 tags are exported, update GitHub
            if github_enabled:
                # Perform all GitHub export steps
                github_export(dataset_id, dataset_path, new_tag)
            # Drop cache once all exports are complete
            clear_dataset_cache(dataset_id)
            # Check and clean local annexed files once export is complete
            pipeline = Pipeline(broker, git_annex_fsck_remote).call_next(
                annex_drop,
                dataset_path=dataset_path,
                branch=new_tag,
                remote=get_s3_remote(),
            )
            # Call the pipeline (arguments for git_annex_fsck_remote)
            await pipeline.kiq(
                dataset_path,
                branch=new_tag,  # Check the history from the new tag just exported
                remote=get_s3_remote(),
            )
        else:
            # Clear the cache even if only sibling updates occurred
            clear_dataset_cache(dataset_id)


def check_remote_has_version(dataset_path, remote, tag):
    try:
        info = get_tag_info(dataset_path, tag)
        remotes = info.get('repositories containing these files', [])
        remote_repo = [r for r in remotes if r.get('description') == f'[{remote}]']
        remote_id_A = remote_repo and remote_repo[0].get('uuid')

        # extract remote uuid and associated git tree id from `git show git-annex:export.log`
        # this command only logs the latest export. previously exported tags will not show
        repo = pygit2.Repository(dataset_path)
        export_log = git_show(repo, 'git-annex', 'export.log')
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
    delete_executor.submit(delete_s3_sibling_executor, dataset_id, True)


def delete_s3_sibling_executor(dataset_id, backup=False):
    """Delete all versions of a dataset from S3."""
    try:
        if backup:
            s3_bucket = get_s3_backup_bucket()
            client = boto3.client(
                's3',
                aws_access_key_id=GCP_ACCESS_KEY_ID,
                aws_secret_access_key=GCP_SECRET_ACCESS_KEY,
                endpoint_url='https://storage.googleapis.com',
            )
        else:
            s3_bucket = get_s3_bucket()
            client = boto3.client(
                's3',
                aws_access_key_id=AWS_ACCESS_KEY_ID,
                aws_secret_access_key=AWS_SECRET_ACCESS_KEY,
            )
        paginator = client.get_paginator('list_object_versions')
        object_delete_list = []
        for response in paginator.paginate(
            Bucket=get_s3_bucket(), Prefix=f'{dataset_id}/'
        ):
            versions = response.get('Versions', [])
            versions.extend(response.get('DeleteMarkers', []))
            object_delete_list.extend(
                [
                    {'VersionId': version['VersionId'], 'Key': version['Key']}
                    for version in versions
                ]
            )
        for i in range(0, len(object_delete_list), 1000):
            client.delete_objects(
                Bucket=s3_bucket,
                Delete={'Objects': object_delete_list[i : i + 1000], 'Quiet': True},
            )
    except Exception as e:
        raise Exception(
            f'Attempt to delete dataset {dataset_id} from {s3_bucket} has failed. ({e})'
        )


async def delete_github_sibling(dataset_id):
    ses = Github(DATALAD_GITHUB_TOKEN)
    org = ses.get_organization(DATALAD_GITHUB_ORG)
    repos = org.get_repos()
    try:
        r = next(r for r in repos if r.name == dataset_id)
        r.delete()
        # Yield between deletes
        await asyncio.sleep(0)
    except StopIteration as e:
        raise Exception(
            f'Attempt to delete dataset {dataset_id} from GitHub has failed, because the dataset does not exist. ({e})'
        )


async def delete_siblings(dataset_id):
    delete_s3_sibling(dataset_id)
    await delete_github_sibling(dataset_id)


def monitor_remote_configs(dataset_path):
    """Check remote configs and correct invalidities."""
    s3_ok = datalad_service.common.s3.validate_s3_config(dataset_path)
    if not s3_ok:
        update_s3_sibling(dataset_path)


@broker.task
async def annex_drop(fsck_success, dataset_path, branch):
    """Drop local contents from the annex."""
    # Ensure numcopies is set to 2 before running drop
    await run_check(['git-annex', 'numcopies', '2'], dataset_path)
    # Early versions of OpenNeuro used an s3-PRIVATE remote
    # Mark it dead before dropping to avoid counting it in numcopies
    try:
        await run_check(['git-annex', 'dead', 's3-PRIVATE'], dataset_path)
    except subprocess.CalledProcessError:
        # Not an issue if this fails
        pass
    # Drop will only drop successfully exported files present on both remotes
    if fsck_success:
        env = os.environ.copy()
        # Force git-annex to use cached credentials for this
        del env['AWS_ACCESS_KEY_ID']
        del env['AWS_SECRET_ACCESS_KEY']
        await run_check(
            ['git-annex', 'drop', '--branch', branch], dataset_path, env=env
        )
