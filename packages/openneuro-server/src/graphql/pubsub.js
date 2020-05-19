import Redis from 'ioredis'
import config from '../config.js'
import pubsubFactory from '../libs/redis-pubsub.js'

const pubsub = pubsubFactory({
  publisher: new Redis(config.redis),
  subscriber: new Redis(config.redis),
})

export default pubsub
