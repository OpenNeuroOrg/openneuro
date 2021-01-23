import os
from elasticsearch import Elasticsearch
from datetime import datetime
from datalad_service.config import ELASTICSEARCH_CONNECTION

es = Elasticsearch([ELASTICSEARCH_CONNECTION])

def log_reexporter(logger, stdout):
    process_start = datetime.now()
    delineator = ':::\n'
    packet = []
    for line in iter(stdout.readline, ':::DONE:::\n'):
        if line == delineator:
            text = ''.join(packet)
            # logger.debug(text)
            es.index(index="logs-reexporter", body={
                'text': text,
                'timestamp': datetime.now(),
                'process_start': process_start,
            })
            packet = []
        else:
            packet.append(line)
    logger.debug('process finished')