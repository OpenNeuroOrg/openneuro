import DatasetEvent from "../models/datasetEvents"
import { DatasetEventTypes } from "../models/datasetEvents"
import * as Sentry from "@sentry/node"

/**
 * Create a new dataset event
 */
export async function createEvent(
  datasetId: string,
  type: DatasetEventTypes,
  user: string,
  description: string,
  note: string = "",
) {
  // Save a Sentry breadcrumb to help debug complex server events
  const breadcrumb: Sentry.Breadcrumb = {
    category: "dataset-event",
    message: `${type} event for dataset ${datasetId}`,
    level: "info",
    data: {
      datasetId,
      type,
      user,
      description,
      note,
    },
  }
  Sentry.addBreadcrumb(breadcrumb)
  const event = new DatasetEvent({
    datasetId,
    type,
    user,
    description,
    note,
  })
  return event.save()
}
