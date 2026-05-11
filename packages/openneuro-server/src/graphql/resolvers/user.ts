import type { PipelineStage } from "mongoose"
import User from "../../models/user"
import DatasetEvent from "../../models/datasetEvents"
import type { UserNotificationStatusDocument } from "../../models/userNotificationStatus"
function isValidOrcid(orcid: string): boolean {
  return /^[0-9]{4}-[0-9]{4}-[0-9]{4}-[0-9]{3}[0-9X]$/.test(orcid || "")
}

// TODO - Use GraphQL codegen
export type GraphQLUserType = {
  id: string
  provider: "orcid" | "google"
  avatar: string
  orcid: string
  created: Date
  updatedAt: Date
  lastSeen: Date
  email: string
  name: string
  admin: boolean
  blocked: boolean
  location: string
  institution: string
  github: string
  githubSynced: Date
  links: string[]
  orcidConsent: boolean | null
  profilePrivate: boolean
}

export async function user(
  obj: unknown,
  { id }: { id: string },
  { userInfo }: Partial<GraphQLContext> = {},
): Promise<GraphQLUserType | null> {
  if (userInfo?.reviewer) {
    const oneWeekAgo = new Date()
    oneWeekAgo.setDate(oneWeekAgo.getDate() - 7)
    return {
      id: "reviewer",
      name: "Anonymous Reviewer",
      email: "reviewer@openneuro.org",
      provider: "orcid",
      avatar: "",
      orcid: "0000-0000-0000-0000",
      admin: false,
      blocked: false,
      location: "",
      institution: "",
      github: "",
      githubSynced: oneWeekAgo,
      links: [],
      orcidConsent: true,
      profilePrivate: false,
      created: oneWeekAgo,
      lastSeen: new Date(),
      updatedAt: oneWeekAgo,
    }
  }

  let user
  if (isValidOrcid(id)) {
    user = await User.findOne({
      $or: [{ provider: "orcid", providerId: id }],
    }).exec()
  } else {
    user = await User.findOne({ id }).exec()
  }

  if (!user) {
    return null // Fail silently
  }

  if (userInfo?.admin || user.id === userInfo?.id) {
    return user.toObject()
  } else {
    const obj = user.toObject()
    delete obj.email
    return obj
  }
}

import type { GraphQLContext } from "../builder"

type MongoOperatorValue =
  | string
  | number
  | boolean
  | RegExp
  | (string | number | boolean | RegExp)[]

type MongoQueryOperator<T> =
  | T
  | {
    $ne?: T
    $regex?: string
    $options?: string
    $gt?: T
    $gte?: T
    $lt?: T
    $lte?: T
    $in?: T[]
  }

type MongoFilterValue =
  | MongoOperatorValue
  | MongoQueryOperator<MongoOperatorValue>

interface MongoQueryCondition {
  [key: string]: MongoFilterValue
}

