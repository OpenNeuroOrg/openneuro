import sys

from taskiq import InMemoryBroker
from taskiq_redis import RedisAsyncResultBackend, RedisStreamBroker


from datalad_service import config
from datalad_service.broker.get_docker_scale import get_docker_scale

# Use InMemoryBroker to run during pytest
if 'pytest' in sys.modules:
    broker = InMemoryBroker()
else:
    redis_url = f'redis://{config.REDIS_HOST}:{config.REDIS_PORT}/{get_docker_scale()}'
    result_backend = RedisAsyncResultBackend(
        redis_url=redis_url,
        result_ex_time=5000,
    )
    broker = RedisStreamBroker(
        url=redis_url,
    ).with_result_backend(result_backend)
