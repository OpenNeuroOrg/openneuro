import { datasets, uploads } from 'openneuro-client'
import { SUBMIT_METADATA } from '../datalad/mutations/submit-metadata.jsx'

/**
 * Create a dataset and update the label
 * @param {object} client Apollo client
 */
export const createDataset = client => ({
  affirmedDefaced,
  affirmedConsent,
}) => {
  return client
    .mutate({
      mutation: datasets.createDataset,
      variables: { affirmedDefaced, affirmedConsent },
      errorPolicy: 'all',
    })
    .then(({ data }) => data.createDataset.id)
}

/**
 * Create a dataset and update the label
 * @param {object} client Apollo client
 */
export const prepareUpload = client => ({ datasetId, uploadId }) => {
  return client.mutate({
    mutation: uploads.prepareUpload,
    variables: { datasetId, uploadId },
  })
}

/**
 * Complete upload
 * @param {object} client Apollo client
 */
export const finishUpload = client => uploadId => {
  return client.mutate({
    mutation: uploads.finishUpload,
    variables: { uploadId },
  })
}

/**
 * Recursively add a file and any needed directories to a tree
 * @param {Object} file
 * @param {Object} parent
 * @param {Array} tokens
 */
export const mkLevels = (file, parent, tokens) => {
  if (tokens.length === 1) {
    // Leafs are files
    //file.path = `${parent.path}${file.name}`
    //file.relativePath = file.path
    parent.files.push(file)
  } else {
    // Nodes are directories
    const dirName = tokens.shift()
    const dirIndex = parent.directories.findIndex(
      dir => dir.name === `${parent.name}/${dirName}`,
    )
    if (dirIndex !== -1) {
      // Directory exists
      mkLevels(file, parent.directories[dirIndex], tokens)
    } else {
      // Create directory
      const newDir = {
        name: parent.name ? `${parent.name}/${dirName}` : dirName,
        files: [],
        directories: [],
      }
      parent.directories.push(newDir)
      mkLevels(file, newDir, tokens)
    }
  }
}

/**
 * Convert from an file input list to a FileTreeInput object
 * @param {object} fileList Browser FileList from file input
 */
export const treeFromList = fileList => {
  const tree = { name: '', files: [], directories: [] }

  for (const file of fileList) {
    if (file.webkitRelativePath) {
      const tokens = file.webkitRelativePath.split('/')
      // Skip the top level, it is created above
      tokens.shift()
      mkLevels(file, tree, tokens)
    } else {
      // Single file case
      tree.files = [...fileList]
    }
  }

  return tree
}

export const submitMetadata = client => (datasetId, metadata) => {
  return client.mutate({
    mutation: SUBMIT_METADATA,
    variables: {
      datasetId,
      metadata: {
        datasetId,
        ...metadata,
      },
    },
    errorPolicy: 'all',
  })
}
