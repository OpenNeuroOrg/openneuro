import Raven from 'raven'
import git from 'git-rev-sync'
import { connect as redis_connect } from './libs/redis'
import { connect as resque_connect } from './libs/queue'
import notifications from './libs/notifications'
import aws from './libs/aws'
import config from './config'
import createApp from './app'

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
  release: git.long(),
  tags: { branch: git.branch() },
  environment: config.sentry.ENVIRONMENT,
  autoBreadcrumbs: true,
}
Raven.config(config.sentry.DSN, ravenConfig).install()

const app = createApp(false)

// start server ----------------------------------------------------
redisConnect().then(() => {
  app.listen(config.port, () => {
    console.log('Server is listening on port ' + config.port)
  })
})
