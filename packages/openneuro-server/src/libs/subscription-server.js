import { execute, subscribe } from 'graphql'
import { SubscriptionServer } from 'subscriptions-transport-ws'
import schema from '../graphql/schema.js'

const subscriptionServerFactory = httpserver =>
  new SubscriptionServer(
    {
      execute,
      subscribe,
      schema,
      keepAlive: 30000,
    },
    {
      server: httpserver,
      path: '/graphql-subscriptions',
    },
  )

export default subscriptionServerFactory
