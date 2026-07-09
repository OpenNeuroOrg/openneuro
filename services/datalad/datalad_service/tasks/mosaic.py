import asyncio
from pathlib import Path
import logging
import bidsmosaic

import requests

from datalad_service.config import GRAPHQL_ENDPOINT
from datalad_service.broker import broker
from datalad_service.common.redis import redis_client

logger = logging.getLogger('datalad_service.' + __name__)


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
        lock = client.lock(f'mosaic-lock:{dataset_id}:{ref}', timeout=60 * 60 *4)
        if await lock.acquire(blocking=False):
            try:
                out_dir_path = Path(f"/datalad/mosaics/{dataset_id}")
                out_dir_path.mkdir(parents=True, exist_ok=True)
                out_file_path = out_dir_path / f"{dataset_id}-{ref[0:6]}_mosaic.pdf"
                
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
