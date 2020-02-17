import Datasets from './indexes/datasets'

/**
 * Setup any indices and mappings in elasticsearch
 * @param {*} elasticClient
 */
export const createIndices = async elasticClient => {
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