export const users = async (
  obj: unknown,
  {
    isAdmin,
    isBlocked,
    search,
    limit = 100,
    offset = 0,
    orderBy,
  }: {
    isAdmin?: boolean
    isBlocked?: boolean
    search?: string
    limit?: number
    offset?: number
    orderBy?: { field: string; order?: "ascending" | "descending" }[]
  },
  context: GraphQLContext,
) => {
  const isSiteAdmin = context.userInfo?.admin === true

  // Build filter for all users (admin or not)
  const filter: {
    admin?: MongoQueryOperator<boolean>
    blocked?: MongoQueryOperator<boolean>
    migrated?: MongoQueryOperator<boolean>
    $or?: MongoQueryCondition[]
    name?: MongoQueryOperator<string | RegExp>
    email?: MongoQueryOperator<string | RegExp>
  } = {}

  if (isAdmin !== undefined) filter.admin = isAdmin
  if (isBlocked !== undefined) filter.blocked = isBlocked

  filter.migrated = { $ne: true }

  if (search) {
    filter.$or = [
      { name: { $regex: search, $options: "i" } },
      { email: { $regex: search, $options: "i" } },
      { orcid: { $regex: search, $options: "i" } },
    ]
  }

  let sort: Record<string, "asc" | "desc"> = {}
  if (orderBy && orderBy.length > 0) {
    orderBy.forEach((sortRule) => {
      sort[sortRule.field] = sortRule.order
        ? sortRule.order === "ascending" ? "asc" : "desc"
        : "asc"
    })

    if (!sort._id) {
      const primarySortOrder = sort[orderBy[0].field] || "asc"
      sort._id = primarySortOrder
    }
  } else {
    sort = { updatedAt: "desc", _id: "desc" }
  }

  const totalCount = await User.countDocuments(filter).exec()

  let query = User.find(filter)
  if (offset !== undefined) query = query.skip(offset)
  if (limit !== undefined) query = query.limit(limit)
  query = query.sort(sort)

  const users = await query.exec()

  // If the requester is not a site admin, hide sensitive fields
  const sanitizedUsers = isSiteAdmin ? users : users.map((u) => {
    const obj = u.toObject()
    obj.email = null
    obj.blocked = null
    obj.admin = null
    return obj
  })

  return {
    users: sanitizedUsers,
    totalCount,
  }
}

export const removeUser = (
  obj: unknown,
  { id }: { id: string },
  { userInfo }: GraphQLContext,
) => {
  if (userInfo.admin) {
    return User.findByIdAndDelete(id).exec()
  } else {
    return Promise.reject(new Error("You must be a site admin to remove users"))
  }
}

export const setAdmin = (
  obj: unknown,
  { id, admin }: { id: string; admin: boolean },
  { userInfo }: GraphQLContext,
) => {
  if (userInfo.admin) {
    return User.findOneAndUpdate({ id }, { admin }).exec()
  } else {
    return Promise.reject(
      new Error("You must be a site admin to modify this value"),
    )
  }
}

export const setBlocked = (
  obj: unknown,
  { id, blocked }: { id: string; blocked: boolean },
  { userInfo }: GraphQLContext,
) => {
  if (userInfo.admin) {
    return User.findOneAndUpdate({ id }, { blocked }).exec()
  } else {
    return Promise.reject(new Error("You must be a site admin to block a user"))
  }
}

export const updateUser = async (
  obj: unknown,
  { id, location, institution, links, orcidConsent, profilePrivate }: {
    id: string
    location?: string
    institution?: string
    links?: string[]
    orcidConsent?: boolean
    profilePrivate?: boolean
  },
  { userInfo }: GraphQLContext,
) => {
  if (!userInfo) {
    throw new Error("You must be logged in to update a user")
  }

  try {
    let user

    if (isValidOrcid(id)) {
      user = await User.findOne({
        $or: [{ orcid: id }, { providerId: id }],
      }).exec()
    } else {
      user = await User.findOne({ id: id }).exec()
    }

    if (!user) {
      throw new Error("User not found")
    }

    // Only allow users to update their own profile, or admins to update any
    if (user.id !== userInfo.id && !userInfo.admin) {
      throw new Error("You are not authorized to update this user")
    }

    // Update user fields (optional values based on provided inputs)
    if (location !== undefined) user.location = location
    if (institution !== undefined) user.institution = institution
    if (links !== undefined) user.links = links
    if (orcidConsent !== undefined) user.orcidConsent = orcidConsent
    if (profilePrivate !== undefined) user.profilePrivate = profilePrivate

    await user.save()

    return user
  } catch (err) {
    throw new Error("Failed to update user: " + err.message, { cause: err })
  }
}

/**
 * Get all events associated with a specific user (for their notifications feed).
 * Uses a single aggregation pipeline for improved performance.
 */
