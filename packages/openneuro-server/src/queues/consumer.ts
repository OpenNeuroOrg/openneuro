import type { Consumer } from "redis-smq"
import { reindexDataset } from "../elasticsearch/reindex-dataset"
import { OpenNeuroQueues } from "./queues"
import * as Sentry from "@sentry/node"
import { checkDataRetentionNotifications } from "../datalad/dataRetentionNotifications"

export function startConsumer(consumer: Consumer) {
  const reindexMessageHandler = async (msg, cb) => {
    // Index one dataset
    reindexDataset(msg.body.datasetId).then(cb)
  }

  const dataRetentionMessageHandler = async (msg, cb) => {
    // Check data retention and send notifications for a dataset
    try {
      await checkDataRetentionNotifications(msg.body.datasetId)
      cb()
    } catch (err) {
      Sentry.captureException(err)
      cb()
    }
  }

  consumer.consume(OpenNeuroQueues.INDEXING, reindexMessageHandler, (err) => {
    if (err) {
      Sentry.captureException(err)
    }
  })

  consumer.consume(
    OpenNeuroQueues.DATARETENTION,
    dataRetentionMessageHandler,
    (err) => {
      if (err) {
        Sentry.captureException(err)
      }
    },
  )

  return consumer
}
