import asyncio

import pytest

from datalad_service.tasks.validator import validate_dataset_deno_call
from unittest.mock import Mock
from types import SimpleNamespace


class MockLogger:
    pass


async def test_validator_error(new_dataset):
    logger = MockLogger()
    logger.info = Mock()
    logger.error = Mock()
    logger.exception = Mock()
    await validate_dataset_deno_call(new_dataset.path, 'HEAD', logger)
    # new_dataset completes validation with errors, should not call logger
    assert not logger.exception.called


@pytest.fixture
def mock_validator_crash(monkeypatch):
    async def return_bad_json(*args, **kwargs):
        async def noop():
            pass

        async def invalidJson():
            return (b'{invalidJson', b'')

        return SimpleNamespace(wait=noop, kill=noop, communicate=invalidJson)

    monkeypatch.setattr(asyncio, 'create_subprocess_exec', return_bad_json)


async def test_validator_bad_json(new_dataset, mock_validator_crash):
    logger = MockLogger()
    logger.info = Mock()
    logger.error = Mock()
    logger.exception = Mock()
    await validate_dataset_deno_call(new_dataset.path, 'HEAD', logger)
    assert logger.exception.called
