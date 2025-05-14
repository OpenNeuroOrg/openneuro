/**
 * User resolvers
 */
import User from "../../models/user" // Your existing User model
import UserMigration from "../../models/userMigration"
import { v4 as uuidv4 } from "uuid"

function isValidOrcid(orcid: string): boolean {
  return /^[0-9]{4}-[0-9]{4}-[0-9]{4}-[0-9]{3}[0-9X]$/.test(orcid || "")
}

function isValidUUID(uuid: string): boolean {
  // Regex for standard UUID v4 format
  return /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i
    .test(uuid)
}

export const user = (obj, { id }) => {
  if (isValidOrcid(id)) {
    return User.findOne({
      $or: [{ "orcid": id }, { "providerId": id }],
    }).exec()
  } else {
    // If it's not a valid ORCID, fall back to querying by user id
    return User.findOne({ "id": id }).exec()
  }
}

export interface UserInfo {
  userId: string
  admin: boolean
  username?: string
  provider?: string
  providerId?: string
  blocked?: boolean
}

export interface GraphQLContext {
  userInfo: UserInfo | null
}

export const users = (
  obj: any,
  { isAdmin, isBlocked, search, limit, offset, orderBy }: {
    isAdmin?: boolean
    isBlocked?: boolean
    search?: string
    limit?: number
    offset?: number
    orderBy?: [{ field: string; order?: "ascending" | "descending" }]
  },
  context: GraphQLContext,
) => {
  console.log("usersqueried")
  if (!context.userInfo?.admin) {
    return Promise.reject(
      new Error("You must be a site admin to retrieve users"),
    )
  }

  const filter: { admin?: boolean; blocked?: boolean; $or?: any[] } = {}
  if (isAdmin !== undefined) filter.admin = isAdmin
  if (isBlocked !== undefined) filter.blocked = isBlocked
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
  } else {
    sort = { updatedAt: "desc" }
  }

  let query = User.find(filter)
  if (offset !== undefined) query = query.skip(offset)
  if (limit !== undefined) query = query.limit(limit)
  query = query.sort(sort)

  return query.exec()
}

// Query a list of migrated users
export const userMigrations = async (
  obj: any,
  args: {},
  context: GraphQLContext,
) => {
  if (!context.userInfo?.admin) {
    return Promise.reject(
      new Error("You must be an admin to view user migrations."),
    )
  }

  try {
    const migrations = await UserMigration.find({}).exec()
    return migrations // Return the actual data!
  } catch (error: any) {
    throw new Error("Failed to retrieve user migration records.")
  }
}

// Query a migrated user by ID or orcid
export const userMigration = async (
  obj: any,
  { id }: { id: string },
  context: GraphQLContext,
) => {
  if (!context.userInfo?.admin) {
    return Promise.reject(
      new Error("You must be an admin to view user migration records."),
    )
  }

  let query
  if (isValidUUID(id)) {
    query = UserMigration.findOne({ id }).exec()
  } else if (isValidOrcid(id)) {
    query = UserMigration.findOne({ "users.orcid": id }).exec()
  } else {
    throw new Error("Invalid ID format. Please provide a valid UUID or ORCID.")
  }

  try {
    const migration = await query
    if (!migration) {
      console.log(`UserMigration not found for ID/ORCID: ${id}`)
    }
    return migration
  } catch (error: any) {
    throw new Error("Failed to retrieve user migration record.")
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

export const updateUser = async (obj, { id, location, institution, links }) => {
  try {
    let user // Declare user outside the if block

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

    // Save the updated user
    await user.save()

    return user // Return the updated user object
  } catch (err) {
    throw new Error("Failed to update user: " + err.message)
  }
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
  modified: (obj) => obj.updatedAt,
}

export default UserResolvers
