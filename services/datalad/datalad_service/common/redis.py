import redis

import datalad_service.config

redisClient = redis.Redis(host=datalad_service.config.REDIS_HOST)
