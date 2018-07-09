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

export const whoami = () => {
  return {}
}

export const removeUser = (obj, { id }) => {
  return User.removeOne({ id }).exec()
}

export const setAdmin = (obj, { id, admin }) => {
  return User.findOneAndUpdate({ id }, { admin }).exec()
}
