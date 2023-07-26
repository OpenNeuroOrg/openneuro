/*eslint no-console: ["error", { allow: ["log"] }] */
/* eslint-disable no-unused-vars*/

/**
 * Express app setup
 */
import { createServer } from 'http'
import cors from 'cors'
import { execute, subscribe } from 'graphql'
import { SubscriptionServer } from 'subscriptions-transport-ws'
import express from 'express'
import passport from 'passport'
import config from './config'
import routes from './routes'
import morgan from 'morgan'
import schema from './graphql/schema'
import { ApolloServerPluginLandingPageGraphQLPlayground } from 'apollo-server-core'
import { ApolloServer } from '@apollo/server'
import { expressMiddleware } from '@apollo/server/express4'
import { ApolloServerPluginDrainHttpServer } from '@apollo/server/plugin/drainHttpServer'
import { BaseRedisCache } from 'apollo-server-cache-redis'
import bodyParser from 'body-parser'
import cookieParser from 'cookie-parser'
import * as jwt from './libs/authentication/jwt.js'
import * as auth from './libs/authentication/states.js'
import { sitemapHandler } from './handlers/sitemap.js'
import { setupPassportAuth } from './libs/authentication/passport.js'
import { redis } from './libs/redis'
import { version } from './lerna.json'

interface OpenNeuroRequestContext {
  user: string
  isSuperUser: boolean
  userInfo: {
    id: string
  }
}

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

  const httpServer = createServer(app)

  // Apollo server setup
  const apolloServer = new ApolloServer<OpenNeuroRequestContext>({
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
      ApolloServerPluginDrainHttpServer({ httpServer }),
    ],
  })

  // Apollo server 3.0 subscription support
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

  await apolloServer.start()

  // Setup GraphQL middleware
  app.use(
    ['/graphql', '/crn/graphql'],
    cors<cors.CorsRequest>(),
    jwt.authenticate,
    auth.optional,
    expressMiddleware(apolloServer, {
      context: async ({ req }) => {
        if (req.isAuthenticated()) {
          return {
            user: req.user.id,
            isSuperUser: req.user.admin,
            userInfo: req.user,
          }
        }
      },
    }),
  )

  return app
}
