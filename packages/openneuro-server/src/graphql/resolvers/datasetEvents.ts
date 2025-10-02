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
    responseStatus?: "accepted" | "denied"
    citationStatus?: "pending" | "accepted" | "denied"
    notificationStatus?: UserNotificationStatusDocument
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

  const responsesMap = new Map<string, DatasetEventDocument>()
  allEvents.forEach((e) => {
    if (e.event.type === "contributorResponse" && "requestId" in e.event) {
      responsesMap.set(e.event.requestId, e)
    }
  })

  const enriched: EnrichedDatasetEvent[] = allEvents
    .filter((e) => {
      // Only include contributorCitation if it's accepted or denied
      if (isContributorCitation(e)) {
        return e.event.resolutionStatus !== "pending"
      }
      return true
    })
    .map((e) => {
      const ev = e.toObject() as EnrichedDatasetEvent

      if (!ev.notificationStatus || typeof ev.notificationStatus === "string") {
        ev.notificationStatus = new UserNotificationStatus({
          userId: user,
          datasetEventId: e.id,
          status: "UNREAD",
        }) as UserNotificationStatusDocument
      }

      if (isContributorRequest(e)) {
        const response = responsesMap.get(e.event.requestId)
        if (response && isContributorResponse(response)) {
          ev.hasBeenRespondedTo = true
          ev.responseStatus = response.event.status
        }
      } else if (isContributorCitation(e)) {
        ev.hasBeenRespondedTo = true
        ev.citationStatus = e.event.resolutionStatus
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
  citationStatus: (ev: EnrichedDatasetEvent) => ev.citationStatus ?? null,
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
 * Process a contributor request (accept or deny) and log an event.
 * This mutation should only be callable by users with admin privileges on the dataset.
 */
export async function processContributorRequest(
  obj: unknown,
  {
    datasetId,
    requestId,
    targetUserId,
    status,
    reason,
  }: {
    datasetId: string
    requestId: string
    targetUserId: string
    status: "accepted" | "denied"
    reason?: string
  },
  {
    user: currentUserId,
    userInfo,
  }: {
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
    // TODO: Add logic here to modify permissions if ADMIN accepted
  }

  return responseEvent
}

/**
 * Update a user's notification status for a specific event
 */
export async function updateEventStatus(obj, { eventId, status }, { user }) {
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
      note: "Contributorship request",
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
 * Only the target user can approve/deny
 */
export async function processContributorCitation(
  obj,
  {
    eventId,
    status,
  }: {
    eventId: string
    status: "accepted" | "denied"
  },
  { user, userInfo }: { user: string; userInfo: { admin?: boolean } },
) {
  if (!user) {
    throw new Error("Authentication required to process contributor citation.")
  }

  // Fetch the citation event
  const citationEvent = await DatasetEvent.findOne({ id: eventId })

  if (!citationEvent || citationEvent.event.type !== "contributorCitation") {
    throw new Error("Contributor citation event not found.")
  }

  // Fetch current user
  const currentUser = await User.findOne({ id: user })

  // Authorization: target user OR admin
  const isTargetUser = citationEvent.event.targetUserId === user ||
    citationEvent.event.targetUserId === currentUser?.orcid
  const isAdmin = userInfo?.admin === true

  if (!isTargetUser && !isAdmin) {
    throw new Error("Not authorized to respond to this contributor citation.")
  }

  // Must still be pending
  if (citationEvent.event.resolutionStatus !== "pending") {
    throw new Error("This contributor citation has already been responded to.")
  }

  // --- Create a new DatasetEvent for the approval/denial ---
  const responseEvent = new DatasetEvent({
    datasetId: citationEvent.datasetId,
    userId: user,
    event: {
      type: "contributorCitation",
      note: status + " contributor request",
      datasetId: citationEvent.datasetId,
      addedBy: citationEvent.event.addedBy,
      targetUserId: citationEvent.event.targetUserId,
      contributorType: citationEvent.event.contributorType,
      contributorData: citationEvent.event.contributorData,
      resolutionStatus: status,
    },
    success: true,
    note:
      `User ${user} ${status} contributor citation for ${citationEvent.event.targetUserId}.`,
  })

  await responseEvent.save()
  await responseEvent.populate("user")

  // If accepted, update contributors in Datacite YAML
  if (status === "accepted") {
    const { contributorData } = citationEvent.event
    if (!contributorData) {
      throw new Error("Contributor data missing in citation event.")
    }

    const existingDatacite = await getDataciteYml(citationEvent.datasetId)
    const existingContributors =
      existingDatacite?.data.attributes.contributors || []

    const mappedExisting: Contributor[] = existingContributors.map(
      (c, index) => ({
        name: c.name || "Unknown Contributor",
        givenName: c.givenName || "",
        familyName: c.familyName || "",
        orcid: c.nameIdentifiers?.[0]?.nameIdentifier,
        contributorType: c.contributorType || "Researcher",
        order: index + 1,
      }),
    )

    const newContributor: Contributor = {
      name: contributorData.name || "Unknown Contributor",
      givenName: "", //contributorData.givenName || '',
      familyName: "", //contributorData.familyName || '',
      orcid: contributorData.orcid,
      contributorType: "Researcher", //contributorData.contributorType || 'Researcher',
      order: mappedExisting.length + 1,
    }

    await updateContributorsUtil(
      citationEvent.datasetId,
      [...mappedExisting, newContributor],
      user,
    )
  }

  return responseEvent
}
