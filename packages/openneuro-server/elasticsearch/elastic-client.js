import config from '../config.js'
import elasticsearch from 'elasticsearch'

const elasticConfig = {
  host: config.elasticsearch.connection,
  apiVersion: '7.5',
}

const elasticClient = new elasticsearch.Client(elasticConfig)

export default elasticClient
