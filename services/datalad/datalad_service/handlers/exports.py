import logging

import falcon

from datalad_service.tasks.files import remove_annex_object


class ExportsResource:
    """Handler to report status for exports."""

    def __init__(self, store):
        self.store = store
        self.logger = logging.getLogger('datalad_service.' + __name__)

    async def on_get(self, req, resp, dataset, remote):
        """Report status for exports"""
        dataset_path = self.store.get_dataset_path(dataset)
