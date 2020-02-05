import config from '../config.js'
import { schemaComposer } from 'graphql-compose'
import { elasticApiFieldConfig } from 'graphql-compose-elasticsearch'

const fieldConfig = elasticApiFieldConfig({
  host: config.elasticsearch.connection,
  apiVersion: '7.5',
})

// Remove any paths we don't want to expose
const clientTC = schemaComposer.createObjectTC(fieldConfig.type)
clientTC.removeOtherFields(['search', 'indices'])

export default {
  ...fieldConfig,
  type: clientTC.getType(),
}
