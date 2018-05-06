import path from 'path'
import { datasets } from 'openneuro-client'

/**
 * Check for an existing dataset
 * @param {object} client
 * @param {string} dir
 * @param {string} datasetId
 */
export const getDataset = (client, dir, datasetId) => {
  return client
    .query({
      query: datasets.getDataset,
      variables: { id: datasetId },
    })
    .then(() => datasetId)
}

/**
 * Create a dataset and return the new accession number
 * @param {object} client
 * @param {string} dir
 */
export const createDataset = (client, dir) => {
  const label = path.basename(dir)
  return client
    .mutate({
      mutation: datasets.createDataset,
      variables: { label },
    })
    .then(({ data }) => {
      const dsId = data.createDataset.id
      // eslint-disable-next-line no-console
      console.log(`"${dsId}" created with label "${label}"`)
      return dsId
    })
}
