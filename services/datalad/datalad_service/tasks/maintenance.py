import os
import logging
import subprocess
import re
import random


from datalad_service.config import DATALAD_DATASET_PATH
from datalad_service.broker import broker
from datalad_service.tasks.publish import set_s3_access_tag


def dataset_factory():
    """
    Factory that yields dataset paths from the DATALAD_DATASET_PATH directory.
    It shuffles the list of datasets and yields them one by one.
    When all datasets have been yielded, it re-reads the directory and shuffles again.
    """
    datasets = []
    while True:
        if not datasets:
            # Read the directory and shuffle if the list is empty
            try:
                datasets = [
                    os.path.join(DATALAD_DATASET_PATH, d)
                    for d in os.listdir(DATALAD_DATASET_PATH)
                    if os.path.isdir(os.path.join(DATALAD_DATASET_PATH, d))
                    and re.match(r'^ds\d{6}$', d)
                ]
                if not datasets:
                    logging.warning(
                        f'No datasets found in {DATALAD_DATASET_PATH} for maintenance tasks.'
                    )
                    return
                random.shuffle(datasets)
            except FileNotFoundError:
                logging.error(f'DATALAD_DATASET_PATH not found: {DATALAD_DATASET_PATH}')
                return
        yield datasets.pop()


gc_dataset_generator = dataset_factory()
fsck_dataset_generator = dataset_factory()
s3_tags_dataset_generator = dataset_factory()


@broker.task(schedule=[{'cron': '*/15 * * * *'}])
def gc_dataset(dataset_path=None):
    """Run git gc on a random dataset periodically."""
    try:
        if not dataset_path:
            dataset_path = next(gc_dataset_generator)
    except StopIteration:
        logging.info('No datasets available for git gc.')
        return

    logging.info(f'Running git gc on dataset: {dataset_path}')

    gc = subprocess.run(
        ['git', 'gc', '--cruft', '--prune=1.day.ago'],
        cwd=dataset_path,
        capture_output=True,
        text=True,
    )
    if gc.returncode != 0:
        logging.error(f'`git gc` failed for `{dataset_path}`: {gc.stderr}')


@broker.task(schedule=[{'cron': '7 * * * *'}])
def git_fsck_dataset(dataset_path=None):
    """Routinely verify git repository integrity and produce an error if any issues are reported."""
    try:
        if not dataset_path:
            dataset_path = next(fsck_dataset_generator)
    except StopIteration:
        logging.info('No datasets available for git fsck.')
        return
    git_fsck = subprocess.run(
        ['git', 'fsck', '--full'], cwd=dataset_path, capture_output=True, text=True
    )
    if git_fsck.returncode != 0:
        logging.error(
            f'`git fsck --full` failed for `{dataset_path}`: {git_fsck.stderr}'
        )


@broker.task(schedule=[{'cron': '*/20 * * * *'}])
async def reconcile_s3_tags_dataset(dataset_path=None):
    """Routinely verify and reconcile S3 access tags for a dataset to match expected public/private status."""
    try:
        if not dataset_path:
            dataset_path = next(s3_tags_dataset_generator)
    except StopIteration:
        logging.info('No datasets available for S3 tag reconciliation.')
        return
    dataset_id = os.path.basename(dataset_path)
    logging.info(f'Running S3 access tag reconciliation on dataset: {dataset_id}')
    return await set_s3_access_tag(dataset_id)
