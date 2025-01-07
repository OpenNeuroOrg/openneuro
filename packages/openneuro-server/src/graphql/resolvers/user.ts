/**
 * User resolvers
 */
import User from "../../models/user"

export const user = (obj, { id, key }) => {
  function isValidOrcid(orcid: string): boolean {
    return /^[0-9]{4}-[0-9]{4}-[0-9]{4}-[0-9]{3}[0-9X]$/.test(orcid || "")
  }

  if (isValidOrcid(id)) {
    if (key === "orcid") {
      return User.findOne({ "orcid": id }).exec()
    } else {
      return User.findOne({ "providerId": id }).exec()
    }
  } else {
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
    return User.findByIdAndRemove(id).exec()
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
}

export default UserResolvers
