import logging

import falcon
import sentry_sdk
from sentry_sdk.integrations.falcon import FalconIntegration
from falcon_elastic_apm import ElasticApmMiddleware

import datalad_service.config
from datalad_service.tasks.audit import audit_datasets
from datalad_service.datalad import DataladStore
from datalad_service.handlers.dataset import DatasetResource
from datalad_service.handlers.draft import DraftResource
from datalad_service.handlers.description import DescriptionResource
from datalad_service.handlers.files import FilesResource
from datalad_service.handlers.history import HistoryResource
from datalad_service.handlers.snapshots import SnapshotResource
from datalad_service.handlers.heartbeat import HeartbeatResource
from datalad_service.handlers.publish import PublishResource
from datalad_service.handlers.upload import UploadResource
from datalad_service.handlers.upload_file import UploadFileResource
from datalad_service.handlers.validation import ValidationResource
from datalad_service.handlers.git import GitRefsResource, GitReceiveResource, GitUploadResource
from datalad_service.middleware.auth import AuthenticateMiddleware


class PathConverter(falcon.routing.converters.BaseConverter):
    """: is used because it is human readable as a separator, disallowed in filenames on Windows, and very rare in Unix filenames."""

    def convert(self, value):
        return value.replace(':', '/')


def create_app(annex_path):
    # If running under gunicorn, use that logger
    gunicorn_logger = logging.getLogger('gunicorn.error')
    logging.basicConfig(handlers=gunicorn_logger.handlers,
                        level=gunicorn_logger.level)
    if datalad_service.config.SENTRY_DSN:
        sentry_sdk.init(
            dsn=datalad_service.config.SENTRY_DSN,
            integrations=[FalconIntegration()]
        )

    middleware = [AuthenticateMiddleware()]
    if datalad_service.config.ELASTIC_APM_SERVER_URL:
        middleware.append(ElasticApmMiddleware(service_name='datalad-service',
                                               server_url=datalad_service.config.ELASTIC_APM_SERVER_URL))

    api = falcon.API(
        middleware=middleware)
    api.router_options.converters['path'] = PathConverter

    store = DataladStore(annex_path)

    heartbeat = HeartbeatResource()
    datasets = DatasetResource(store)
    dataset_draft = DraftResource(store)
    dataset_validation = ValidationResource(store)
    dataset_history = HistoryResource(store)
    dataset_description = DescriptionResource(store)
    dataset_files = FilesResource(store)
    dataset_publish = PublishResource(store)
    dataset_snapshots = SnapshotResource(store)
    dataset_upload = UploadResource(store)
    dataset_upload_file = UploadFileResource(store)
    dataset_git_refs_resource = GitRefsResource(store)
    dataset_git_receive_resource = GitReceiveResource(store)
    dataset_git_upload_resource = GitUploadResource(store)

    api.add_route('/heartbeat', heartbeat)

    api.add_route('/datasets', datasets)
    api.add_route('/datasets/{dataset}', datasets)

    api.add_route('/datasets/{dataset}/draft', dataset_draft)
    api.add_route('/datasets/{dataset}/history', dataset_history)
    api.add_route('/datasets/{dataset}/description', dataset_description)
    api.add_route('/datasets/{dataset}/validate/{hexsha}', dataset_validation)

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

    api.add_route(
        '/datasets/{dataset}/upload/{upload}', dataset_upload
    )
    api.add_route(
        '/uploads/{worker}/{dataset}/{upload}/{filename:path}', dataset_upload_file
    )

    api.add_route('/git/{dataset}/info/refs', dataset_git_refs_resource)
    api.add_route('/git/{dataset}/git-receive-pack',
                  dataset_git_receive_resource)
    api.add_route('/git/{dataset}/git-upload-pack',
                  dataset_git_upload_resource)

    return api
