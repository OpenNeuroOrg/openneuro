import { redis } from '../redis'

export default {
  keyPrefix: 'scitran:users:',

  getKey(id) {
    return this.keyPrefix.concat(id)
  },

  get(req, callback) {
    const userId = req.json ? req.json.userId : null
    const userKey = userId ? this.getKey(userId) : null
    if (userKey) {
      redis.get(userKey, (err, data) => {
        if (err) {
          return callback(err, null)
        }
        if (data != null) {
          const body = JSON.parse(data)
          const res = { statusCode: 200, body: body }
          return callback(null, res)
        } else {
          return callback()
        }
      })
    } else {
      return callback()
    }
  },

  store(userData, callback) {
    const userId = userData && userData._id ? userData._id : null
    const userKey = userId ? this.getKey(userId) : null
    const data = JSON.stringify(userData)
    if (userKey) {
      redis.set(userKey, data)
    }
    callback()
  },
}
