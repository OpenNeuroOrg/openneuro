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
  type: "general" | "approval" | "response" | "citationRequest"
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
  const capitalize = (str: string) =>
    str ? str.charAt(0).toUpperCase() + str.slice(1) : str

  switch (type) {
    case "contributorRequest":
      title = `[${type}] User Contributor Request for Dataset`
      mappedType = "approval"
      approval = resolutionStatus ?? "pending"
      requesterUser = user
      break
    case "contributorResponse":
      title = `[${type}] User Contributor ${
        capitalize(eventStatus ?? "")
      } for Dataset`
      mappedType = "response"
      approval = eventStatus as "accepted" | "denied"
      adminUser = user
      break
    case "contributorCitation": {
      mappedType = "citationRequest"
      const status: "pending" | "accepted" | "denied" =
        (resolutionStatus as "pending" | "accepted" | "denied") ?? "pending"
      approval = status
      const targetName = event.target?.name || "Unknown User"
      if (status === "pending") {
        title =
          `[${type}] An admin has requested ${targetName} be added as an Author`
      } else {
        const capitalizedStatus = status.charAt(0).toUpperCase() +
          status.slice(1)
        title = `[${type}] ${targetName} has ${capitalizedStatus} authorship`
      }
      break
    }
    case "note":
      title = `[${type}] ${note || "Admin Note on Dataset"}`
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
    datasetId,
    requestId,
    targetUserId: targetUserId || user?.id,
    originalNotification: rawNotification,
    requesterUser,
    adminUser,
    reason,
  }
}
