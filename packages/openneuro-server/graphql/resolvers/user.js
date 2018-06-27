/**
 * User resolvers
 *
 * These are passthroughs to SciTran until we have authentication working internally
 */
import { promisify } from 'util'
import scitran from '../../libs/scitran.js'

export const user = (obj, { id }) => {
  return promisify(scitran.getUser)(id).then(({ body }) => {
    return {
      id: body._id,
      name: body.name,
      email: body.email,
    }
  })
}

export const users = () => {
  return []
}

export const whoami = () => {
  return {}
}
