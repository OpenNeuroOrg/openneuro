import { ProducibleMessage } from "redis-smq"
import { producer } from "./setup"
import { OpenNeuroQueues } from "./queues"
import * as Sentry from "@sentry/node"

/**
 * Queue search indexing for a dataset
 * @param datasetId Dataset to index
 */
export function queueIndexDataset(datasetId: string) {
  try {
    const msg = new ProducibleMessage()
    msg.setQueue(OpenNeuroQueues.INDEXING).setBody({ datasetId })
    producer.produce(msg, (err) => {
      if (err) {
        Sentry.captureException(err)
      }
    })
  } catch (err) {
    Sentry.captureException(err)
  }
}

/**
 * Queue data retention check for a dataset
 * @param datasetId Dataset to check
 */
export async function queueDataRetentionCheck(
  datasetId: string,
): Promise<void> {
  try {
    const msg = new ProducibleMessage()
    msg.setQueue(OpenNeuroQueues.DATARETENTION).setBody({ datasetId })
    msg.setTTL(64800000) // 18 hours in ms to survive the consumer rate limits
    await new Promise<void>((resolve, reject) => {
      producer.produce(msg, (err) => {
        if (err) reject(err)
        else resolve()
      })
    })
  } catch (err) {
    Sentry.captureException(err)
  }
}
