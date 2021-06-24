import {
  Client as ElasticClient,
  // Object that contains the type definitions of every API method
  RequestParams,
  // Interface of the generic API response
  ApiResponse,
} from '@elastic/elasticsearch'
import Datasets from './indexes/datasets'

// TODO: This would be better to generate from the GraphQL schema
interface DatasetQueryResult {
  id: string
  metadata: Record<string, any>
  latestSnapshot: Record<string, any>
  __typename: string
}

/**
 * Convert from GraphQL dataset object to RequestParams.Index documents
 * TODO: Use generated GraphQL typing
 * @param datasetObj GraphQL dataset object from searchDatasets query
 */
export function extractDatasetDocument(
  datasetObj: DatasetQueryResult,
): RequestParams.Index {
  const dataset: RequestParams.Index = {
    index: Datasets.name,
    id: datasetObj.id,
    body: {
      ...datasetObj,
    },
  }
  return dataset
}

/**
 * Index one dataset (latest snapshot)
 * @param elasticClient Elastic client to submit index data
 * @param datasetObj OpenNeuro GraphQL dataset object
 */
export async function indexDataset(
  elasticClient: ElasticClient,
  datasetObj: DatasetQueryResult,
): Promise<ApiResponse> {
  try {
    console.log(`Indexing "${datasetObj.id}"`)
    const response: ApiResponse = await elasticClient.index(
      extractDatasetDocument(datasetObj),
    )
    return response
  } catch (err) {
    console.dir(err)
  }
}

/**
 * Point 'datasets' index at the new version
 */
export const aliasDatasetsIndex = (
  elasticClient: ElasticClient,
): Promise<ApiResponse> =>
  elasticClient.indices.updateAliases({
    body: {
      actions: [{ add: { index: Datasets.name, alias: 'datasets' } }],
    },
  })

/**
 * Request OpenNeuro datasets and loop over all public datasets for indexing
 */
export default async function indexDatasets(
  elasticClient: ElasticClient,
  datasets: AsyncGenerator<DatasetQueryResult>,
): Promise<void> {
  try {
    for await (const dataset of datasets) {
      void indexDataset(elasticClient, dataset)
    }
    console.log('ALIAS!!!')
    console.log('ALIAS!!!')
    console.log('ALIAS!!!')
    await aliasDatasetsIndex(elasticClient)
    console.log('ALIASED!!!')
  } catch (e) {
    console.error(e)
  }
}
