import falcon
from .datalad import DataladStore
from .dataset import DatasetResource
from .files import FilesResource
from .snapshots import SnapshotResource
from .heartbeat import HeartbeatResource


class PathConverter(falcon.routing.converters.BaseConverter):
    """: is used because it is human readable as a separator, disallowed in filenames on Windows, and very rare in Unix filenames."""
    def convert(self, value):
        return value.replace(':', '/')


def create_app(annex_path):
    api = application = falcon.API()
    api.router_options.converters['path'] = PathConverter

    store = DataladStore(annex_path)

    heartbeat = HeartbeatResource()
    datasets = DatasetResource(store)
    dataset_files = FilesResource(store)
    dataset_snapshots = SnapshotResource(store)

    api.add_route('/heartbeat', heartbeat)

    api.add_route('/datasets', datasets)
    api.add_route('/datasets/{dataset}', datasets)

    api.add_route('/datasets/{dataset}/files', dataset_files)
    api.add_route('/datasets/{dataset}/files/{filename:path}', dataset_files)

    api.add_route('/datasets/{dataset}/snapshots', dataset_snapshots)
    api.add_route('/datasets/{dataset}/snapshots/{snapshot}', dataset_snapshots)

    return api
