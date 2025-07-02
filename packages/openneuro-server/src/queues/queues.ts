import { Queue } from "redis-smq"
import { EQueueDeliveryModel, EQueueType } from "redis-smq"
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
      if (err.name !== "QueueQueueExistsError") {
        Sentry.captureException(err)
      }
    },
  )
}
