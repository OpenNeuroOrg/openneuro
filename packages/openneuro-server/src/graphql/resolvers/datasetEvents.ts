import DatasetEvent from "../../models/datasetEvents"
import { checkDatasetAdmin } from "../permissions"
import type {
  DatasetEventContributorRequest,
  DatasetEventContributorResponse,
  DatasetEventDocument,
} from "../../models/datasetEvents"
import { UserNotificationStatus } from "../../models/userNotificationStatus"
import type { UserNotificationStatusDocument } from "../../models/userNotificationStatus"
import {
  getDataciteYml,
  updateContributorsUtil,
} from "../../utils/datacite-utils"
import type { Contributor } from "../../types/datacite"
type EnrichedDatasetEvent = Omit<DatasetEventDocument, "notificationStatus"> & {
  hasBeenRespondedTo?: boolean
  responseStatus?: "accepted" | "denied" // for contributorRequest
  citationStatus?: "pending" | "approved" | "denied" // for contributorCitation
  notificationStatus?:
    | "UNREAD"
    | "SAVED"
    | "ARCHIVED"
    | UserNotificationStatusDocument
}

/**
 * Get all events for a dataset
 */
export async function datasetEvents(obj, _, { userInfo, user }) {
  const allEvents: DatasetEventDocument[] = await DatasetEvent.find({
    datasetId: obj.id,
  })
    .sort({ timestamp: -1 })
    .populate("user")
    .populate({
      path: "notificationStatus",
      match: { userId: user },
    })
    .exec()

  // Map contributor responses by requestId
  const responsesMap = new Map<string, DatasetEventDocument>()
  allEvents.forEach((event) => {
    if (
      event.event.type === "contributorResponse" && "requestId" in event.event
    ) {
      responsesMap.set(event.event.requestId, event)
    }
  })

  const enrichedEvents: EnrichedDatasetEvent[] = allEvents.map((event) => {
    const enrichedEvent = event.toObject() as EnrichedDatasetEvent

    // Default UNREAD if no notification exists for this user
    if (!enrichedEvent.notificationStatus) {
      enrichedEvent.notificationStatus = {
        status: "UNREAD",
      } as UserNotificationStatusDocument
    } else if (typeof enrichedEvent.notificationStatus === "string") {
      enrichedEvent.notificationStatus = {
        status: enrichedEvent.notificationStatus,
      } as UserNotificationStatusDocument
    }

    if (isContributorRequest(event)) {
      const requestId = event.event.requestId
      const response = responsesMap.get(requestId)
      if (response && isContributorResponse(response)) {
        enrichedEvent.hasBeenRespondedTo = true
        enrichedEvent.responseStatus = response.event.status
      }
    } else if (event.event.type === "contributorCitation") {
      enrichedEvent.hasBeenRespondedTo =
        event.event.resolutionStatus !== "pending"
      enrichedEvent.citationStatus = event.event.resolutionStatus
    }

    return enrichedEvent
  })

  if (userInfo.admin) {
    return enrichedEvents
  } else {
    return enrichedEvents.filter((event) => {
      const hasAdminFlag = "admin" in event.event && event.event.admin
      const isRespondedToRequest = (event.event.type === "contributorRequest" &&
        event.hasBeenRespondedTo) ||
        (event.event.type === "contributorCitation" && event.hasBeenRespondedTo)
      return !hasAdminFlag || isRespondedToRequest
    })
  }
}

function isContributorRequest(
  event: DatasetEventDocument,
): event is DatasetEventDocument & { event: DatasetEventContributorRequest } {
  return event.event.type === "contributorRequest"
}

function isContributorResponse(
  event: DatasetEventDocument,
): event is DatasetEventDocument & { event: DatasetEventContributorResponse } {
  return event.event.type === "contributorResponse"
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
    event: { type: "contributorRequest", datasetId },
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
  // Only site admin users can create or update a note
  if (!userInfo?.admin) throw new Error("Not authorized")

  if (id) {
    const updatedEvent = await DatasetEvent.findOneAndUpdate(
      { id, datasetId },
      { note },
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
      event: { type: "note", admin: true, datasetId },
      success: true,
      note,
    })
    await newEvent.save()
    await newEvent.populate("user")
    return newEvent
  }
}

/**
 * Field-level resolvers for DatasetEvent
 * These expose the computed/enriched fields to GraphQL
 */
