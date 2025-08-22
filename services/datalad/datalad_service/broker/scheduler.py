from taskiq import TaskiqScheduler
from taskiq.schedule_sources import LabelScheduleSource
from taskiq_redis import RedisScheduleSource

from datalad_service import config
from datalad_service.broker import broker

redis_source = RedisScheduleSource(f'redis://{config.REDIS_HOST}:{config.REDIS_PORT}/0')
label_source = LabelScheduleSource(broker)
scheduler = TaskiqScheduler(broker, sources=[redis_source, label_source])
