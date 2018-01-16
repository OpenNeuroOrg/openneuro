import { redis } from '../redis'

export default {
  get(req, callback) {
    const userId = req.json.userId
    redis.get(userId, (err, data) => {
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
  },
  store(userData, callback) {
    console.log(
      'storing user info in the cache. here is the userData:',
      userData,
    )
    const data = JSON.stringify(userData)
    const userId = userData._id
    redis.set(userId, data)
    callback()
  },
}
