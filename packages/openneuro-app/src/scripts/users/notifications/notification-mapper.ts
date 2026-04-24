import type {
  GetDatasetEventsQuery,
  ResponseStatusType,
  UserQuery,
} from "../../../gql/graphql"

type User = NonNullable<UserQuery["user"]>

/** A single notification from the UserQuery result. */
export type Notification = NonNullable<
  NonNullable<UserQuery["user"]>["notifications"]
>[number]

/** A single dataset event from the GetDatasetEventsQuery result. */
export type DatasetEvent = NonNullable<
  NonNullable<
    NonNullable<GetDatasetEventsQuery["dataset"]>["events"]
  >[number]
>

/**
 * Format a RequestStatus or compatible string for display in user-facing UI.
 * The type-level representation uses uppercase (matching the GraphQL
 * ResponseStatusType enum), but UI rendering uses lowercase ("accepted",
 * "denied", "pending") for readability. Call this at every display site
 * so that the convention stays consistent if new sites are added.
 */
export function formatStatusForDisplay(
  status: string | null | undefined,
): string {
  return status ? status.toLowerCase() : ""
}

export interface MappedNotification {
  id: string
  title: string
  content: string
  status: "unread" | "saved" | "archived"
  type: string
  approval?: ResponseStatusType | null
  originalNotification: Notification
  datasetId?: string
  needsReview?: boolean
  requestId?: string | null
  targetUser?: User
  targetUserId?: string | null
  requesterUser?: User
  adminUser?: User
  reason?: string | null
  resStatus?: string | null
}

export const mapRawEventToMappedNotification = (
  rawNotification: Notification,
): MappedNotification => {
  const { event, note, user } = rawNotification
  const {
    type,
    resolutionStatus,
    requestId,
    targetUserId: eventTargetUserId,
    target,
    reason,
    datasetId: eventDatasetId,
  } = event ?? {}

  let title = "General Notification"
  const mappedType: string = type ?? ""
  let approval: MappedNotification["approval"]
  let requesterUser: User | undefined
  let adminUser: User | undefined
  let targetUser: User | undefined
  let needsReview = false
  let resStatus: string | null | undefined = resolutionStatus

  switch (type) {
    case "contributorRequest":
      title = "is requesting to be added to"
      requesterUser = user as User // user initiating the request (admin)
      targetUser = (target as User) || (rawNotification.user as User) // fallback
      approval = resolutionStatus ?? "PENDING" as ResponseStatusType
      needsReview = approval === "PENDING"
      break
    case "contributorCitation":
      title = "added"
      adminUser = user as User
      // fallback to rawNotification.user if target is missing (but not the admin)
      targetUser = (target as User) ||
        (rawNotification.user && rawNotification.user.id !== user?.id
          ? (rawNotification.user as User)
          : {
            id: eventTargetUserId || "",
            name: "Unknown",
            email: "",
            orcid: "",
          } as User)
      approval = resolutionStatus ?? "PENDING" as ResponseStatusType
      needsReview = approval === "PENDING"
      break

    case "contributorRequestResponse":
      title = "responded to a contributor request"
      adminUser = user as User
      targetUser = target as User
      approval = resolutionStatus ?? "PENDING" as ResponseStatusType
      break

    case "contributorCitationResponse":
      title = "had their citation request for"
      adminUser = user as User
      targetUser = target as User
      approval = resolutionStatus ?? "PENDING" as ResponseStatusType
      break

    case "note":
      title = "Admin note on"
      adminUser = user as User
      resStatus = null
      break

    default:
      title = `[${type}] ${note || `Dataset ${type || "Unknown Type"}`}`
      break
  }

  const datasetId = eventDatasetId || ""

  const notificationStatus =
    (rawNotification.notificationStatus?.status?.toLowerCase() as
      | "unread"
      | "saved"
      | "archived") ?? "unread"

  return {
    id: rawNotification.id ?? "",
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
