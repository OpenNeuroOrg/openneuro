import { Client } from '@elastic/elasticsearch'
import Datasets from './indexes/datasets'

/**
 * Setup any indices and mappings in elasticsearch
 */
export const createIndices = async (elasticClient: Client): Promise<void> => {
  const exists = await elasticClient.indices.exists({
    index: Datasets.name,
  })
  if (exists.statusCode !== 200) {
    await elasticClient.indices.create({
      index: Datasets.name,
      body: {
        mappings: Datasets.mapping,
      },
    })
  }
}
