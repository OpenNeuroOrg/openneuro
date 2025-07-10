import asyncio
import json
import logging
import subprocess
from urllib.parse import urlparse, parse_qs

import boto3
import botocore
import pygit2

from datalad_service.common.annex import get_repo_files
from datalad_service.common.git import (
    git_commit,
    git_commit_index,
    COMMITTER_EMAIL,
    COMMITTER_NAME,
)
from datalad_service.tasks.validator import validate_dataset
from datalad_service.config import AWS_ACCESS_KEY_ID
from datalad_service.config import AWS_SECRET_ACCESS_KEY
from datalad_service.config import AWS_S3_PUBLIC_BUCKET


def commit_files(store, dataset, files, name=None, email=None, cookies=None):
    """
    Commit a list of files with the email and name provided.

    Returns the commit hash generated.
    """
    dataset_path = store.get_dataset_path(dataset)
    repo = pygit2.Repository(dataset_path)
    author = (
        name
        and email
        and pygit2.Signature(name, email)
        or pygit2.Signature(COMMITTER_NAME, COMMITTER_EMAIL)
    )
    ref = git_commit(repo, files, author)
    # Run the validator but don't block on the request
    asyncio.create_task(validate_dataset(dataset, dataset_path, str(ref), cookies))
    return ref


def get_tree(store, dataset, tree):
    """Get the working tree, optionally a branch tree."""
    dataset_path = store.get_dataset_path(dataset)
    return get_repo_files(dataset, dataset_path, tree)


def remove_files(store, dataset, paths, name=None, email=None, cookies=None):
    dataset_path = store.get_dataset_path(dataset)
    repo = pygit2.Repository(dataset_path)
    if name and email:
        author = pygit2.Signature(name, email)
    else:
        author = None
    repo.index.remove_all(paths)
    repo.index.write()
    repo.checkout_index()
    hexsha = str(git_commit_index(repo, author, message='[OpenNeuro] Files removed'))


def parse_s3_annex_url(url, bucket_name=AWS_S3_PUBLIC_BUCKET):
    parsed = urlparse(url)
    parse_qs(parsed.query)['versionId'].pop()
    return {
        'VersionId': parse_qs(parsed.query)['versionId'].pop(),
        'Key': parsed.path.removeprefix(f'/{bucket_name}/'),
    }


def remove_s3_annex_object(dataset_path, annex_key):
    client = boto3.client(
        's3',
        aws_access_key_id=AWS_ACCESS_KEY_ID,
        aws_secret_access_key=AWS_SECRET_ACCESS_KEY,
    )
    p = subprocess.run(
        ['git-annex', 'whereis', '--json', f'--key={annex_key}'],
        cwd=dataset_path,
        encoding='utf-8',
        capture_output=True,
    )
    output = json.loads(p.stdout)
    objects_to_remove = []
    # There may be multiple remotes in the future here
    for f in output['whereis']:
        # There should be one result but it's possible a key is manually exported to multiple versions
        for url in f['urls']:
            objects_to_remove.append(parse_s3_annex_url(url))
    client.delete_objects(
        Bucket=AWS_S3_PUBLIC_BUCKET,
        Delete={'Objects': objects_to_remove, 'Quiet': True},
    )


def remove_annex_object(dataset_path, annex_key):
    """Remove an annex object by its key.

    :type annex_key: str
    :return: True if successful, false is the annex object does not exist.
    :rtype: bool
    """
    logger = logging.getLogger('datalad_service.' + __name__)
    logger.info(f'Removing annex object: {annex_key}')
    completed_process = subprocess.run(
        ['git-annex', 'drop', '--force', f'--key={annex_key}'],
        cwd=dataset_path,
        stdout=subprocess.PIPE,
        encoding='utf-8',
    )
    if completed_process.returncode == 0:
        # If successful, delete from s3-PUBLIC as well
        try:
            remove_s3_annex_object(dataset_path, annex_key)
            return True
        except botocore.exceptions.ClientError as error:
            # Most likely this key has already been removed
            logger.warning(
                f'Purge requested for annex key that is not present on S3: {annex_key}'
            )
            return False
        except KeyError:
            # Rarely no versionId exists and will raise KeyError
            logger.warning(f'KeyError purging key: {annex_key}')
            return False
    return False
