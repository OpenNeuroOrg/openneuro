import json
import falcon
import subprocess

from datalad_service.common.asyncio import run_check


class InfoResource:
    def __init__(self, store):
        self.store = store

    async def on_get(self, req, resp, dataset, name=None):
        """Return git-annex info output for a given dataset.

        Name can be a tag, branch, commit hash, or special remote name.
        """
        if dataset:
            command = ['git', 'annex', 'info', '--json', '--bytes']
            if name:
                command.append(name)
            try:
                dataset_path = self.store.get_dataset_path(dataset)
                output = await run_check(command, dataset_path)
                try:
                    json_output = json.loads(output)
                except json.JSONDecodeError:
                    json_output = {'error': output}
                resp.media = json_output
                resp.status = falcon.HTTP_OK
            except subprocess.CalledProcessError:
                resp.status = falcon.HTTP_INTERNAL_SERVER_ERROR
        else:
            resp.media = {'error': 'Missing or malformed dataset parameter in request.'}
            resp.status = falcon.HTTP_UNPROCESSABLE_ENTITY
