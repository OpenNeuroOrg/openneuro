import os
import re
from elasticsearch import Elasticsearch
from datetime import datetime
from datalad_service.config import ELASTICSEARCH_CONNECTION
from contextlib import contextmanager

class ReexportLogger:
    def __init__(self, dataset_id):
        self.es = Elasticsearch([ELASTICSEARCH_CONNECTION])
        self.dataset_id = dataset_id
        self.process_start = datetime.now()

    def log(self, tag, success, error):
        self.es.index(index="logs-reexporter", body={
            'dataset_id': self.dataset_id,
            'tag': tag,
            'export_successful': success,
            'error': error,
            'timestamp': datetime.now(),
            'process_start': self.process_start,
        })