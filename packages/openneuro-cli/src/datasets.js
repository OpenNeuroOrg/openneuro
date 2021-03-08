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
 * Get an existing dataset's files
 * @param {object} client GraphQL client
 * @param {*} datasetId
 */
export const getDatasetFiles = (client, datasetId) => {
  return client.query({
    query: datasets.getDraftFiles,
    variables: { id: datasetId },
  })
}

/**
 * Create a dataset and return the new accession number
 * @param {object} client
 */
export const createDataset = client => ({
  affirmedDefaced,
  affirmedConsent,
}) => {
  return client
    .mutate({
      mutation: datasets.createDataset,
      variables: { affirmedDefaced, affirmedConsent },
    })
    .then(({ data }) => {
      const dsId = data.createDataset.id
      // eslint-disable-next-line no-console
      console.log(`"${dsId}" created`)
      return dsId
    })
}
