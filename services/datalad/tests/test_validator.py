import asyncio

import pytest

from datalad_service.tasks.validator import (
    sanitize_age,
    sanitize_subject_metadata,
    validate_dataset_deno_call,
)
from unittest.mock import Mock
from types import SimpleNamespace


@pytest.mark.parametrize(
    "age, expected",
    [
        (25, 25.0),
        (25.5, 25.5),
        (0, 0.0),
        (-1, -1.0),
        (float("nan"), None),
        (float("inf"), None),
        (float("-inf"), None),
        ("89+", None),
        ("25", None),
        (None, None),
    ],
)
def test_sanitize_age(age, expected):
    result = sanitize_age(age)
    if expected is None:
        assert result is None
    else:
        assert result == expected


def test_sanitize_subject_metadata():
    metadata = [
        {"participantId": "01", "age": 25, "sex": "M"},
        {"participantId": "02", "age": "89+", "sex": "F"},
        {"participantId": "03", "sex": "M"},
    ]
    result = sanitize_subject_metadata(metadata)
    assert result[0]["age"] == 25.0
    assert result[1]["age"] is None
    assert result[2]["age"] is None


def test_sanitize_subject_metadata_passthrough():
    assert sanitize_subject_metadata(None) is None
    assert sanitize_subject_metadata([]) == []


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
