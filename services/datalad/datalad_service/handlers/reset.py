import falcon
import subprocess

from datalad_service.common.user import get_user_info
from datalad_service.tasks.files import commit_files


class ResetResource:
    def __init__(self, store):
        self.store = store

    async def on_post(self, req, resp, dataset, hexsha):
        """Reset master to a given commit."""
        if dataset and hexsha.isalnum() and len(hexsha) == 40:
            try:
                dataset_path = self.store.get_dataset_path(dataset)
                gitProcess = subprocess.run(
                    ['git', 'reset', '--hard', hexsha], check=True, cwd=dataset_path
                )
                resp.status = falcon.HTTP_OK
            except subprocess.CalledProcessError:
                resp.status = falcon.HTTP_INTERNAL_SERVER_ERROR
        else:
            resp.media = {
                'error': 'Missing or malformed dataset or hexsha parameter in request.'
            }
            resp.status = falcon.HTTP_UNPROCESSABLE_ENTITY
