import { Queue } from "redis-smq"
import { EQueueDeliveryModel, EQueueType, QueueRateLimit } from "redis-smq"

export enum OpenNeuroQueues {
  INDEXING = "elasticsearch_indexing",
  DATARETENTION = "data_retention",
}

function saveQueue(
  name: string,
  type: EQueueType,
  delivery: EQueueDeliveryModel,
): Promise<void> {
  return new Promise((resolve, reject) => {
    const queue = new Queue()
    queue.save(name, type, delivery, (err) => {
      if (err && err.name !== "QueueQueueExistsError") {
        reject(err)
      } else {
        resolve()
      }
    })
  })
}

function setRateLimit(
  name: string,
  limit: number,
  interval: number,
): Promise<void> {
  return new Promise((resolve, reject) => {
    const queueRateLimit = new QueueRateLimit()
    queueRateLimit.set(name, { limit, interval }, (err) => {
      if (err) {
        reject(err)
      } else {
        resolve()
      }
    })
  })
}

export async function setupQueues(): Promise<void> {
  await saveQueue(
    OpenNeuroQueues.INDEXING,
    EQueueType.FIFO_QUEUE,
    EQueueDeliveryModel.POINT_TO_POINT,
  )
  await saveQueue(
    OpenNeuroQueues.DATARETENTION,
    EQueueType.FIFO_QUEUE,
    EQueueDeliveryModel.POINT_TO_POINT,
  )

  // Limit indexing queue to 8 runs per minute to avoid stacking indexing excessively
  await setRateLimit(OpenNeuroQueues.INDEXING, 8, 60000)

  // Rate limit data retention queue to 16 runs per minute
  await setRateLimit(OpenNeuroQueues.DATARETENTION, 16, 60000)
}
