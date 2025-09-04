import sys

from taskiq import InMemoryBroker, SmartRetryMiddleware
from taskiq_redis import RedisAsyncResultBackend, RedisStreamBroker


from datalad_service import config
from datalad_service.broker.get_docker_scale import get_docker_scale
from datalad_service.broker.worker_middleware import WorkerMiddleware

# Use InMemoryBroker to run during pytest
if 'pytest' in sys.modules:
    broker = InMemoryBroker()
else:
    redis_url = f'redis://{config.REDIS_HOST}:{config.REDIS_PORT}/8'
    worker_id = get_docker_scale()
    worker_name = f'worker-{worker_id}'
    result_backend = RedisAsyncResultBackend(
        redis_url=redis_url,
        result_ex_time=5000,
    )
    broker = (
        RedisStreamBroker(
            url=redis_url,
            queue_name=worker_name,
        )
        .with_result_backend(result_backend)
        .with_middlewares(
            WorkerMiddleware(worker_id),
            SmartRetryMiddleware(
                default_retry_count=3,
                default_delay=10,
                use_jitter=True,
                use_delay_exponent=True,
                max_delay_exponent=120,
            ),
        )
    )
