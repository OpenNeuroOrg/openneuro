import NR from 'node-resque'
import tasks from './tasks.js'

let queue = null

const connect = async redis => {
  if (!queue) {
    queue = new NR.queue({ connection: { redis: redis } }, tasks)
    await queue.connect()
  }
  return queue
}

export default queue
export { queue, connect }
