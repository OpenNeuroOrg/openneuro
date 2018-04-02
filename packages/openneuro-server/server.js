import Raven from 'raven'
import mongo from './libs/mongo'
import { connect as redis_connect } from './libs/redis'
import { connect as resque_connect } from './libs/queue'
import notifications from './libs/notifications'
import aws from './libs/aws'
import config from './config'
import createApp from './app'
import packageJson from './package.json'

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

const ravenConfig = {
  release: packageJson.version,
  environment: config.sentry.ENVIRONMENT,
  autoBreadcrumbs: true,
}
Raven.config(config.sentry.DSN, ravenConfig).install()

const app = createApp(false)

// start server ----------------------------------------------------
mongo.connect(config.mongo.url).then(() => {
  redisConnect().then(() => {
    app.listen(config.port, () => {
      console.log('Server is listening on port ' + config.port)
    })
  })
})
