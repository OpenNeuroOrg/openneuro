import type { User } from "./user-types"

export type RequestStatus = "pending" | "accepted" | "denied"

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
  type: "general" | "approval" | "response"
  approval?: "pending" | "accepted" | "denied"
  originalNotification: Event
  datasetId?: string
  requestId?: string
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

  let title = note || "General Notification"
  let mappedType: MappedNotification["type"] = "general"
  let approval: MappedNotification["approval"]
  let requesterUser: User | undefined
  let adminUser: User | undefined

  switch (type) {
    case "contributorRequest":
      title = "Contributor Request for Dataset"
      mappedType = "approval"
      approval = resolutionStatus ?? "pending"
      requesterUser = user
      break
    case "contributorResponse":
      title = `Contributor ${eventStatus} for Dataset`
      mappedType = "response"
      approval = eventStatus as "accepted" | "denied"
      adminUser = user
      break
    case "note":
      title = note || "Admin Note on Dataset"
      break
    default:
      title = note || `Dataset ${type || "Unknown Type"}`
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
    datasetId,
    requestId,
    targetUserId: targetUserId || user?.id,
    originalNotification: rawNotification,
    requesterUser,
    adminUser,
    reason,
  }
}
