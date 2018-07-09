import mongo from './mongo.js'
import { addJWT } from '../libs/authentication/jwt'
import config from '../config'

const c = mongo.collections

/**
 * Replace or create an API key for a given user
 * @param {object} user
 */
export const generateApiKey = user => {
  let userId = user.id
  const apiKeyExpiration = 31536000
  const token = addJWT(config)(user, apiKeyExpiration).token
  return c.crn.keys
    .findOneAndUpdate(
      { id: userId },
      {
        $set: {
          id: userId,
          hash: token,
        },
      },
      { upsert: true, returnOriginal: false },
    )
    .then(() => {
      return { key: token }
    })
}
