import os.path
from pathlib import Path
import logging
import bidsmosaic
import requests
import pygit2

from datalad_service.config import GRAPHQL_ENDPOINT, DATALAD_DATASET_PATH
from datalad_service.broker import broker
from datalad_service.common.redis import redis_client

from datalad_service.common.git import git_show_content

logger = logging.getLogger('datalad_service.' + __name__)


def get_mosaic_path(dataset_id, repo, commit):
    """Return path of a mosaic pdf file."""
    try:
        # Get tag if exists
        label = repo.describe(
            committish=commit,
            max_candidates_tags=0,
            describe_strategy=pygit2.enums.DescribeStrategy.TAGS,
        )
    except (KeyError, pygit2.GitError):
        label = str(commit.id)[0:8]

    mosaic_dir_path = Path(DATALAD_DATASET_PATH) / 'mosaics' / dataset_id
    return mosaic_dir_path / f'{dataset_id}-{label}_mosaic.pdf'


def mosaic_mutation(dataset_id, ref):
    """
    Return the OpenNeuro mutation to update the snapshot mosaic.
    """
    mosaicInput = {
        'datasetId': dataset_id,
        'id': ref,
    }
    return {
        'query': 'mutation ($info: MosaicInput!) { updateMosaic(mosaic: $info) }',
        'variables': {
            'info': mosaicInput,
        },
    }


def _stream_opener(repo, ref, relpath):
    """Return a function that runs git_show_content() and returns just the stream."""

    async def opener():
        stream, _size = await git_show_content(repo, ref, relpath)
        return stream

    return opener


def _is_anat(path):
    """True for a raw anatomical nifti, ie sub-*/**/anat/*.nii[.gz]."""
    return (
        path.startswith('sub-')
        and os.path.basename(os.path.dirname(path)) == 'anat'
        and path.endswith(('.nii', '.nii.gz'))
    )


def create_anat_files_dict(repo, commit):
    """Return {datatype: [(relpath, opener), ...]} for all anatomical images.
    Used as input for create_mosaic_pdf_async()."""
    hexsha = str(commit.id)
    index = pygit2.Index()
    index.read_tree(commit.tree)
    anat = sorted(entry.path for entry in index if _is_anat(entry.path))
    return {'Anatomical': [(path, _stream_opener(repo, hexsha, path)) for path in anat]}


@broker.task
async def create_mosaic(dataset_id, dataset_path, ref, cookies=None, user=''):
    async with redis_client() as client:
        lock = client.lock(f'mosaic-lock:{dataset_id}:{ref}', timeout=60 * 60 * 4)
        if await lock.acquire(blocking=False):
            try:
                repo = pygit2.Repository(str(dataset_path))
                commit, _ref = repo.resolve_refish(ref)

                files_dict = create_anat_files_dict(repo, commit)
                if not any(files_dict.values()):
                    logger.info(
                        'No anatomical images for %s %s; skipping mosaic',
                        dataset_id,
                        ref,
                    )
                    return

                out_file_path = get_mosaic_path(dataset_id, repo, commit)
                out_file_path.parent.mkdir(parents=True, exist_ok=True)

                await bidsmosaic.create_mosaic_pdf_async(
                    str(out_file_path),
                    files_dict,
                    downsample=2,
                    strict=True,
                )

                if out_file_path.exists():
                    r = requests.post(
                        url=GRAPHQL_ENDPOINT,
                        json=mosaic_mutation(
                            dataset_id,
                            ref,
                        ),
                        cookies=cookies,
                    )
                    if r.status_code != 200 or 'errors' in r.json():
                        raise Exception(r.text)
            finally:
                await lock.release()
