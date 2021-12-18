from elasticsearch import Elasticsearch
from datetime import datetime
from datalad_service.config import ELASTICSEARCH_CONNECTION


class ValidationLogger:
    def __init__(self, dataset_id, user):
        self.es = Elasticsearch([ELASTICSEARCH_CONNECTION])
        self.dataset_id = dataset_id
        self.user = user

    def log(self, stdout, stderr, error):
        body = {
            'dataset_id': self.dataset_id,
            'stdout': str(stdout),
            'stderr': str(stderr),
            'error': str(error),
            'timestamp': datetime.now(),
            'user': self.user
        }
        self.es.index(index='logs-validation', body=body)
