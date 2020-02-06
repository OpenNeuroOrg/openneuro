import datasetsMapping from './mappings/datasets-mapping.json'

/**
 * Setup any indices and mappings in elasticsearch
 * @param {*} elasticClient
 */
export const createIndices = async elasticClient => {
  const exists = await elasticClient.indices.exists({
    index: 'datasets',
  })
  if (exists.statusCode !== 200) {
    await elasticClient.indices.create({
      index: 'datasets',
      body: {
        mappings: datasetsMapping,
      },
    })
  }
}
