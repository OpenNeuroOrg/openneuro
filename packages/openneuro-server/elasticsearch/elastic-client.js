import config from '../config.js'
import { Client } from '@elastic/elasticsearch'

const elasticConfig = {
  node: config.elasticsearch.connection || 'http://mock-client',
  maxRetries: 3,
}

const elasticClient = new Client(elasticConfig)

export default elasticClient
