import { Configuration, Consumer, Producer } from "redis-smq"
import type { IRedisSMQConfig } from "redis-smq"
import { ERedisConfigClient } from "redis-smq-common"
import { startConsumer } from "./consumer"
import { setupQueues } from "./queues"
import { startDailySchedule } from "./queue-schedule"
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

export const producer = new Producer()
export const consumer = new Consumer()

function runProducer(): Promise<void> {
  return new Promise((resolve, reject) => {
    producer.run((err) => {
      if (err) reject(err)
      else resolve()
    })
  })
}

export async function initQueues() {
  await setupQueues()
  await runProducer()
  startConsumer(consumer)
  await startDailySchedule()
}
