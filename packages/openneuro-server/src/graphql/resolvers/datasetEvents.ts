import DatasetEvent from "../../models/datasetEvents"
import { checkDatasetAdmin } from "../permissions"
import { DatasetEventContributorRequest } from "../../models/datasetEvents"

/**
 * Get all events for a dataset
 */
export function datasetEvents(obj, _, { userInfo }) {
  if (userInfo.admin) {
    // Site admins can see all events
    return DatasetEvent.find({ datasetId: obj.id })
      .sort({ timestamp: -1 })
      .populate("user")
      .exec()
  } else {
    // Non-admin users can only see notes without the admin flag
    return DatasetEvent.find({
      datasetId: obj.id,
      $and: [
        { "event.admin": { $ne: true } },
        { "event.type": { "event.type": { $ne: "contributorRequest" } } }, // Maybe make this event.admin === true?
      ],
    })
      .sort({ timestamp: -1 })
      .populate("user")
      .exec()
  }
}

/**
 * Create a 'contributor request' event
 */
export async function createContributorRequestEvent(
  obj,
  { datasetId },
  { user },
) {
  if (!user) {
    throw new Error("Authentication required to request contributor status.")
  }

  const event = new DatasetEvent({
    datasetId,
    userId: user,
    event: {
      type: "contributorRequest",
      datasetId: datasetId,
    },
    success: true,
    note: "User requested contributor status for this dataset.",
  })
  ;(event.event as DatasetEventContributorRequest).requestId = event.id

  await event.save()
  await event.populate("user")

  return event
}

/**
 * Create or update an admin note event
 */
export async function saveAdminNote(
  obj,
  { id, datasetId, note },
  { user, userInfo },
) {
  // Only site admin users can create or update an admin note
  if (!userInfo?.admin) {
    throw new Error("Not authorized")
  }

  if (id) {
    const updatedEvent = await DatasetEvent.findOneAndUpdate(
      { id: id, datasetId },
      { note: note },
      { new: true },
    )
    if (!updatedEvent) {
      throw new Error(`Event with ID ${id} not found for dataset ${datasetId}.`)
    }
    await updatedEvent.populate("user")
    return updatedEvent
  } else {
    const newEvent = new DatasetEvent({
      datasetId,
      userId: user,
      event: {
        type: "note",
        admin: true,
      },
      success: true,
      note,
    })
    await newEvent.save()
    await newEvent.populate("user")
    return newEvent
  }
}

/**
 * Process a contributor request (accept or deny) and log an event.
 * This mutation should only be callable by users with admin privileges on the dataset.
 */
export async function processContributorRequest(
  obj: any,
  { datasetId, requestId, targetUserId, status, reason }: {
    datasetId: string
    requestId: string
    targetUserId: string
    status: "accepted" | "denied"
    reason?: string
  },
  { user: currentUserId, userInfo }: {
    user: string
    userInfo: { admin: boolean }
  },
) {
  if (!currentUserId) {
    throw new Error("Authentication required to process contributor requests.")
  }

  // --- Authorization Check ---
  await checkDatasetAdmin(datasetId, currentUserId, userInfo)

  if (status !== "accepted" && status !== "denied") {
    throw new Error("Invalid status. Must be 'accepted' or 'denied'.")
  }

  // Populate original requester (TODO - perms)
  const originalRequestEvent = await DatasetEvent.findOne({
    "event.type": "contributorRequest",
    "event.requestId": requestId,
  }).populate("user")
  // Check if originalRequestEvent is found and is of the correct type
  if (
    !originalRequestEvent ||
    originalRequestEvent.event.type !== "contributorRequest"
  ) {
    throw new Error(
      "Original contributor request event not found or is not a contributorRequest type.",
    )
  }

  // Check if it has already been responded to
  const existingResponse = await DatasetEvent.findOne({
    "event.type": "contributorResponse",
    "event.requestId": requestId,
  })

  if (existingResponse) {
    throw new Error("This contributor request has already been processed.")
  }

  originalRequestEvent.event.resolutionStatus = status
  await originalRequestEvent.save()

  // Create the response event
  const responseEvent = new DatasetEvent({
    datasetId,
    userId: currentUserId, // Admin processed the request
    event: {
      type: "contributorResponse",
      requestId: requestId,
      targetUserId: targetUserId, // user that requested
      status: status,
      reason: reason,
      datasetId: datasetId,
    },
    success: true,
    note: reason?.trim() ||
      `Admin ${currentUserId} processed contributor request for user ${targetUserId} as '${status}'.`,
  })

  await responseEvent.save()
  await responseEvent.populate("user")

  if (status === "accepted") {
    // TODO: Add logic here to modify permissions if ADMIN approved
  }

  return responseEvent
}
