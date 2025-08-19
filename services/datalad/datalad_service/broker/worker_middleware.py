from taskiq import TaskiqMessage, TaskiqMiddleware


class WorkerMiddleware(TaskiqMiddleware):
    """
    This middleware adds a custom worker label to outgoing tasks scheduled by workers.
    """

    def __init__(self, worker_id=None):
        self.worker_id = worker_id

    async def pre_send(self, message: TaskiqMessage) -> TaskiqMessage:
        if self.worker_id:
            message.labels['worker'] = self.worker_id
        return message
