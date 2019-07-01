import mongo from './mongo.js'
import { addJWT } from '../libs/authentication/jwt'
import config from '../config'

const c = mongo.collections

export const apiKeyFactory = user => {
  const apiKeyExpiration = 31536000
  return addJWT(config)(user, apiKeyExpiration).token
}

/**
 * Replace or create an API key for a given user
 * @param {object} user
 */
export const generateApiKey = user => {
  const userId = user.id
  const token = apiKeyFactory(user)
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
