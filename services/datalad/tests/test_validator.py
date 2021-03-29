import json

from .dataset_fixtures import *
from datalad_service.tasks.validator import validate_dataset_sync
from unittest.mock import Mock

class MockLogger: 
    pass

def test_validator(new_dataset):
    logger = MockLogger()
    logger.log = Mock()
    validate_dataset_sync(new_dataset.path, 'HEAD', logger)
    # new_dataset doesn't pass validation, should catch the error and log it
    assert logger.log.called
