import json

from .dataset_fixtures import *
from datalad_service.tasks.validator import validate_dataset_sync
from unittest.mock import Mock
from types import SimpleNamespace
from gevent import subprocess


class MockLogger:
    pass


def test_validator_error(new_dataset):
    logger = MockLogger()
    logger.log = Mock()
    validate_dataset_sync(new_dataset.path, 'HEAD', logger)
    # new_dataset completes validation with errors, should not call logger
    assert not logger.log.called


@pytest.fixture
def mock_validator_crash(monkeypatch):
    def return_bad_json(*args, **kwargs):
        return SimpleNamespace(stdout='{invalidJson', stderr='')
    monkeypatch.setattr(subprocess, 'run', return_bad_json)


def test_validator_bad_json(new_dataset, mock_validator_crash):
    logger = MockLogger()
    logger.log = Mock()
    validate_dataset_sync(new_dataset.path, 'HEAD', logger)
    assert logger.log.called
