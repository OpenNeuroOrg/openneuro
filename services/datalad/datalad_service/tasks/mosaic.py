import asyncio
from pathlib import Path
import logging
import bidsmosaic
import requests

from datalad_service.config import GRAPHQL_ENDPOINT
from datalad_service.broker import broker
from datalad_service.common.redis import redis_client
from datalad_service.config import DATALAD_DATASET_PATH

logger = logging.getLogger('datalad_service.' + __name__)


def get_mosaic_path(dataset_id, ref):
    """Return path of a mosaic pdf file."""
    mosaic_dir_path = Path(DATALAD_DATASET_PATH) / 'mosaics' / dataset_id
    return mosaic_dir_path / f'{dataset_id}-{ref[0:6]}_mosaic.pdf'


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


@broker.task
async def create_mosaic(dataset_id, dataset_path, ref, cookies=None, user=''):
    async with redis_client() as client:
        lock = client.lock(f'mosaic-lock:{dataset_id}:{ref}', timeout=60 * 60 * 4)
        if await lock.acquire(blocking=False):
            try:
                out_file_path = get_mosaic_path(dataset_id, ref)
                out_file_path.parent.mkdir(parents=True, exist_ok=True)

                await asyncio.to_thread(
                    bidsmosaic.create_mosaic_pdf,
                    dataset_path,
                    str(out_file_path),
                    downsample=2,
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
