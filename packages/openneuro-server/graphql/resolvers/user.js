/**
 * User resolvers
 *
 * These are passthroughs to SciTran until we have authentication working internally
 */
import User from '../../models/user'

export const user = (obj, { id }) => {
  return new Promise((resolve, reject) => {
    User.findOne({ id: id }, (err, data) => {
      if (err) {
        reject(err)
      } else {
        resolve(data)
      }
    })
  })
}

export const users = () => {
  return []
}

export const whoami = () => {
  return {}
}
