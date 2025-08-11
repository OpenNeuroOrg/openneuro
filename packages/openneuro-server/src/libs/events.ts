import DatasetEvent from "../models/datasetEvents"
import type {
  DatasetEventDocument,
  DatasetEventType,
} from "../models/datasetEvents"
import * as Sentry from "@sentry/node"
/**
 * Create a new dataset event
 */
export async function createEvent(
  datasetId: string,
  user: string,
  event: DatasetEventType,
  note: string = "",
  success: boolean = false,
): Promise<DatasetEventDocument> {
  // Save a Sentry breadcrumb to help debug complex server events
  const breadcrumb: Sentry.Breadcrumb = {
    category: "dataset-event",
    message: `${event.type} event created for dataset ${datasetId}`,
    level: "info",
    data: {
      datasetId,
      user,
      event,
      note,
    },
  }
  Sentry.addBreadcrumb(breadcrumb)

  if (!event.datasetId) {
    event.datasetId = datasetId
  }

  const created = new DatasetEvent({
    datasetId,
    userId: user,
    event,
    note,
    // Initially create the event as failed - update to success on successful state
    success,
  })
  await created.save()
  return created
}

/**
 * Call when event is finished to mark complete or add failure info
 */
export async function updateEvent(
  event: DatasetEventDocument,
  success: boolean = true,
) {
  event.success = success
  await event.save()
}
