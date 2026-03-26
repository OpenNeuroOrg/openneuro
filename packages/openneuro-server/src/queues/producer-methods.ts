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
export function queueDataRetentionCheck(datasetId: string) {
  try {
    const msg = new ProducibleMessage()
    msg.setQueue(OpenNeuroQueues.DATARETENTION).setBody({ datasetId })
    producer.produce(msg, (err) => {
      if (err) {
        Sentry.captureException(err)
      }
    })
  } catch (err) {
    Sentry.captureException(err)
  }
}
