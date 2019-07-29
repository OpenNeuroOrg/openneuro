/**
 * User resolvers
 *
 * These are passthroughs to SciTran until we have authentication working internally
 */
import User from '../../models/user'

export const user = (obj, { id }) => {
  return User.findOne({ id }).exec()
}

export const users = () => {
  return User.find().exec()
}

export const userCount = () => {
  return User.countDocuments({ blocked: false }).exec()
}

export const removeUser = (obj, { id }, { userInfo }) => {
  if (userInfo.admin) {
    return User.removeOne({ id }).exec()
  } else {
    throw new Error('You must be a site admin to remove users')
  }
}

export const setAdmin = (obj, { id, admin }, { userInfo }) => {
  if (userInfo.admin) {
    return User.findOneAndUpdate({ id }, { admin }).exec()
  } else {
    throw new Error('You must be a site admin to modify this value')
  }
}

export const setBlocked = (obj, { id, blocked }, { userInfo }) => {
  if (userInfo.admin) {
    return User.findOneAndUpdate({ id }, { blocked }).exec()
  } else {
    throw new Error('You must be a site admin to block a user')
  }
}

export default user
