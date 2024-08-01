import asyncio

import pytest

from datalad_service.tasks.validator import validate_dataset_call
from unittest.mock import Mock
from types import SimpleNamespace

class MockLogger:
    pass


async def test_validator_error(new_dataset):
    logger = MockLogger()
    logger.log = Mock()
    await validate_dataset_call(new_dataset.path, 'HEAD', logger)
    # new_dataset completes validation with errors, should not call logger
    assert not logger.log.called


@pytest.fixture
def mock_validator_crash(monkeypatch):
    async def return_bad_json(*args, **kwargs):
        async def noop():
            pass
        async def invalidJson():
            return (b'{invalidJson', b'')
        return SimpleNamespace(
            wait=noop,
            kill=noop,
            communicate=invalidJson
        )
    monkeypatch.setattr(asyncio, 'create_subprocess_exec', return_bad_json)


async def test_validator_bad_json(new_dataset, mock_validator_crash):
    logger = MockLogger()
    logger.log = Mock()
    await validate_dataset_call(new_dataset.path, 'HEAD', logger)
    assert logger.log.called
