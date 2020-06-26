import Key from '../models/key'
import { addJWT } from '../libs/authentication/jwt'
import config from '../config'

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
  return Key.updateOne(
    { id: userId },
    {
      id: userId,
      hash: token,
    },
    { upsert: true, new: true },
  )
    .exec()
    .then(() => ({ key: token }))
}