export const DatasetEventResolvers = {
  hasBeenRespondedTo: (event: EnrichedDatasetEvent) =>
    event.hasBeenRespondedTo ?? false,
  responseStatus: (event: EnrichedDatasetEvent) => event.responseStatus ?? null,
  notificationStatus: (event: EnrichedDatasetEvent) =>
    typeof event.notificationStatus === "object"
      ? event.notificationStatus
      : { status: event.notificationStatus ?? "UNREAD" },
}

/**
 * Process a contributor request (accept or deny) and log an event.
 * This mutation should only be callable by users with admin privileges on the dataset.
 */
export async function processContributorRequest(
  obj: unknown,
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
      requestId,
      targetUserId,
      status,
      reason,
      datasetId,
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

/**
 * Update a user's notification status for a specific event
 */
export async function updateEventStatus(
  obj,
  { eventId, status },
  { user },
) {
  if (!user) throw new Error("Authentication required.")

  const updatedStatus = await UserNotificationStatus.findOneAndUpdate(
    { userId: user, datasetEventId: eventId },
    { status },
    { new: true, upsert: true },
  )

  return updatedStatus
}

/**
 * Create a 'contributor citation' event
 */
export async function createContributorCitationEvent(
  obj,
  {
    datasetId,
    targetUserId,
    contributorType,
    contributorData,
  }: {
    datasetId: string
    targetUserId: string
    contributorType: string
    contributorData: {
      orcid?: string
      name?: string
      email?: string
      userId?: string
    }
  },
  { user }: { user: string },
) {
  if (!user) {
    throw new Error("Authentication required to create contributor citation.")
  }

  const event = new DatasetEvent({
    datasetId,
    userId: user,
    event: {
      type: "contributorCitation",
      datasetId,
      addedBy: user,
      targetUserId,
      contributorType,
      contributorData,
      resolutionStatus: "pending",
    },
    success: true,
    note: `User ${user} added a contributor citation for user ${targetUserId}.`,
  })

  await event.save()
  await event.populate("user")
  return event
}

/**
 * Process a contributor citation (approve or deny)
 * This mutation should only be callable by the target user
 */
export async function processContributorCitation(
  obj,
  {
    eventId,
    status,
  }: {
    eventId: string
    status: "approved" | "denied"
  },
  { user }: { user: string },
) {
  if (!user) {
    throw new Error("Authentication required to process contributor citation.")
  }

  // Find the citation event
  const citationEvent = await DatasetEvent.findById(eventId)
  if (!citationEvent || citationEvent.event.type !== "contributorCitation") {
    throw new Error("Contributor citation event not found.")
  }

  // Only the target user can approve/deny
  if (citationEvent.event.targetUserId !== user) {
    throw new Error("Not authorized to respond to this contributor citation.")
  }

  // Must still be pending
  if (citationEvent.event.resolutionStatus !== "pending") {
    throw new Error("This contributor citation has already been responded to.")
  }

  // Update status
  citationEvent.event.resolutionStatus = status
  await citationEvent.save()
  await citationEvent.populate("user")

  if (status === "approved") {
    const { contributorData } = citationEvent.event
    if (!contributorData) {
      throw new Error("Contributor data missing in citation event.")
    }

    // Fetch existing contributors from Datacite YAML
    const existingDatacite = await getDataciteYml(citationEvent.datasetId)
    const existingContributors =
      existingDatacite?.data.attributes.contributors || []

    // Map existing contributors
    const mappedExisting: Contributor[] = existingContributors.map((
      c,
      index,
    ) => ({
      name: c.name || "Unknown Contributor",
      givenName: "",
      familyName: "",
      orcid: c.nameIdentifiers?.[0]?.nameIdentifier,
      contributorType: c.contributorType || "Researcher",
      order: index + 1,
    }))

    // Add the new contributor
    const newContributor: Contributor = {
      name: contributorData.name || "Unknown Contributor",
      givenName: "",
      familyName: "",
      orcid: contributorData.orcid,
      contributorType: "Researcher",
      order: mappedExisting.length + 1,
    }

    const updatedContributors = [...mappedExisting, newContributor]

    await updateContributorsUtil(
      citationEvent.datasetId,
      updatedContributors,
      user,
    )
  }

  return citationEvent
}
