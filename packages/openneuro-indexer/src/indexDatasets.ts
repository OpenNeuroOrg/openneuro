import {
  Client as ElasticClient,
  // Interface of the generic API response
  ApiResponse,
} from '@elastic/elasticsearch'
import {
  DatasetsIndex,
  DatasetQueryResult,
  indexDataset,
} from '@openneuro/search'

/**
 * Point 'datasets' index at the new version
 */
export const aliasDatasetsIndex = (
  elasticClient: ElasticClient,
): Promise<ApiResponse> =>
  elasticClient.indices.updateAliases({
    body: {
      actions: [{ add: { index: DatasetsIndex.name, alias: 'datasets' } }],
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
    await aliasDatasetsIndex(elasticClient)
  } catch (e) {
    console.error(e)
  }
}
