import redis.asyncio as redis

from datalad_service import config


def redis_client():
    return redis.from_url(f'redis://{config.REDIS_HOST}:{config.REDIS_PORT}/8')
