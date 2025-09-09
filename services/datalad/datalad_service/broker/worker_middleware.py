import random
from datetime import datetime, timedelta, timezone, UTC
from typing import Any
import httpx
import logging
import jwt

from taskiq import TaskiqMessage, TaskiqMiddleware, TaskiqResult


from datalad_service import config

logger = logging.getLogger('datalad_service.' + __name__)

_UPDATE_WORKER_TASK_MUTATION = """
mutation UpdateWorkerTask(
  $id: ID!
  $args: JSON
  $kwargs: JSON
  $taskName: String
  $worker: String
  $queuedAt: DateTime
  $startedAt: DateTime
  $finishedAt: DateTime
  $error: String
  $executionTime: Int
) {
  updateWorkerTask(
    id: $id
    args: $args
    kwargs: $kwargs
    taskName: $taskName
    worker: $worker
    queuedAt: $queuedAt
    startedAt: $startedAt
    finishedAt: $finishedAt
    error: $error
    executionTime: $executionTime
  ) {
    id
  }
}
"""


def _update_worker_task_body(**kwargs):
    """Create a GraphQL mutation body for updateWorkerTask."""
    return {
        'query': _UPDATE_WORKER_TASK_MUTATION,
        'variables': kwargs,
        'operationName': 'UpdateWorkerTask',
    }


def generate_worker_token():
    utc_now = datetime.now(timezone.utc)
    one_day_ahead = utc_now + timedelta(hours=24)
    return jwt.encode(
        {
            'sub': 'dataset-worker',
            'iat': int(utc_now.timestamp()),
            'exp': int(one_day_ahead.timestamp()),
            'scopes': ['dataset:worker'],
        },
        config.get_jwt_secret(),
        algorithm='HS256',
    )


class WorkerMiddleware(TaskiqMiddleware):
    """
    This middleware adds a custom worker label to outgoing tasks scheduled by workers
    and reports task status back to the OpenNeuro API.
    """

    def __init__(self, worker_id=None):
        self.worker_id = worker_id

    async def pre_send(self, message: TaskiqMessage) -> TaskiqMessage:
        """Assign new tasks to the correct worker."""
        if self.worker_id:
            message.labels['queue_name'] = f'worker-{self.worker_id}'
        else:
            # Pick a random worker since this task was not assigned to one
            message.labels['queue_name'] = (
                f'worker-{random.randint(0, config.DATALAD_WORKERS - 1)}'
            )
        return message

    async def _update_task_status(self, **kwargs):
        """Helper to send updates to the GraphQL API."""
        api_token = generate_worker_token()
        body = _update_worker_task_body(**kwargs)
        try:
            async with httpx.AsyncClient() as client:
                response = await client.post(
                    url=config.GRAPHQL_ENDPOINT,
                    json=body,
                    headers={'Authorization': f'Bearer {api_token}'},
                )
                response.raise_for_status()
                response_json = response.json()
                if 'errors' in response_json:
                    logger.error(
                        f'GraphQL error updating task status: {response_json["errors"]}',
                    )
        except httpx.HTTPError as e:
            logger.error(f'HTTP error updating task status: {e}')
            logger.error(f'Response: {e.response.text}')
        except Exception as e:
            logger.error(f'Unexpected error updating task status: {e}')

    async def post_send(self, message: TaskiqMessage):
        """Called after a task is sent to the broker."""
        now = datetime.now(UTC).isoformat()
        await self._update_task_status(
            id=message.task_id,
            args=message.args,
            kwargs=message.kwargs,
            taskName=message.task_name,
            worker=message.labels.get('queue_name'),
            queuedAt=now,
        )

    async def pre_execute(self, message: TaskiqMessage) -> TaskiqMessage:
        """Called before a worker executes a task."""
        now = datetime.now(UTC).isoformat()
        await self._update_task_status(id=message.task_id, startedAt=now)
        return message

    async def post_execute(
        self,
        message: TaskiqMessage,
        result: TaskiqResult[Any],
    ):
        """Called after a worker executes a task."""
        now = datetime.now(UTC).isoformat()
        await self._update_task_status(
            id=message.task_id,
            finishedAt=now,
            error=None if result.error is None else repr(result.error),
            executionTime=round(result.execution_time * 1000),
        )
