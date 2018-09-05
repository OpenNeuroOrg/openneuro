/*eslint no-console: ["error", { allow: ["log"] }] */
/* eslint-disable no-unused-vars*/

/**
 * Express app setup
 */
import express from 'express'
import Raven from 'raven'
import passport from 'passport'
import config from './config'
import routes from './routes'
import morgan from 'morgan'
import schema from './graphql/schema'
import { ApolloServer } from 'apollo-server-express'
import bodyParser from 'body-parser'
import cookieParser from 'cookie-parser'
import * as jwt from './libs/authentication/jwt.js'
import * as auth from './libs/authentication/states.js'
import { setupPassportAuth } from './libs/authentication/passport.js'
// import events lib to instantiate CRN Emitter
import events from './libs/events'

// test flag disables Raven for tests
export default test => {
  const app = express()

  setupPassportAuth()

  // Raven must be first to work
  test || app.use(Raven.requestHandler())

  app.use(passport.initialize())

  app.use((req, res, next) => {
    res.set(config.headers)
    res.type('application/json')
    next()
  })
  app.use(morgan('short'))
  app.use(cookieParser())
  app.use(bodyParser.urlencoded({ extended: false }))
  app.use(bodyParser.json())

  // routing ---------------------------------------------------------

  app.use(config.apiPrefix, routes)

  // error handling --------------------------------------------------\
  // Raven reporting passes to the next step
  test || app.use(Raven.errorHandler())

  app.use(function(err, req, res, next) {
    res.header('Content-Type', 'application/json')
    var send = { error: '' }
    var http_code = typeof err.http_code === 'undefined' ? 500 : err.http_code
    if (typeof err.message !== 'undefined' && err.message !== '') {
      send.error = err.message
    } else {
      if (err.http_code == 400) {
        send.error = 'there was something wrong with that request'
      } else if (err.http_code == 401) {
        send.error = 'you are not authorized to do that'
      } else if (err.http_code == 404) {
        send.error = 'that resource was not found'
      } else {
        send.error = 'there was a problem'
      }
    }
    res.status(http_code).send(send)
  })

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
    engine: {
      privateVariables: ['files'],
    },
  })

  // Setup pre-GraphQL middleware
  app.use('/crn/graphql', jwt.authenticate, auth.optional)

  // Inject Apollo Server
  apolloServer.applyMiddleware({ app, path: '/crn/graphql' })

  return app
}
