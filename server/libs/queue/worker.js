import os from 'os'
import mongo from '../mongo'
import { connect as redis_connect } from '../redis'
import config from '../../config'
import NR from 'node-resque'
import tasks from './tasks'

let worker = null

/* Start a standalone worker */
const start = () => {
  mongo.connect()
  redis_connect(config.redis).then(redis => {
    const workerConfig = {
      connection: { redis: redis },
      looping: true,
      timeout: 5000,
      queues: ['*'],
      name: os.hostname() + ':' + process.pid,
    }

    worker = new NR.worker(workerConfig, tasks)

    worker.connect(() => {
      worker.workerCleanup()
      worker.start()
    })
  })
}

export { worker, start }
export default { worker, start }
