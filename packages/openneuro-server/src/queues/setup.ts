import { Configuration, Consumer, Producer } from "redis-smq"
import type { IRedisSMQConfig } from "redis-smq"
import { ERedisConfigClient } from "redis-smq-common"
import { startConsumer } from "./consumer"
import { setupQueues } from "./queues"
import config from "../config"

const smqConfig: IRedisSMQConfig = {
  redis: {
    // Using ioredis as the Redis client
    client: ERedisConfigClient.IOREDIS,
    // Add any other ioredis options here
    options: {
      host: config.redis.host,
      port: config.redis.port,
    },
  },
}

Configuration.getSetConfig(smqConfig)

// Producer starts automatically
export const producer = new Producer()
export const consumer = new Consumer()

export function initQueues() {
  setupQueues()
  startConsumer(consumer)
}
