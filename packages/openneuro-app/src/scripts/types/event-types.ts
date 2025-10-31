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
  type: EventDescription["type"]
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
  resStatus?: string
}

export const mapRawEventToMappedNotification = (
  rawNotification: Event,
): MappedNotification => {
  const { event, note, user, dataset, datasetId: rawDatasetId } =
    rawNotification
  const {
    type,
    resolutionStatus,
    requestId,
    targetUserId: eventTargetUserId,
    target,
    reason,
  } = event

  let title = "General Notification"
  const mappedType: MappedNotification["type"] = type
  let approval: MappedNotification["approval"]
  let requesterUser: User | undefined
  let adminUser: User | undefined
  let targetUser: User | undefined
  let needsReview = false
  let resStatus = resolutionStatus

  switch (type) {
    case "contributorRequest":
      title = "is requesting to be added to"
      requesterUser = user // user initiating the request (admin)
      targetUser = target || rawNotification.user // fallback
      approval = resolutionStatus ?? "pending"
      needsReview = approval === "pending"
      break
    case "contributorCitation":
      title = "is requesting"
      adminUser = user
      // fallback to rawNotification.user if target is missing (but not the admin)
      targetUser = target ||
        (rawNotification.user && rawNotification.user.id !== user.id
          ? rawNotification.user
          : {
            id: eventTargetUserId || "",
            name: "Unknown",
            email: "",
            orcid: "",
          })
      approval = resolutionStatus ?? "pending"
      needsReview = approval === "pending"
      break

    case "contributorRequestResponse":
      title = "responded to a contributor request"
      adminUser = user
      targetUser = target
      approval = resolutionStatus ?? "pending"
      break

    case "contributorCitationResponse":
      title = "had their citation request for"
      adminUser = user
      targetUser = target
      approval = resolutionStatus ?? "pending"
      break

    case "note":
      title = "Admin note on"
      adminUser = user
      resStatus = null
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
    resStatus,
    needsReview,
    datasetId,
    requestId,
    targetUserId: eventTargetUserId || target?.id || rawNotification.user?.id,
    targetUser,
    requesterUser,
    adminUser,
    reason,
    originalNotification: rawNotification,
  }
}
