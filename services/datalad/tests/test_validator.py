import json

from .dataset_fixtures import *
from datalad_service.tasks.validator import validate_dataset_sync


def test_validator(new_dataset):
    results = validate_dataset_sync(new_dataset.path, 'HEAD')
    # new_dataset doesn't pass validation, should return an error
    assert 'issues' in results
    assert 'errors' in results['issues']
    assert results['issues']['errors'][0]['key'] == 'QUICK_VALIDATION_FAILED'
