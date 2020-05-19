import { RedisPubSub } from 'graphql-redis-subscriptions'

const pubsubFactory = options => new RedisPubSub(options)

export default pubsubFactory
