from elasticsearch import Elasticsearch
from datetime import datetime
from datalad_service.config import ELASTICSEARCH_CONNECTION

es = Elasticsearch([ELASTICSEARCH_CONNECTION])

def log_reexporter(process):
    process_start = datetime.now()
    for line in iter(process.stdout.readline, ''):
        es.index(index="logs-reexporter", body={
            'text': line,
            'timestamp': datetime.now(),
            'process_start': process_start,
        })