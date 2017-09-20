/*eslint no-console: ["error", { allow: ["log"] }] */

// dependencies --------------------------------------------------
import Redis from 'ioredis'

export default {
  redis: null,

  connect(config, callback) {
    if (!this.redis) {
      console.log(
        'Connecting to Redis "redis://%s:%d/0"',
        config.host,
        config.port,
      )
      this.redis = new Redis(config)
      this.redis.on('connect', () => {
        if (callback) {
          callback(this.redis)
        }
      })
    } else {
      if (callback) {
        callback(this.redis)
      }
    }
  },
}
