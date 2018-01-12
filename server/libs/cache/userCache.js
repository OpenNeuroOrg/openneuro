import { redis } from '../redis'
import config from '../../config'

export default {
  get(req, callback) {
    const userId = req.json.userId
    redis.get(userId, (err, data) => {
      if (err) {
        return callback(err, null)
      }
      if (data != null) {
        const data_obj = JSON.parse(data)
        return callback(null, data_obj)
      } else {
        return callback()
      }
    })
  },
  store(res, callback) {
    const data = res
    const data_store = JSON.stringify(data)
    const userId = data.body._id
    redis.setex(userId, config.redis.cacheTimeout, data_store)
    callback()
  },
}
