/*eslint no-console: ["error", { allow: ["log"] }] */
/* eslint-disable no-unused-vars*/

// dependencies ----------------------------------------------------

import express from 'express'
import Raven from 'raven'
import config from './config'
import routes from './routes'
import bodyParser from 'body-parser'
import morgan from 'morgan'
import mongo from './libs/mongo'
import { connect as redis_connect } from './libs/redis'
import { connect as resque_connect } from './libs/queue'
import notifications from './libs/notifications'
import git from 'git-rev-sync'
import aws from './libs/aws'
// import events lib to instantiate CRN Emitter
import events from './libs/events'

// configuration ---------------------------------------------------
const ravenConfig = {
  release: git.long(),
  tags: { branch: git.branch() },
  environment: config.sentry.ENVIRONMENT,
  autoBreadcrumbs: true,
}
Raven.config(config.sentry.DSN, ravenConfig).install()

mongo.connect(config.mongo.url)

const redisConnect = async () => {
  try {
    const redis = await redis_connect(config.redis)
    await resque_connect(redis)
    console.log('Resque connected')
    // start background tasks
    notifications.initCron()
    aws.batch.initCron()
    aws.cloudwatch.initEvents().then(aws.batch.initQueue)
  } catch (err) {
    console.error(err)
    process.exit(1)
  }
}

let app = express()

// Raven must be first to work
app.use(Raven.requestHandler())

app.use((req, res, next) => {
  res.set(config.headers)
  res.type('application/json')
  next()
})
app.use(morgan('short'))
app.use(bodyParser.json())

// routing ---------------------------------------------------------

app.use(config.apiPrefix, routes)

// error handling --------------------------------------------------
// Raven reporting passes to the next step
app.use(Raven.errorHandler())

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

// start server ----------------------------------------------------

redisConnect().then(() => {
  app.listen(config.port, () => {
    console.log('Server is listening on port ' + config.port)
  })
})
