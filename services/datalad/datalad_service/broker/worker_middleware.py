import random

from taskiq import TaskiqMessage, TaskiqMiddleware

from datalad_service import config


class WorkerMiddleware(TaskiqMiddleware):
    """
    This middleware adds a custom worker label to outgoing tasks scheduled by workers.
    """

    def __init__(self, worker_id=None):
        self.worker_id = worker_id

    async def pre_send(self, message: TaskiqMessage) -> TaskiqMessage:
        if self.worker_id:
            message.labels['queue_name'] = f'worker-{self.worker_id}'
        else:
            # Pick a random worker since this task was not assigned to one
            message.labels['queue_name'] = (
                f'worker-{random.randint(0, config.DATALAD_WORKERS - 1)}'
            )
        return message