export async function notifications(
  obj: Pick<GraphQLUserType, "id">,
  _: unknown,
  { userInfo }: GraphQLContext,
) {
  const userId = obj.id

  // Reviewers never have notifications
  if (userInfo?.reviewer) {
    return []
  }

  // --- authorization ---
  if (!userInfo || (userInfo.id !== userId && !userInfo.admin)) {
    throw new Error("Not authorized to view these notifications.")
  }

  // --- get user and orcid ---
  const currentUser = await User.findOne({ id: userId }).exec()
  const orcid = currentUser?.orcid

  // --- base match conditions: either the user created it OR it targets them ---
  const matchConditions: Record<string, unknown>[] = [
    { userId },
    { "event.targetUserId": userId },
  ]
  if (orcid) matchConditions.push({ "event.targetUserId": orcid })

  const pipeline: PipelineStage[] = [
    { $match: { $or: matchConditions } },
    {
      $lookup: {
        from: "permissions",
        let: { datasetId: "$datasetId", currentUserId: userId },
        pipeline: [
          {
            $match: {
              $expr: {
                $and: [
                  { $eq: ["$datasetId", "$$datasetId"] },
                  { $eq: ["$userId", "$$currentUserId"] },
                ],
              },
            },
          },
        ],
        as: "permissions",
      },
    },
    { $unwind: { path: "$permissions", preserveNullAndEmptyArrays: true } },
    { $sort: { timestamp: -1 } },
    {
      $lookup: {
        from: "users",
        localField: "userId",
        foreignField: "id",
        as: "user",
      },
    },
    { $unwind: { path: "$user", preserveNullAndEmptyArrays: true } },
    {
      $lookup: {
        from: "usernotificationstatuses",
        let: { eventId: "$id" },
        pipeline: [
          {
            $match: {
              $expr: {
                $and: [
                  { $eq: ["$datasetEventId", "$$eventId"] },
                  { $eq: ["$userId", userId] },
                ],
              },
            },
          },
        ],
        as: "notificationStatus",
      },
    },
    {
      $unwind: {
        path: "$notificationStatus",
        preserveNullAndEmptyArrays: true,
      },
    },
  ]

  const events = await DatasetEvent.aggregate(pipeline).exec()

  // --- apply visibility rules ---
  const filtered = events.filter((ev) => {
    if (!ev.event || !ev.event.type) return false

    const type = ev.event.type
    const targetId = ev.event.targetUserId
    const isDatasetAdmin = userInfo.admin || ev.permissions?.level === "admin"
    const isTargetUser = targetId === userId || (orcid && targetId === orcid)

    switch (type) {
      case "contributorRequest":
        return isDatasetAdmin
      case "contributorCitation":
        return isTargetUser
      case "contributorRequestResponse":
      case "contributorCitationResponse":
        return isDatasetAdmin || isTargetUser
      // Reduce the notification noise by hiding non-actionable events
      case "created":
      case "versioned":
      case "deleted":
      case "published":
      case "permissionChange":
      case "git":
      case "upload":
        return false
      default:
        return isDatasetAdmin
    }
  })

  // --- map results with notification status ---
  return filtered.map((event) => {
    const notificationStatus = event.notificationStatus
      ? event.notificationStatus
      : ({ status: "UNREAD" } as UserNotificationStatusDocument)

    return { ...event, notificationStatus }
  })
}

const UserResolvers = {
  id: (obj) => obj.id,
  provider: (obj) => obj.provider,
  avatar: (obj) => obj.avatar,
  orcid: (obj) => obj.orcid,
  created: (obj) => obj.created,
  lastSeen: (obj) => obj.lastSeen,
  email: (obj) => obj.email,
  name: (obj) => obj.name,
  admin: (obj) => obj.admin,
  blocked: (obj) => obj.blocked,
  location: (obj) => obj.location,
  institution: (obj) => obj.institution,
  links: (obj) => obj.links,
  orcidConsent: (obj) => obj.orcidConsent,
  modified: (obj) => obj.updatedAt,
  notifications: notifications,
}

export default UserResolvers
