import type { Consumer } from "redis-smq"
import { reindexDataset } from "../elasticsearch/reindex-dataset"
import { OpenNeuroQueues } from "./queues"
import * as Sentry from "@sentry/node"

export function startConsumer(consumer: Consumer) {
  const reindexMessageHandler = async (msg, cb) => {
    // Index one dataset
    reindexDataset(msg.body.datasetId).then(cb)
  }

  consumer.consume(OpenNeuroQueues.INDEXING, reindexMessageHandler, (err) => {
    if (err) {
      Sentry.captureException(err)
    }
  })
  return consumer
}
