import os
import re
from elasticsearch import Elasticsearch
from datetime import datetime
from datalad_service.config import ELASTICSEARCH_CONNECTION

def log_reexporter(logger, stdout):
    es = Elasticsearch([ELASTICSEARCH_CONNECTION])
    process_start = datetime.now()
    delineator = ':::\n'
    packet = []
    for line in iter(stdout.readline, ':::DONE:::\n'):
        if line == delineator:
            if not packet: continue
            match = re.search(r'^Exporting \/datalad\/(.*)\/\.$', packet[0])
            packet = packet[1:]
            if match:
                dataset_id = match.group(1)
            text = ''.join(packet)
            es.index(index="logs-reexporter", body={
                'dataset_id': dataset_id,
                'text': text,
                'timestamp': datetime.now(),
                'process_start': process_start,
            })
            packet = []
        else:
            packet.append(line)
    logger.debug('process finished')