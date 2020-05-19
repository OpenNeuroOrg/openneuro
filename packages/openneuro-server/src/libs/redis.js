/*eslint no-console: ["error", { allow: ["log"] }] */

// dependencies --------------------------------------------------
import Redis from 'ioredis'
import Redlock from 'redlock'

let redis = null
let redlock = null

const connect = async config => {
  return new Promise(resolve => {
    if (!redis) {
      console.log(
        'Connecting to Redis "redis://%s:%d/0"',
        config.host,
        config.port,
      )
      redis = new Redis(config)
      redlock = new Redlock([redis])
      redis.on('connect', () => {
        resolve(redis)
      })
    } else {
      resolve(redis)
    }
  })
}

export default { connect }
export { redis, redlock, connect }
