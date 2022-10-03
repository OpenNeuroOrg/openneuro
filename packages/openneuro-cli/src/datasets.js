import { datasets } from '@openneuro/client'

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
export const createDataset =
  client =>
  ({ affirmedDefaced, affirmedConsent }) => {
    return client
      .mutate({
        mutation: datasets.createDataset,
        variables: { affirmedDefaced, affirmedConsent },
      })
      .then(({ data }) => {
        return data.createDataset.id
      })
  }

export const downloadSnapshot = gql`
  query downloadSnapshot($datasetId: ID!, $tag: String!, $tree: String) {
    snapshot(datasetId: $datasetId, tag: $tag) {
      id
      files(tree: $tree) {
        id
        directory
        filename
        size
        urls
      }
    }
  }
`

export const downloadDataset =
  client =>
  async ({ datasetId, tag, tree }) => {
    if (tag) {
      const { data } = await client.query({
        query: datasets.downloadSnapshot,
        variables: {
          datasetId,
          tag,
          tree,
        },
      })
      return data.snapshot.files
    } else {
      const { data } = await client.query({
        query: datasets.downloadDataset,
        variables: {
          datasetId,
          tree,
        },
      })
      return data.dataset.draft.files
    }
  }
