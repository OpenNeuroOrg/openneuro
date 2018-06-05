import falcon
from datalad_service.datalad import DataladStore
from datalad_service.handlers.dataset import DatasetResource
from datalad_service.handlers.draft import DraftResource
from datalad_service.handlers.files import FilesResource
from datalad_service.handlers.snapshots import SnapshotResource
from datalad_service.handlers.heartbeat import HeartbeatResource
from datalad_service.handlers.publish import PublishResource


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
    dataset_draft = DraftResource(store)
    dataset_files = FilesResource(store)
    dataset_publish = PublishResource(store)
    dataset_snapshots = SnapshotResource(store)

    api.add_route('/heartbeat', heartbeat)

    api.add_route('/datasets', datasets)
    api.add_route('/datasets/{dataset}', datasets)

    api.add_route('/datasets/{dataset}/draft', dataset_draft)

    api.add_route('/datasets/{dataset}/files', dataset_files)
    api.add_route('/datasets/{dataset}/files/{filename:path}', dataset_files)

    api.add_route('/datasets/{dataset}/snapshots', dataset_snapshots)
    api.add_route(
        '/datasets/{dataset}/snapshots/{snapshot}', dataset_snapshots)
    api.add_route(
        '/datasets/{dataset}/snapshots/{snapshot}/files', dataset_files)
    api.add_route(
        '/datasets/{dataset}/snapshots/{snapshot}/files/{filename:path}', dataset_files)

    api.add_route(
        '/datasets/{dataset}/publish', dataset_publish
    )
    return api
