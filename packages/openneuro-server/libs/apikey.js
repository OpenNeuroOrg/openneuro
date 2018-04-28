import crypto from 'crypto'
import bcrypt from 'bcrypt'
import mongo from './mongo.js'

const c = mongo.collections

const SALTED_ROUNDS = 12

/**
 * Replace or create an API key for a given user
 * @param {string} userId
 */
export const generateApiKey = userId => {
  const key = crypto.randomBytes(32).toString('hex')
  return bcrypt
    .hash(key, SALTED_ROUNDS)
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
  return bcrypt
    .hash(key, SALTED_ROUNDS)
    .then(hash => c.crn.keys.findOne({ hash }, { id: true }))
    .then(data => {
      return data.id
    })
}
