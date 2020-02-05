import config from '../config.js'
import elasticsearch from 'elasticsearch'
import { schemaComposer } from 'graphql-compose'
import {
  composeWithElastic,
  elasticApiFieldConfig,
} from 'graphql-compose-elasticsearch'

const elasticConfig = {
  host: config.elasticsearch.connection,
  apiVersion: '7.5',
}

const fieldConfig = elasticApiFieldConfig(elasticConfig)

// Remove any paths we don't want to expose
const clientTC = schemaComposer.createObjectTC(fieldConfig.type)
clientTC.removeOtherFields(['search', 'indices'])

export const datasetSearch = composeWithElastic({
  graphqlTypeName: 'Dataset',
  elasticIndex: 'datasets',
  elasticType: 'datasets',
  elasticMapping: {},
  elasticClient: new elasticsearch.Client(elasticConfig),
})

export default {
  ...fieldConfig,
  type: clientTC.getType(),
}
