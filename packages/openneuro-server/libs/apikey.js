import bcrypt from 'bcrypt'
import uuidv4 from 'uuid/v4'
import base64url from 'base64url'
import mongo from './mongo.js'

const c = mongo.collections

const SALTED_ROUNDS = 12

/**
 * Replace or create an API key for a given user
 * @param {string} userId
 */
export const generateApiKey = userId => {
  let salt
  // Using uuid v4 to wrap crypto.randomBytes safely
  const baseKey = uuidv4()
  // Always call genSalt when making a key, this way each
  // key has a unique salt.
  return bcrypt
    .genSalt(SALTED_ROUNDS)
    .then(generatedSalt => {
      // Save the salt to include an encoded copy with key
      salt = generatedSalt
      return bcrypt.hash(baseKey, generatedSalt)
    })
    .then(hash =>
      c.crn.keys.findOneAndUpdate(
        { id: userId },
        {
          $set: {
            id: userId,
            hash: hash,
          },
        },
        { upsert: true, returnOriginal: false },
      ),
    )
    .then(data => {
      // base64url keeps the key URL safe
      const key = base64url(`${salt}:${baseKey}`)
      return {
        hash: data.value.hash,
        key,
      }
    })
}

/**
 * Used to lookup user permissions
 *
 * @param {string} key Raw bcrypt key string
 */
export const getUserIdFromApiKey = key => {
  const [salt, baseKey] = base64url.decode(key).split(':')
  return bcrypt
    .hash(baseKey, salt)
    .then(hash => {
      return c.crn.keys.findOne({ hash }, { id: true })
    })
    .then(data => {
      return data.id
    })
}
