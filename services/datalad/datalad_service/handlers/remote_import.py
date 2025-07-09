import asyncio
import logging

import falcon

from datalad_service.tasks.remote_import import remote_import
from datalad_service.common.user import get_user_info


class RemoteImportResource:
    def __init__(self, store):
        self.store = store
        self.logger = logging.getLogger('datalad_service.' + __name__)

    async def on_post(self, req, resp, dataset, import_id):
        name, email = get_user_info(req)
        dataset_path = self.store.get_dataset_path(dataset)
        upload_path = self.store.get_upload_path(dataset, import_id)
        url = (await req.get_media())['url']
        asyncio.get_event_loop().run_in_executor(
            None,
            remote_import,
            dataset_path,
            upload_path,
            import_id,
            url,
            name,
            email,
            req.cookies,
        )
        resp.status = falcon.HTTP_OK
