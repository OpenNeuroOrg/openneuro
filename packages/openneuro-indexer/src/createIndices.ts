import { Client } from "@elastic/elasticsearch"
import { DatasetsIndex } from "@openneuro/search"

/**
 * Setup any indices and mappings in elasticsearch
 */
export const createIndices = async (elasticClient: Client): Promise<void> => {
  const exists = await elasticClient.indices.exists({
    index: DatasetsIndex.name,
  })
  if (exists.statusCode !== 200) {
    await elasticClient.indices.create({
      index: DatasetsIndex.name,
      body: {
        mappings: DatasetsIndex.mapping,
      },
    })
  }
}
