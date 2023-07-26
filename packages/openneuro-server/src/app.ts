/*eslint no-console: ["error", { allow: ["log"] }] */
/* eslint-disable no-unused-vars*/

/**
 * Express app setup
 */
import { createServer } from 'http'
import { execute, subscribe } from 'graphql'
import { SubscriptionServer } from 'subscriptions-transport-ws'
import express from 'express'
import passport from 'passport'
import config from './config'
import routes from './routes'
import morgan from 'morgan'
import schema from './graphql/schema'
import { ApolloServerPluginLandingPageGraphQLPlayground } from 'apollo-server-core'
import { ApolloServer } from 'apollo-server-express'
import { BaseRedisCache } from 'apollo-server-cache-redis'
import bodyParser from 'body-parser'
import cookieParser from 'cookie-parser'
import * as jwt from './libs/authentication/jwt.js'
import * as auth from './libs/authentication/states.js'
import { sitemapHandler } from './handlers/sitemap.js'
import { setupPassportAuth } from './libs/authentication/passport.js'
import { redis } from './libs/redis'
import { version } from './lerna.json'

export async function expressApolloSetup() {
  const app = express()

  setupPassportAuth()

  app.use(passport.initialize())

  app.use((req, res, next) => {
    res.set(config.headers)
    res.type('application/json')
    next()
  })
  app.use(morgan('short'))
  app.use(cookieParser())
  app.use(bodyParser.urlencoded({ extended: false, limit: '50mb' }))
  app.use(bodyParser.json({ limit: '50mb' }))

  // routing ---------------------------------------------------------
  app.use('/sitemap.xml', sitemapHandler)
  app.use(config.apiPrefix, routes)

  // Apollo server setup
  const apolloServer = new ApolloServer({
    schema,
    context: ({ req }) => {
      if (req.isAuthenticated()) {
        return {
          user: req.user.id,
          isSuperUser: req.user.admin,
          userInfo: req.user,
        }
      }
    },
    // Always allow introspection - our schema is public
    introspection: true,
    formatResponse: response => {
      return { ...response, extensions: { openneuro: { version } } }
    },
    cache: new BaseRedisCache({
      client: redis,
    }),
    plugins: [
      ApolloServerPluginLandingPageGraphQLPlayground({
        settings: {
          'request.credentials': 'same-origin',
        },
      }),
      {
        async serverWillStart() {
          return {
            async drainServer() {
              subscriptionServer.close()
            },
          }
        },
      },
    ],
  })

  // Apollo server 3.0 subscription support
  const httpServer = createServer(app)
  const subscriptionServer = SubscriptionServer.create(
    {
      schema,
      execute,
      subscribe,
      validationRules: apolloServer.requestOptions.validationRules,
    },
    {
      server: httpServer,
      path: apolloServer.graphqlPath,
    },
  )

  // Setup pre-GraphQL middleware
  app.use('/crn/graphql', jwt.authenticate, auth.optional)

  await apolloServer.start()

  // Inject Apollo Server
  apolloServer.applyMiddleware({ app, path: '/crn/graphql' })

  return app
}
