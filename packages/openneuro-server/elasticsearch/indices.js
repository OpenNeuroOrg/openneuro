import datasetsMapping from '../elasticsearch/datasets-mapping.json'

/**
 * Setup any indices and mappings in elasticsearch
 * @param {*} elasticClient
 */
export const createIndices = async elasticClient => {
  const exists = await elasticClient.indices.exists({
    index: 'datasets',
  })
  if (!exists) {
    await elasticClient.indices.create({
      index: 'datasets',
      body: {
        mappings: datasetsMapping,
      },
    })
  }
}
