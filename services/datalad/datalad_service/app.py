import socket

import falcon
import falcon.asgi
import sentry_sdk

import datalad_service.config
import datalad_service.version
from datalad_service.datalad import DataladStore
from datalad_service.handlers.dataset import DatasetResource
from datalad_service.handlers.draft import DraftResource
from datalad_service.handlers.drop import DropResource
from datalad_service.handlers.description import DescriptionResource
from datalad_service.handlers.files import FilesResource
from datalad_service.handlers.objects import ObjectsResource
from datalad_service.handlers.annex_objects import AnnexObjectsResource
from datalad_service.handlers.history import HistoryResource
from datalad_service.handlers.snapshots import SnapshotResource
from datalad_service.handlers.heartbeat import HeartbeatResource
from datalad_service.handlers.publish import PublishResource
from datalad_service.handlers.tree import TreeResource
from datalad_service.handlers.upload import UploadResource
from datalad_service.handlers.upload_file import UploadFileResource
from datalad_service.handlers.validation import ValidationResource
from datalad_service.handlers.git import (
    GitRefsResource,
    GitReceiveResource,
    GitUploadResource,
)
from datalad_service.handlers.annex import GitAnnexResource
from datalad_service.handlers.reexporter import ReexporterResource
from datalad_service.handlers.reset import ResetResource
from datalad_service.handlers.remote_import import RemoteImportResource
from datalad_service.handlers.info import InfoResource
from datalad_service.handlers.fsck import FsckResource
from datalad_service.middleware.auth import AuthenticateMiddleware
from datalad_service.middleware.error import CustomErrorHandlerMiddleware


def before_send(event):
    """Drop transactions that are marked as excluded."""
    if event.get('transaction') == 'excluded':
        return None
    return event


sentry_sdk.init(
    dsn=datalad_service.config.SENTRY_DSN,
    # Set traces_sample_rate to 1.0 to capture 100%
    # of transactions for performance monitoring.
    traces_sample_rate=1.0,
    # Set profiles_sample_rate to 1.0 to profile 100%
    # of sampled transactions.
    # We recommend adjusting this value in production.
    profiles_sample_rate=1.0,
    release=f'openneuro-datalad-service@{datalad_service.version.get_version()}',
    server_name=socket.gethostname(),
    before_send=before_send,
    _experiments={
        'enable_logs': True,
    },
)


class PathConverter(falcon.routing.converters.BaseConverter):
    """: is used because it is human readable as a separator, disallowed in filenames on Windows, and very rare in Unix filenames."""

    def convert(self, value):
        return value.replace(':', '/')


def create_app():
    if not datalad_service.config.DATALAD_DATASET_PATH:
        raise Exception(
            'Required DATALAD_DATASET_PATH environment variable is not defined'
        )

    middleware = [AuthenticateMiddleware(), CustomErrorHandlerMiddleware()]

    app = falcon.asgi.App(middleware=middleware)
    app.router_options.converters['path'] = PathConverter

    store = DataladStore(datalad_service.config.DATALAD_DATASET_PATH)

    heartbeat = HeartbeatResource()
    datasets = DatasetResource(store)
    dataset_draft = DraftResource(store)
    dataset_validation = ValidationResource(store)
    dataset_history = HistoryResource(store)
    dataset_drop = DropResource(store)
    dataset_description = DescriptionResource(store)
    dataset_files = FilesResource(store)
    dataset_objects = ObjectsResource(store)
    dataset_annex_objects = AnnexObjectsResource(store)
    dataset_publish = PublishResource(store)
    dataset_tree = TreeResource(store)
    dataset_snapshots = SnapshotResource(store)
    dataset_upload = UploadResource(store)
    dataset_upload_file = UploadFileResource(store)
    dataset_git_refs_resource = GitRefsResource(store)
    dataset_git_receive_resource = GitReceiveResource(store)
    dataset_git_upload_resource = GitUploadResource(store)
    dataset_git_annex_resource = GitAnnexResource(store)
    dataset_reexporter_resources = ReexporterResource(store)
    dataset_reset_resource = ResetResource(store)
    dataset_remote_import_resource = RemoteImportResource(store)
    dataset_info_resource = InfoResource(store)
    dataset_fsck_resource = FsckResource(store)

    app.add_route('/heartbeat', heartbeat)

    app.add_route('/datasets', datasets)
    app.add_route('/datasets/{dataset}', datasets)

    app.add_route('/datasets/{dataset}/draft', dataset_draft)
    app.add_route('/datasets/{dataset}/history', dataset_history)
    app.add_route('/datasets/{dataset}/drop', dataset_drop)
    app.add_route('/datasets/{dataset}/description', dataset_description)
    app.add_route('/datasets/{dataset}/validate/{hexsha}', dataset_validation)
    app.add_route('/datasets/{dataset}/reset/{hexsha}', dataset_reset_resource)
    app.add_route('/datasets/{dataset}/fsck', dataset_fsck_resource)
    app.add_route('/datasets/{dataset}/info', dataset_info_resource)
    app.add_route('/datasets/{dataset}/info/{name}', dataset_info_resource)
    app.add_route('/datasets/{dataset}/files', dataset_files)
    app.add_route('/datasets/{dataset}/files/{filename:path}', dataset_files)
    app.add_route('/datasets/{dataset}/tree/{tree}', dataset_tree)
    app.add_route('/datasets/{dataset}/objects/{obj}', dataset_objects)

    app.add_route('/datasets/{dataset}/snapshots', dataset_snapshots)
    app.add_route('/datasets/{dataset}/snapshots/{snapshot}', dataset_snapshots)
    app.add_route('/datasets/{dataset}/snapshots/{snapshot}/files', dataset_files)
    app.add_route(
        '/datasets/{dataset}/snapshots/{snapshot}/files/{filename:path}', dataset_files
    )
    app.add_route(
        '/datasets/{dataset}/snapshots/{snapshot}/annex-key/{annex_key}',
        dataset_annex_objects,
    )

    app.add_route('/datasets/{dataset}/publish', dataset_publish)
    app.add_route('/datasets/{dataset}/reexport-remotes', dataset_reexporter_resources)

    app.add_route('/datasets/{dataset}/upload/{upload}', dataset_upload)
    app.add_route(
        '/uploads/{worker}/{dataset}/{upload}/{filename:path}', dataset_upload_file
    )

    app.add_route('/git/{worker}/{dataset}/info/refs', dataset_git_refs_resource)
    app.add_route(
        '/git/{worker}/{dataset}/git-receive-pack', dataset_git_receive_resource
    )
    app.add_route(
        '/git/{worker}/{dataset}/git-upload-pack', dataset_git_upload_resource
    )
    app.add_route('/git/{worker}/{dataset}/annex/{key}', dataset_git_annex_resource)
    # Serving keys internally as well (read only)
    app.add_route('/datasets/{dataset}/annex/{key}', dataset_git_annex_resource)

    app.add_route(
        '/datasets/{dataset}/import/{import_id}', dataset_remote_import_resource
    )

    return app
