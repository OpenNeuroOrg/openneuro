import config from '../config.js'
import { schemaComposer } from 'graphql-compose'
import {
  composeWithElastic,
  elasticApiFieldConfig,
} from 'graphql-compose-elasticsearch'
import elasticClient from '../elasticsearch/elastic-client'
import datasetsMapping from '../elasticsearch/datasets-mapping.json'

const elasticConfig = {
  host: config.elasticsearch.connection,
  apiVersion: '7.5',
}

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
