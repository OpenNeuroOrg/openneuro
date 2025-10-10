import type { User } from "./user-types"

export type RequestStatus = "pending" | "accepted" | "denied"

export interface ContributorData {
  name?: string
  givenName?: string
  familyName?: string | null
  orcid?: string
  contributorType?: string
  order?: number | null
}

export interface EventDescription {
  type: string
  targetUserId?: string
  status?: RequestStatus
  requestId?: string
  message?: string
  reason?: string
  datasetId?: string
  resolutionStatus?: RequestStatus
  target?: User
  version?: string
  public?: boolean
  level?: string
  ref?: string
  contributorData?: ContributorData | null
}

export interface Event {
  id: string
  timestamp: string
  note?: string
  success?: boolean
  event: EventDescription
  user?: User
  hasBeenRespondedTo?: boolean
  responseStatus?: string
  dataset?: {
    id: string
    name?: string
  }
  datasetId?: string
  notificationStatus?: {
    status: "UNREAD" | "SAVED" | "ARCHIVED"
  }
}

export interface MappedNotification {
  id: string
  title: string
  content: string
  status: "unread" | "saved" | "archived"
  type: "general" | "approval" | "response" | "citationRequest"
  approval?: "pending" | "accepted" | "denied"
  originalNotification: Event
  datasetId?: string
  needsReview?: boolean
  requestId?: string
  targetUser?: User
  targetUserId?: string
  requesterUser?: User
  adminUser?: User
  reason?: string
}

export const mapRawEventToMappedNotification = (
  rawNotification: Event,
): MappedNotification => {
  const { event, note, user, dataset, datasetId: rawDatasetId } =
    rawNotification
  const {
    type,
    resolutionStatus,
    status: eventStatus,
    requestId,
    targetUserId,
    reason,
  } = event

  let title = "General Notification"
  let mappedType: MappedNotification["type"] = "general"
  let approval: MappedNotification["approval"]
  let requesterUser: User | undefined
  let adminUser: User | undefined

  let needsReview = false

  switch (type) {
    case "contributorRequest":
      title = `[${type}], [${resolutionStatus}]`
      approval = resolutionStatus ?? "pending"
      requesterUser = user
      needsReview = approval === "pending"
      break
    case "contributorCitation":
      title = `[${type}], [${resolutionStatus}] `
      approval = resolutionStatus ?? "pending"
      adminUser = user
      needsReview = approval === "pending"
      break
    case "contributorRequestResponse":
      title = `[${type}], [${resolutionStatus}] `
      approval = resolutionStatus ?? "pending"
      adminUser = user
      break
    case "contributorCitationResponse":
      title = `[${type}], [${resolutionStatus}] `
      approval = resolutionStatus ?? "pending"
      adminUser = user
      break
    case "note":
      title = "Admin Note on Dataset"
      approval = resolutionStatus ?? "pending"
      break
    default:
      title = `[${type}] ${note || `Dataset ${type || "Unknown Type"}`}`
      break
  }

  const datasetId = dataset?.id || rawDatasetId || event.datasetId || ""
  const notificationStatus =
    (rawNotification.notificationStatus?.status?.toLowerCase() as
      | "unread"
      | "saved"
      | "archived") ?? "unread"

  return {
    id: rawNotification.id,
    title,
    content: note || "",
    status: notificationStatus,
    type: mappedType,
    approval,
    needsReview,
    datasetId,
    requestId,
    targetUserId: targetUserId || user?.id,
    originalNotification: rawNotification,
    requesterUser,
    adminUser,
    reason,
  }
}
