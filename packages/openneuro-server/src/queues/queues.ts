import { Queue } from "redis-smq"
import { EQueueDeliveryModel, EQueueType, QueueRateLimit } from "redis-smq"
import * as Sentry from "@sentry/node"

export enum OpenNeuroQueues {
  INDEXING = "elasticsearch_indexing",
}

export function setupQueues() {
  const indexingQueue = new Queue()
  indexingQueue.save(
    OpenNeuroQueues.INDEXING,
    EQueueType.FIFO_QUEUE,
    EQueueDeliveryModel.POINT_TO_POINT,
    (err) => {
      // The queue may already exist, don't log that error
      if (err !== "QueueQueueExistsError") {
        Sentry.captureException(err)
      }
    },
  )

  // Limit indexing queue to 8 runs per minute to avoid stacking indexing excessively
  const queueRateLimit = new QueueRateLimit()
  queueRateLimit.set(
    OpenNeuroQueues.INDEXING,
    { limit: 8, interval: 60000 },
    (err) => {
      if (err) {
        Sentry.captureException(err)
      }
    },
  )
}
