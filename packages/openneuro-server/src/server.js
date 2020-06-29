import * as Sentry from '@sentry/node'
import { createServer } from 'http'
import mongoose from 'mongoose'
import subscriptionServerFactory from './libs/subscription-server.js'
import { connect as redisConnect } from './libs/redis'
import notifications from './libs/notifications'
import config from './config'
import createApp from './app'
import packageJson from '../package.json'

const redisConnectionSetup = async () => {
  try {
    await redisConnect(config.redis)
    // start background tasks
    notifications.initCron()
  } catch (err) {
    // eslint-disable-next-line no-console
    console.error(err)
    process.exit(1)
  }
}

Sentry.init({
  dsn: 'https://ba0c58863b3e40a2a412132bfd2711ea@sentry.io/251076',
  release: packageJson.version,
  environment: config.sentry.ENVIRONMENT,
})

const app = createApp(false)

mongoose.connect(config.mongo.url, {
  useNewUrlParser: true,
  dbName: config.mongo.dbName,
  connectTimeoutMS: config.mongo.connectTimeoutMS,
})

redisConnectionSetup().then(() => {
  const server = createServer(app)
  server.listen(config.port, () => {
    // eslint-disable-next-line no-console
    console.log('Server is listening on port ' + config.port)
    // Setup GraphQL subscription transport
    subscriptionServerFactory(server)
  })
})
