/*eslint no-console: ["error", { allow: ["log"] }] */
/* eslint-disable no-unused-vars*/

/**
 * Express app setup
 */
import express from 'express'
import Raven from 'raven'
import config from './config'
import routes from './routes'
import morgan from 'morgan'
import schema from './graphql/schema'
import { apolloUploadExpress } from 'apollo-upload-server'
import { graphqlExpress, graphiqlExpress } from 'apollo-server-express'
import bodyParser from 'body-parser'
import auth from './libs/auth.js'
import { setupPassportAuth } from './libs/authentication/passport.js'
// import events lib to instantiate CRN Emitter
import events from './libs/events'

// test flag disables Raven for tests
export default test => {
  const app = express()

  setupPassportAuth()

  // Raven must be first to work
  test || app.use(Raven.requestHandler())

  app.use((req, res, next) => {
    res.set(config.headers)
    res.type('application/json')
    next()
  })
  app.use(morgan('short'))
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

  // The GraphQL endpoint
  // Depends on bodyParser.json() above
  app.use(
    '/crn/graphql',
    auth.optional,
    apolloUploadExpress(),
    graphqlExpress(req => {
      const { user, isSuperUser, userInfo } = req
      return {
        schema,
        context: { user, isSuperUser, userInfo },
      }
    }),
  )

  const websocketUrl = process.browser ? config.url.replace('http', 'ws') : null
  const subscriptionUrl = websocketUrl
    ? `${websocketUrl}/graphql-subscriptions`
    : null
  // GraphiQL, a visual editor for queries
  app.use(
    '/crn/graphiql',
    graphiqlExpress({
      endpointURL: '/crn/graphql',
      subscriptionsEndpoint: subscriptionUrl,
    }),
  )

  return app
}
