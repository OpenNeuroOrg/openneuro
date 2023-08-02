import Redis from 'ioredis'
import config from '../config.js'

async function* asyncIterator(_) {
  yield null
}

export default { publish: (_, __) => {}, asyncIterator }
