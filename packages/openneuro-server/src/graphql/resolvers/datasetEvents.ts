import DatasetEvent from "../../models/datasetEvents"
import User from "../../models/user"
import type { UserDocument } from "../../models/user"
import { checkDatasetAdmin } from "../permissions"
import type {
  DatasetEventContributorCitation,
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

/** Helper type guards */
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

function isContributorCitation(
  event: DatasetEventDocument,
): event is DatasetEventDocument & { event: DatasetEventContributorCitation } {
  return event.event.type === "contributorCitation"
}

/** Enriched type for GraphQL */
export type EnrichedDatasetEvent =
  & Omit<
    DatasetEventDocument,
    "notificationStatus"
  >
  & {
    hasBeenRespondedTo?: boolean
    responseStatus?: "pending" | "accepted" | "denied" | null
    notificationStatus?: UserNotificationStatusDocument
  }

const mapStatusToEnum = (status: "pending" | "accepted" | "denied" | null) => {
  if (!status) return null
  switch (status) {
    case "pending":
      return "PENDING"
    case "accepted":
      return "ACCEPTED"
    case "denied":
      return "DENIED"
  }
}

/**
 * Get all events for a dataset
 */
export async function datasetEvents(
  obj,
  _,
  { userInfo, user },
): Promise<EnrichedDatasetEvent[]> {
  const allEvents: DatasetEventDocument[] = await DatasetEvent.find({
    datasetId: obj.id,
  })
    .sort({ timestamp: -1 })
    .populate("user")
    .populate({ path: "notificationStatus", match: { userId: user } })

  const enriched: EnrichedDatasetEvent[] = allEvents.map((e) => {
    const ev = e.toObject() as EnrichedDatasetEvent

    if (!ev.notificationStatus || typeof ev.notificationStatus === "string") {
      ev.notificationStatus = new UserNotificationStatus({
        userId: user,
        datasetEventId: e.id,
        status: "UNREAD",
      }) as UserNotificationStatusDocument
    }

    if ("resolutionStatus" in e.event) {
      ev.responseStatus = e.event.resolutionStatus as
        | "pending"
        | "accepted"
        | "denied"
      ev.hasBeenRespondedTo = ev.responseStatus !== null &&
        ev.responseStatus !== "pending"
    } else {
      ev.responseStatus = null
      ev.hasBeenRespondedTo = false
    }

    return ev
  })

  return userInfo?.admin ? enriched : enriched.filter(
    (ev) =>
      !(ev.event.type === "note" && ev.event.admin) &&
      ev.event.type !== "permissionChange",
  )
}

// --- Field-level resolvers ---
export const DatasetEventResolvers = {
  hasBeenRespondedTo: (ev: EnrichedDatasetEvent) =>
    ev.hasBeenRespondedTo ?? false,
  responseStatus: (ev: EnrichedDatasetEvent) => ev.responseStatus ?? null,
  notificationStatus: (ev: EnrichedDatasetEvent) =>
    ev.notificationStatus?.status ?? "UNREAD",
  requestId: (ev: EnrichedDatasetEvent) =>
    isContributorRequest(ev) || isContributorResponse(ev)
      ? ev.event.requestId
      : null,
  target: async (ev: EnrichedDatasetEvent): Promise<UserDocument | null> => {
    let targetUserId: string | undefined

    if (isContributorResponse(ev) || isContributorCitation(ev)) {
      targetUserId = ev.event.targetUserId
    }

    if (!targetUserId) return null
    return User.findById(targetUserId)
  },
  user: async (ev: EnrichedDatasetEvent): Promise<UserDocument | null> =>
    ev.userId ? User.findById(ev.userId) : null,
  contributorData: (ev: EnrichedDatasetEvent) => {
    const data = (ev.event as any).contributorData || {}
    return {
      ...data,
      contributorType: data.contributorType || "Researcher", // fallback
    }
  },
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
      datasetId,
      resolutionStatus: "pending",
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
 * Process a contributor request (accept or deny)
 */
export async function processContributorRequest(
  obj: unknown,
  {
    datasetId,
    requestId,
    targetUserId,
    resolutionStatus,
    reason,
  }: {
    datasetId: string
    requestId: string
    targetUserId: string
    resolutionStatus: "accepted" | "denied"
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

  await checkDatasetAdmin(datasetId, currentUserId, userInfo)

  const originalRequestEvent = await DatasetEvent.findOne({
    "event.type": "contributorRequest",
    "event.requestId": requestId,
  }).populate("user")

  if (!originalRequestEvent || !isContributorRequest(originalRequestEvent)) {
    throw new Error("Original contributor request event not found or invalid.")
  }

  const existingResponse = await DatasetEvent.findOne({
    "event.type": "contributorResponse",
    "event.requestId": requestId,
  })
  if (existingResponse) {
    throw new Error("This contributor request has already been processed.")
  }

  originalRequestEvent.event.resolutionStatus = resolutionStatus
  await originalRequestEvent.save()

  const responseEvent = new DatasetEvent({
    datasetId,
    userId: currentUserId,
    event: {
      type: "contributorResponse",
      requestId,
      targetUserId,
      reason,
      datasetId,
      resolutionStatus,
    },
    success: true,
    note: reason?.trim() ||
      `Admin ${currentUserId} processed contributor request for user ${targetUserId} as '${resolutionStatus}'.`,
  })

  await responseEvent.save()
  await responseEvent.populate("user")

  return responseEvent
}

/**
 * Update a user's notification status
 */
export async function updateEventStatus(obj, { eventId, status }, { user }) {
  if (!user) throw new Error("Authentication required.")
  return await UserNotificationStatus.findOneAndUpdate(
    { userId: user, datasetEventId: eventId },
    { status },
    { new: true, upsert: true },
  )
}

/**
 * Create a 'contributor citation' event
 */
export async function createContributorCitationEvent(
  obj,
  { datasetId, targetUserId, contributorData }: {
    datasetId: string
    targetUserId: string
    contributorData: {
      orcid?: string
      name?: string
      email?: string
      userId?: string
      contributorType?: string
    }
  },
  { user }: { user: string },
) {
  if (!user) throw new Error("Authentication required.")

  // Ensure contributorType is always set
  const finalContributorData = {
    ...contributorData,
    contributorType: contributorData.contributorType || "Researcher",
  }

  const event = new DatasetEvent({
    datasetId,
    userId: user,
    event: {
      type: "contributorCitation",
      datasetId,
      addedBy: user,
      targetUserId,
      contributorData: finalContributorData,
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
 * Process a contributor citation
 */
export async function processContributorCitation(
  obj,
  {
    eventId,
    resolutionStatus,
  }: {
    eventId: string
    resolutionStatus: "accepted" | "denied"
  },
  { user, userInfo }: { user: string; userInfo: { admin?: boolean } },
) {
  if (!user) throw new Error("Authentication required.")

  const citationEvent = await DatasetEvent.findOne({ id: eventId })
  if (!citationEvent || !isContributorCitation(citationEvent)) {
    throw new Error("Contributor citation event not found.")
  }

  const currentUser = await User.findOne({ id: user })
  const isTargetUser = citationEvent.event.targetUserId === user ||
    citationEvent.event.targetUserId === currentUser?.orcid
  const isAdmin = userInfo?.admin === true
  if (!isTargetUser && !isAdmin) {
    throw new Error("Not authorized to respond to this contributor citation.")
  }
  if (citationEvent.event.resolutionStatus !== "pending") {
    throw new Error("This contributor citation has already been responded to.")
  }
  // Update original
  citationEvent.event.resolutionStatus = resolutionStatus
  await citationEvent.save()

  // Create response event
  const responseEvent = new DatasetEvent({
    datasetId: citationEvent.datasetId,
    userId: user,
    event: {
      type: "contributorResponse",
      originalCitationId: citationEvent.id,
      action: resolutionStatus,
      datasetId: citationEvent.datasetId,
      addedBy: citationEvent.event.addedBy,
      targetUserId: citationEvent.event.targetUserId,
      contributorData: citationEvent.event.contributorData,
    },
    success: true,
    note:
      `User ${user} ${resolutionStatus} contributor citation for ${citationEvent.event.targetUserId}.`,
  })

  await responseEvent.save()
  await responseEvent.populate("user")
  return {
    ...citationEvent.toObject(),
    responseStatus: mapStatusToEnum(resolutionStatus),
  }
}
