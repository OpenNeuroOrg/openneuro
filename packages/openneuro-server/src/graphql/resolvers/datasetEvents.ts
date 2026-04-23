import DatasetEvent from "../../models/datasetEvents"
import type { GraphQLContext } from "../builder"
import { toDbStatus, toGraphqlStatus } from "./response-status"
import type { DbStatus, GraphqlStatus } from "./response-status"
import User from "../../models/user"
import { checkDatasetAdmin } from "../permissions"
import type {
  DatasetEventContributorRequest,
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

/** Enriched type for GraphQL */
export type EnrichedDatasetEvent =
  & Omit<DatasetEventDocument, "notificationStatus">
  & {
    hasBeenRespondedTo?: boolean
    responseStatus?: DbStatus | null
    notificationStatus?: UserNotificationStatusDocument
  }

/**
 * Get all events for a dataset
 */
export async function datasetEvents(
  obj: { id: string },
  _: unknown,
  { userInfo, user }: GraphQLContext,
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

    // Internal representation stays lowercase (DbStatus) here; the
    // GraphQL resolver edge (DatasetEventTypeResolvers in ./index.ts)
    // converts to the uppercase ResponseStatusType enum at query time.
    if ("resolutionStatus" in e.event) {
      ev.responseStatus = e.event.resolutionStatus as DbStatus
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

/**
 * Minimal type-level resolvers wired via ./index.ts. These exist so the
 * case conversion for resolutionStatus / responseStatus runs at the
 * GraphQL edge, regardless of which query/mutation produced the event
 * object. Only the status-related fields are declared here; every other
 * field of DatasetEvent and DatasetEventDescription continues to resolve
 * via default property access.
 */
export const DatasetEventTypeResolvers = {
  responseStatus: (
    ev: { responseStatus?: DbStatus | null },
  ): GraphqlStatus | null => toGraphqlStatus(ev.responseStatus),
  hasBeenRespondedTo: (
    ev: { hasBeenRespondedTo?: boolean },
  ): boolean => ev.hasBeenRespondedTo ?? false,
}

export const DatasetEventDescriptionTypeResolvers = {
  resolutionStatus: (
    evDesc: { resolutionStatus?: DbStatus | null },
  ): GraphqlStatus | null => toGraphqlStatus(evDesc.resolutionStatus),
}

/**
 * Create a 'contributor request' event
 */
export async function createContributorRequestEvent(
  obj: unknown,
  { datasetId }: { datasetId: string },
  { user }: GraphQLContext,
) {
  if (!user) {
    throw new Error("Authentication required to request contributor status.")
  }

  // Fetch user info for contributorData
  const targetUser = await User.findOne({ id: user })
  if (!targetUser) throw new Error("User not found.")

  const contributorData = {
    userId: targetUser.id,
    name: targetUser.name || "Unknown Contributor",
    givenName: targetUser.givenName || "",
    familyName: targetUser.familyName || "",
    orcid: targetUser.orcid,
    contributorType: "Researcher",
  }

  const event = new DatasetEvent({
    datasetId,
    userId: user,
    event: {
      type: "contributorRequest",
      datasetId,
      resolutionStatus: "pending",
      contributorData,
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
  obj: unknown,
  { id, datasetId, note }: { id?: string; datasetId: string; note: string },
  { user, userInfo }: GraphQLContext,
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
 * Process a contributor request (accept or deny) and update Datacite YAML if accepted
 */
export async function processContributorRequest(
  obj: unknown,
  {
    datasetId,
    requestId,
    targetUserId,
    resolutionStatus: graphqlResolutionStatus,
    reason,
  }: {
    datasetId: string
    requestId: string
    targetUserId: string
    resolutionStatus: "ACCEPTED" | "DENIED"
    reason?: string
  },
  { user: currentUserId, userInfo }: GraphQLContext,
) {
  if (!currentUserId) {
    throw new Error("Authentication required to process contributor requests.")
  }

  const resolutionStatus = toDbStatus(graphqlResolutionStatus)

  // Note that this is technically possible with hand-crafted GraphQL
  // Separating types in the schema will enforce this at the endpoint
  if (resolutionStatus === "pending") {
    throw new Error("PENDING is not a valid resolution action.")
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
    "event.type": "contributorRequestResponse",
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
      type: "contributorRequestResponse",
      requestId,
      targetUserId,
      reason,
      datasetId,
      resolutionStatus,
      contributorData: originalRequestEvent.event.contributorData,
    },
    success: true,
    note: reason?.trim() ||
      `Admin ${currentUserId} processed contributor request for user ${targetUserId} as '${resolutionStatus}'.`,
  })

  await responseEvent.save()
  await responseEvent.populate("user")

  if (resolutionStatus === "accepted") {
    const targetUser = await User.findOne({ id: targetUserId })
    if (!targetUser) throw new Error("Target user not found.")

    const existingDatacite = await getDataciteYml(datasetId)
    const existingContributors =
      existingDatacite?.data.attributes.contributors || []

    const mappedExisting: Contributor[] = existingContributors.map((
      c,
      index,
    ) => ({
      name: c.name || "Unknown Contributor",
      givenName: c.givenName || "",
      familyName: c.familyName || "",
      orcid: c.nameIdentifiers?.[0]?.nameIdentifier,
      contributorType: c.contributorType || "Researcher",
      order: index + 1,
    }))

    const newContributor: Contributor = {
      name: targetUser.name || "Unknown Contributor",
      givenName: targetUser?.givenName || "",
      familyName: targetUser?.familyName || "",
      orcid: targetUser.orcid,
      contributorType: "Researcher",
      order: mappedExisting.length + 1,
    }

    await updateContributorsUtil(
      datasetId,
      [...mappedExisting, newContributor],
      currentUserId,
    )
  }

  return responseEvent
}

/**
 * Update a user's notification status
 */
export async function updateEventStatus(
  obj: unknown,
  { eventId, status }: { eventId: string; status: string },
  { user }: GraphQLContext,
) {
  if (!user) throw new Error("Authentication required.")
  return await UserNotificationStatus.findOneAndUpdate(
    { userId: user, datasetEventId: eventId },
    { status },
    { new: true, upsert: true },
  )
}

/**
 * Create a 'contributor citation' event
 * Immediately adds the contributor to datacite.yml
 * Automatically sets the resolutionStatus to 'accepted'
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
      givenName?: string
      familyName?: string
    }
  },
  { user }: GraphQLContext,
) {
  if (!user) throw new Error("Authentication required.")

  const finalContributorData = {
    ...contributorData,
    contributorType: contributorData.contributorType || "Researcher",
  }

  // --- Immediately add to datacite.yml ---
  const existingDatacite = await getDataciteYml(datasetId)
  const existingContributors = existingDatacite?.data.attributes.contributors ||
    []

  const mappedExisting: Contributor[] = existingContributors.map((
    c,
    index,
  ) => ({
    name: c.name || "Unknown Contributor",
    givenName: c.givenName || "",
    familyName: c.familyName || "",
    orcid: c.nameIdentifiers?.[0]?.nameIdentifier,
    contributorType: c.contributorType || "Researcher",
    order: index + 1,
  }))

  const newContributor: Contributor = {
    name: finalContributorData.name || "Unknown Contributor",
    givenName: finalContributorData.givenName || "",
    familyName: finalContributorData.familyName || "",
    orcid: finalContributorData.orcid,
    contributorType: finalContributorData.contributorType || "Researcher",
    order: mappedExisting.length + 1,
  }

  await updateContributorsUtil(
    datasetId,
    [...mappedExisting, newContributor],
    user,
  )

  // --- Log dataset event ---
  const event = new DatasetEvent({
    datasetId,
    userId: user,
    event: {
      type: "contributorCitation",
      datasetId,
      addedBy: user,
      targetUserId,
      contributorData: finalContributorData,
      resolutionStatus: "accepted", // auto-approved
    },
    success: true,
    note: `User ${user} added a contributor citation for user ${targetUserId}.`,
  })

  await event.save()
  await event.populate("user")

  return event
}

/**
 * Process a contributor citation (accept or deny)
 * No longer updates datacite.yml — only logs a response event
 */
export async function processContributorCitation(
  obj,
  {
    eventId,
    status: graphqlStatus,
  }: {
    eventId: string
    status: "ACCEPTED" | "DENIED"
  },
  { user, userInfo }: GraphQLContext,
) {
  if (!user) throw new Error("Authentication required.")

  const status = toDbStatus(graphqlStatus)

  // Note that this is technically possible with hand-crafted GraphQL
  // Separating types in the schema will enforce this at the endpoint
  if (status === "pending") {
    throw new Error("PENDING is not a valid resolution action.")
  }

  const citationEvent = await DatasetEvent.findOne({ id: eventId })

  if (!citationEvent || citationEvent.event.type !== "contributorCitation") {
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

  citationEvent.event.resolutionStatus = status
  await citationEvent.save()

  // --- Only log response event ---
  const responseEvent = new DatasetEvent({
    datasetId: citationEvent.datasetId,
    userId: user,
    event: {
      type: "contributorCitationResponse",
      originalCitationId: citationEvent.id,
      resolutionStatus: status,
      datasetId: citationEvent.datasetId,
      addedBy: citationEvent.event.addedBy,
      targetUserId: citationEvent.event.targetUserId,
      contributorData: citationEvent.event.contributorData,
    },
    success: true,
    note:
      `User ${user} ${status} contributor citation for ${citationEvent.event.targetUserId}.`,
  })

  await responseEvent.save()
  await responseEvent.populate("user")

  return responseEvent
}
