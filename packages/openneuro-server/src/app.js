/*eslint no-console: ["error", { allow: ["log"] }] */
/* eslint-disable no-unused-vars*/

/**
 * Express app setup
 */
import express from 'express'
import passport from 'passport'
import config from './config'
import routes from './routes'
import morgan from 'morgan'
import schema from './graphql/schema'
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

// test flag disables Sentry for tests
export default test => {
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

  // error handling --------------------------------------------------\

  // Apollo engine setup
  const engineConfig = {
    privateVariables: ['files'],
  }

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
    // Disable engine in test suite
    engine: test || !process.env.ENGINE_API_KEY ? false : engineConfig,
    // Always allow introspection - our schema is public
    introspection: true,
    // Enable authenticated queries in playground
    // Note - buggy at the moment
    playground: {
      settings: {
        'request.credentials': 'same-origin',
      },
    },
    // Enable cache options
    tracing: true,
    cacheControl: true,
    // Don't limit the max size for dataset uploads
    uploads: { maxFieldSize: Infinity },
    formatResponse: response => {
      return { ...response, extensions: { openneuro: { version } } }
    },
    cache: new BaseRedisCache({
      client: redis,
    }),
  })

  // Setup pre-GraphQL middleware
  app.use('/crn/graphql', jwt.authenticate, auth.optional)

  // Inject Apollo Server
  apolloServer.applyMiddleware({ app, path: '/crn/graphql' })

  return app
}
