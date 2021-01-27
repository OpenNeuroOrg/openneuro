import os
import re
import logging
from elasticsearch import Elasticsearch
from datetime import datetime
from datalad_service.config import ELASTICSEARCH_CONNECTION
from contextlib import contextmanager

class ReexportLogger:
    def __init__(self, dataset_id):
        self.logger = logging.getLogger('datalad_service.' + __name__)
        self.es = Elasticsearch([ELASTICSEARCH_CONNECTION])
        self.dataset_id = dataset_id
        self.process_start = datetime.now()

    def log(self, tag, s3_export_successful, github_export_successful, error):
        body = {
            'dataset_id': self.dataset_id,
            'tag': tag,
            's3_export_successful': s3_export_successful,
            'github_export_successful': github_export_successful,
            'error': str(error),
            'timestamp': datetime.now(),
            'process_start': self.process_start,
        }
        self.es.index(index="logs-reexporter", body=body)