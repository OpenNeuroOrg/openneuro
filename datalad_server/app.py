import falcon
from .dataset import DatasetResource
from .heartbeat import HeartbeatResource


def create_app(annex_path):
    api = application = falcon.API()

    heartbeat = HeartbeatResource()
    datasets = DatasetResource(annex_path)

    api.add_route('/heartbeat', heartbeat)
    api.add_route('/datasets/{dataset}', datasets)

    return api
