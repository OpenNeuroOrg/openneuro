export interface User {
  id: string
  name: string
  location?: string
  github?: string
  institution?: string
  email: string
  avatar?: string
  orcid?: string
  links?: string[]
  admin?: boolean
  blocked?: boolean
  lastSeen?: string
  created?: string
  provider?: string
  modified?: string
  githubSynced?: Date
  notifications?: DatasetEventGraphQL[]
}

export interface DatasetEventDescriptionGraphQL {
  type?: string
  version?: string
  public?: boolean
  level?: string
  ref?: string
  message?: string
  requestId?: string
  targetUserId?: string
  status?: string
  reason?: string
  datasetId?: string
  resolutionStatus?: "pending" | "accepted" | "denied"
}

export interface DatasetEventGraphQL {
  id: string
  timestamp: string // GraphQL DateTime is a string
  note?: string
  success?: boolean
  user?: User
  event: DatasetEventDescriptionGraphQL
  dataset?: {
    id: string
    name?: string
  }
  datasetId?: string
  status?: "unread" | "saved" | "archived"
}

export type OutletContextType = {
  notifications: MappedNotification[]
  handleUpdateNotification: (
    id: string,
    updates: Partial<MappedNotification>,
  ) => void
}

export interface MappedNotification {
  id: string
  title: string
  content: string
  status: "unread" | "saved" | "archived"
  type: "general" | "approval" | "response"
  approval?: "pending" | "accepted" | "denied"
  originalNotification: DatasetEventGraphQL
  datasetId?: string
  requestId?: string
  targetUserId?: string
  requesterUser?: User
  adminUser?: User
  reason?: string
}

export const mapRawDatasetEventToMappedNotification = (
  rawNotification: DatasetEventGraphQL,
): MappedNotification => {
  const event = rawNotification.event
  let title = "General Notification"

  const status: MappedNotification["status"] = rawNotification.status ??
    "unread"

  let mappedType: MappedNotification["type"] = "general"
  let approval: MappedNotification["approval"]

  let datasetIdForMutation: string | undefined
  let requestIdForMutation: string | undefined
  let targetUserIdForMutation: string | undefined

  let requesterUser: User | undefined
  let adminUser: User | undefined
  let eventReason: string | undefined

  const getDatasetName = () =>
    rawNotification.dataset?.name ||
    event.datasetId ||
    rawNotification.dataset?.id ||
    ""

  switch (event?.type) {
    case "contributorRequest":
      title = `Contributor Request for Dataset ${getDatasetName()}`
      mappedType = "approval"
      approval = event.resolutionStatus ?? "pending"

      datasetIdForMutation = event.datasetId
      requestIdForMutation = event.requestId
      targetUserIdForMutation = rawNotification.user?.id
      requesterUser = rawNotification.user
      break

    case "contributorResponse":
      title = `Contributor ${event.status} for Dataset ${getDatasetName()}`
      mappedType = "response"
      approval = event.status as "accepted" | "denied"
      datasetIdForMutation = event.datasetId
      requestIdForMutation = event.requestId
      targetUserIdForMutation = event.targetUserId
      adminUser = rawNotification.user
      eventReason = event.reason
      break

    case "note":
      title = `Admin Note on Dataset ${getDatasetName()}`
      break

    default:
      title = rawNotification.note ||
        getDatasetName() ||
        `Event on Notification ID: ${rawNotification.id}`
      break
  }

  return {
    id: rawNotification.id,
    title: title,
    content: rawNotification.note || "",
    status: status,
    type: mappedType,
    approval: approval,
    datasetId: datasetIdForMutation,
    requestId: requestIdForMutation,
    targetUserId: targetUserIdForMutation,
    originalNotification: rawNotification,

    requesterUser: requesterUser,
    adminUser: adminUser,
    reason: eventReason,
  }
}

export interface UserRoutesProps {
  orcidUser: User
  hasEdit: boolean
  isUser: boolean
}
export interface UserCardProps {
  orcidUser: User
}

export interface UserAccountViewProps {
  orcidUser: User
}

export interface Dataset {
  id: string
  created: string
  name: string
  public: boolean
  analytics: {
    views: number
    downloads: number
  }
  stars?: { userId: string; datasetId: string }[]
  followers?: { userId: string; datasetId: string }[]
  latestSnapshot?: {
    id: string
    size: number
    issues: { severity: string }[]
    created?: string
    description?: {
      Authors: string[]
      DatasetDOI?: string | null
      Name: string
    }
    summary?: {
      primaryModality?: string
    }
  }
  draft?: {
    size?: number
    created?: string
  }
}

export interface DatasetCardProps {
  dataset: Dataset
  hasEdit: boolean
}

export interface UserDatasetsViewProps {
  orcidUser: User
  hasEdit: boolean
}

export interface AccountContainerProps {
  orcidUser: User
  hasEdit: boolean
  isUser: boolean
}
