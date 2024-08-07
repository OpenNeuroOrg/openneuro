import falcon
import os

from datalad_service.tasks.description import update_description


class DescriptionResource:
    def __init__(self, store):
        self.store = store

    async def on_post(self, req, resp, dataset):
        """
        Commit a description change.
        Returns update dataset_description
        """
        if dataset:
            description_fields = (await req.get_media())['description_fields']
            if not any(description_fields):
                resp.media = {
                    'error': 'Missing description field updates.'
                }
                resp.status = falcon.HTTP_UNPROCESSABLE_ENTITY
            try:
                updated = update_description(
                    self.store, dataset, description_fields)
                dataset_description = updated
                resp.media = dataset_description
                resp.status = falcon.HTTP_OK
            except:
                resp.media = {'error': 'dataset update failed'}
                resp.status = falcon.HTTP_500
        else:
            resp.media = {
                'error': 'Missing or malformed dataset parameter in request.'}
            resp.status = falcon.HTTP_UNPROCESSABLE_ENTITY
