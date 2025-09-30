import { PipelineStage } from "mongoose"
import User from "../../models/user"
import DatasetEvent from "../../models/datasetEvents"
import { UserNotificationStatusDocument } from "../../models/userNotificationStatus"

function isValidOrcid(orcid: string): boolean {
  return /^[0-9]{4}-[0-9]{4}-[0-9]{4}-[0-9]{3}[0-9X]$/.test(orcid || "")
}

export async function user(
  obj,
  { id },
  { userInfo }: { userInfo?: Record<string, unknown> } = {},
) {
  let user
  if (isValidOrcid(id)) {
    user = await User.findOne({
      $or: [{ provider: "orcid", providerId: id }],
    }).exec()
  } else {
    user = await User.findOne({ id }).exec()
  }

  if (!user) {
    console.warn(`User not found for id: ${id}`)
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

export interface UserInfo {
  userId: string
  admin: boolean
  username?: string
  provider?: string
  providerId?: string
  blocked?: boolean
  orcidConsent?: boolean | null
}

export interface GraphQLContext {
  userInfo: UserInfo | null
}

type MongoOperatorValue =
  | string
  | number
  | boolean
  | RegExp
  | (string | number | boolean | RegExp)[]

type MongoQueryOperator<T> = T | {
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
  { isAdmin, isBlocked, search, limit = 100, offset = 0, orderBy }: {
    isAdmin?: boolean
    isBlocked?: boolean
    search?: string
    limit?: number
    offset?: number
    orderBy?: { field: string; order?: "ascending" | "descending" }[]
  },
  context: GraphQLContext,
) => {
  // --- check admin ---
  if (!context.userInfo?.admin) {
    return Promise.reject(
      new Error("You must be a site admin to retrieve users"),
    )
  }

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

  return {
    users: users,
    totalCount: totalCount,
  }
}

export const removeUser = (obj, { id }, { userInfo }) => {
  if (userInfo.admin) {
    return User.findByIdAndDelete(id).exec()
  } else {
    return Promise.reject(new Error("You must be a site admin to remove users"))
  }
}

export const setAdmin = (obj, { id, admin }, { userInfo }) => {
  if (userInfo.admin) {
    return User.findOneAndUpdate({ id }, { admin }).exec()
  } else {
    return Promise.reject(
      new Error("You must be a site admin to modify this value"),
    )
  }
}

export const setBlocked = (obj, { id, blocked }, { userInfo }) => {
  if (userInfo.admin) {
    return User.findOneAndUpdate({ id }, { blocked }).exec()
  } else {
    return Promise.reject(new Error("You must be a site admin to block a user"))
  }
}

export const updateUser = async (
  obj,
  { id, location, institution, links, orcidConsent },
) => {
  try {
    let user

    if (isValidOrcid(id)) {
      user = await User.findOne({
        $or: [{ "orcid": id }, { "providerId": id }],
      }).exec()
    } else {
      user = await User.findOne({ "id": id }).exec()
    }

    if (!user) {
      throw new Error("User not found")
    }

    // Update user fields (optional values based on provided inputs)
    if (location !== undefined) user.location = location
    if (institution !== undefined) user.institution = institution
    if (links !== undefined) user.links = links
    if (orcidConsent !== undefined) user.orcidConsent = orcidConsent

    await user.save()

    return user
  } catch (err) {
    throw new Error("Failed to update user: " + err.message)
  }
}

/**
 * Get all events associated with a specific user (for their notifications feed).
 * Uses a single aggregation pipeline for improved performance.
 */
export async function notifications(obj, _, { userInfo }) {
  const userId = obj.id

  // Authorization check: Only the user themselves or a site admin can view their notifications
  if (!userInfo || (userInfo.id !== userId && !userInfo.admin)) {
    throw new Error("Not authorized to view these notifications.")
  }

  const pipeline: PipelineStage[] = [
    // Lookup permissions for dataset admin checks
    {
      $lookup: {
        from: "permissions",
        let: { datasetId: "$datasetId" },
        pipeline: [
          {
            $match: {
              $expr: {
                $and: [
                  { $eq: ["$datasetId", "$$datasetId"] },
                  { $eq: ["$userId", userId] },
                ],
              },
            },
          },
        ],
        as: "permissions",
      },
    },
    {
      $unwind: { path: "$permissions", preserveNullAndEmptyArrays: true },
    },
    // Match relevant events
    {
      $match: {
        $or: [
          // Condition 1: All events for a user where they are the creator
          { userId: userId },
          // Condition 2: All events for a user where they are the target
          { "event.targetUserId": userId },
          // Condition 3: All contributor requests for a site admin
          ...(userInfo.admin ? [{ "event.type": "contributorRequest" }] : []),
          // Condition 4: All contributor requests for a dataset admin (using the Permission model)
          {
            "event.type": "contributorRequest",
            "permissions.level": "admin",
          },
        ],
      },
    },
    {
      $sort: { timestamp: -1 },
    },
    {
      $lookup: {
        from: "users",
        localField: "userId",
        foreignField: "id",
        as: "user",
      },
    },
    {
      $unwind: { path: "$user", preserveNullAndEmptyArrays: true },
    },
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

  return events.map((event) => {
    const notificationStatus = event.notificationStatus
      ? event.notificationStatus
      : ({ status: "UNREAD" } as UserNotificationStatusDocument)

    return {
      ...event,
      notificationStatus,
    }
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
