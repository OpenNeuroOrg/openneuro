/**
 * User resolvers
 */
import User from "../../models/user"
function isValidOrcid(orcid: string): boolean {
  return /^[0-9]{4}-[0-9]{4}-[0-9]{4}-[0-9]{3}[0-9X]$/.test(orcid || "")
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

export const users = (obj, args, { userInfo }) => {
  if (userInfo.admin) {
    return User.find().exec()
  } else {
    return Promise.reject(
      new Error("You must be a site admin to retrieve users"),
    )
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
  modified: (obj) => obj.modified,
  lastSeen: (obj) => obj.lastSeen,
  email: (obj) => obj.email,
  name: (obj) => obj.name,
  admin: (obj) => obj.admin,
  blocked: (obj) => obj.blocked,
  location: (obj) => obj.location,
  institution: (obj) => obj.institution,
  links: (obj) => obj.links,
}

export default UserResolvers
