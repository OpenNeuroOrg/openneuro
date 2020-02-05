import config from '../config.js'
import elasticsearch from 'elasticsearch'
import { schemaComposer } from 'graphql-compose'
import {
  composeWithElastic,
  elasticApiFieldConfig,
} from 'graphql-compose-elasticsearch'
import datasetsMapping from './datasets-mapping.json'

const elasticConfig = {
  host: config.elasticsearch.connection,
  apiVersion: '7.5',
}
const elasticClient = new elasticsearch.Client(elasticConfig)

const elasticIndex = 'datasets'

const DatasetSearchTC = composeWithElastic({
  graphqlTypeName: 'Dataset',
  elasticIndex,
  elasticType: elasticIndex,
  elasticMapping: datasetsMapping,
  elasticClient,
})

export const datasetSearch = DatasetSearchTC.getResolver(
  'searchConnection',
).getFieldConfig()

const fieldConfig = elasticApiFieldConfig(elasticConfig)

// Remove any paths we don't want to expose
const clientTC = schemaComposer.createObjectTC(fieldConfig.type)
clientTC.removeOtherFields(['search', 'indices'])

export default {
  ...fieldConfig,
  type: clientTC.getType(),
}
