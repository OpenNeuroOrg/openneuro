import { gql } from "@apollo/client"
import { datasets } from "@openneuro/client"

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

// Get only working tree files
export const getDraftFiles = gql`
  query dataset($id: ID!, $tree: String) {
    dataset(id: $id) {
      id
      draft {
        id
        files(tree: $tree) {
          id
          directory
          filename
          size
        }
      }
      metadata {
        affirmedDefaced
        affirmedConsent
      }
    }
  }
`

/**
 * Get an existing dataset's files
 * @param {object} client GraphQL client
 * @param {*} datasetId
 */
export const getDatasetFiles = async (
  client,
  datasetId,
  path = "",
  tree = null,
) => {
  const files = []
  await _getDatasetFiles(client, datasetId, (f) => files.push(f), path, tree)
  return files
}

/**
 * Get an existing dataset's files
 * @param {object} client GraphQL client
 * @param {*} datasetId
 */
export const _getDatasetFiles = async (
  client,
  datasetId,
  callback,
  path = "",
  tree = null,
) => {
  const files = []
  const { data } = await client.query({
    query: getDraftFiles,
    variables: { id: datasetId, tree },
  })
  for (const f of data.dataset.draft.files) {
    if (f.directory) {
      await _getDatasetFiles(
        client,
        datasetId,
        callback,
        path ? `${path}/${f.filename}` : f.filename,
        f.id,
      )
    } else {
      callback({
        ...f,
        filename: path ? `${path}/${f.filename}` : f.filename,
      })
    }
  }
  return files
}

/**
 * Create a dataset and return the new accession number
 * @param {object} client
 */
export const createDataset =
  (client) => ({ affirmedDefaced, affirmedConsent }) => {
    return client
      .mutate({
        mutation: datasets.createDataset,
        variables: { affirmedDefaced, affirmedConsent },
      })
      .then(({ data }) => {
        return data.createDataset.id
      })
  }

export const downloadDataset = (client) => async ({ datasetId, tag, tree }) => {
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
