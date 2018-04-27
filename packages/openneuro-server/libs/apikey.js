import crypto from 'crypto'
import bcrypt from 'bcrypt-nodejs'
import mongo from './mongo.js'

const c = mongo.collections

export const generateApiKey = userId => {
  const key = crypto.randomBytes(32).toString('hex')
  const hash = bcrypt.hashSync(key)
  return c.crn.keys
    .findOneAndUpdate(
      { id: userId },
      {
        $set: {
          id: userId,
          hash: hash,
        },
      },
      { upsert: true, returnOriginal: false },
    )
    .then(data => ({
      hash: data.value.hash,
      key,
    }))
}

export const getUserIdFromApiKey = key => {
  const hash = bcrypt.hashSync(key)
  return c.crn.keys.findOne({ hash }).then(data => data.id)
}
