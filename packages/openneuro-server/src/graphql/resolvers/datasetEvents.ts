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
        { "event.admin": { $ne: true } }, // Exclude admin notes
        { "event.type": { $ne: "contributorRequest" } }, // Exclude contributorRequest events
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
  // Only site admin users can create an admin note
  if (!userInfo?.admin) {
    throw new Error("Not authorized")
  }
  if (id) {
    const event = await DatasetEvent.findOne({ id, datasetId })
    event.note = note
    await event.save()
    await event.populate("user")
    return event
  } else {
    const event = new DatasetEvent({
      id,
      datasetId,
      userId: user,
      event: {
        type: "note",
        admin: true,
      },
      success: true,
      note,
    })
    await event.save()
    await event.populate("user")
    return event
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
  context: { user: string; userInfo: { admin: boolean } },
) {
  const currentUserId = context.user

  if (!currentUserId) {
    throw new Error("Authentication required to process contributor requests.")
  }

  // --- Authorization Check ---
  await checkDatasetAdmin(datasetId, currentUserId, context.userInfo)

  if (status !== "accepted" && status !== "denied") {
    throw new Error("Invalid status. Must be 'accepted' or 'denied'.")
  }

  const originalRequestEvent = await DatasetEvent.findOne({
    "event.type": "contributorRequest", // Ensure it's a request
    "event.requestId": requestId, // Use the UUID string from the request
  })

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

  const responseEvent = new DatasetEvent({
    datasetId,
    userId: currentUserId,
    event: {
      type: "contributorResponse",
      requestId: requestId,
      targetUserId: targetUserId,
      status: status,
      reason: reason ||
        (status === "accepted"
          ? "Contributor access accepted."
          : "Contributor access denied."),
    },
    success: true,
    note:
      `Admin ${currentUserId} processed contributor request for user ${targetUserId} as '${status}'.`,
  })

  await responseEvent.save()
  await responseEvent.populate("user") // Populate the admin user who processed the request

  // --- TODO  ---
  if (status === "accepted") {
    // TODO: Add logic here to modify permissions if ADMIN approved
    // likely involve calling your `updatePermissions` or
    // `updateUsers` function check with Nell
  }
  // --- End of the TODO  ---

  return responseEvent
}
