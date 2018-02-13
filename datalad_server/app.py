import falcon
from .datalad import DataladStore
from .dataset import DatasetResource
from .files import FilesResource
from .snapshots import SnapshotResource
from .heartbeat import HeartbeatResource


def create_app(annex_path):
    api = application = falcon.API()

    store = DataladStore(annex_path)

    heartbeat = HeartbeatResource()
    datasets = DatasetResource(store)
    dataset_files = FilesResource(store)
    dataset_snapshots = SnapshotResource(store)

    api.add_route('/heartbeat', heartbeat)

    api.add_route('/datasets', datasets)
    api.add_route('/datasets/{dataset}', datasets)

    api.add_route('/datasets/{dataset}/files', dataset_files)
    api.add_route('/datasets/{dataset}/files/{filename}', dataset_files)

    api.add_route('/datasets/{dataset}/snapshot/{snapshot}', dataset_snapshots)

    return api
