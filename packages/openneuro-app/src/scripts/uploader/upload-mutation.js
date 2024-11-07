import { gql } from "@apollo/client"
import { SUBMIT_METADATA } from "../dataset/mutations/submit-metadata.jsx"

export const CREATE_DATASET = gql`
  mutation createDataset($affirmedDefaced: Boolean, $affirmedConsent: Boolean) {
    createDataset(
      affirmedDefaced: $affirmedDefaced
      affirmedConsent: $affirmedConsent
    ) {
      id
    }
  }
`

export const PREPARE_UPLOAD = gql`
  mutation prepareUpload($datasetId: ID!, $uploadId: ID!) {
    prepareUpload(datasetId: $datasetId, uploadId: $uploadId) {
      id
      datasetId
      token
      endpoint
    }
  }
`

export const FINISH_UPLOAD = gql`
  mutation finishUpload($uploadId: ID!) {
    finishUpload(uploadId: $uploadId)
  }
`

/**
 * Create a dataset and update the label
 * @param {object} client Apollo client
 */
export const createDataset =
  (client) => ({ affirmedDefaced, affirmedConsent }) => {
    return client
      .mutate({
        mutation: CREATE_DATASET,
        variables: { affirmedDefaced, affirmedConsent },
        errorPolicy: "all",
      })
      .then(({ data }) => data.createDataset.id)
  }

/**
 * Create a dataset and update the label
 * @param {object} client Apollo client
 */
export const prepareUpload = (client) => ({ datasetId, uploadId }) => {
  return client.mutate({
    mutation: PREPARE_UPLOAD,
    variables: { datasetId, uploadId },
  })
}

/**
 * Complete upload
 * @param {object} client Apollo client
 */
export const finishUpload = (client) => (uploadId) => {
  return client.mutate({
    mutation: FINISH_UPLOAD,
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
      (dir) => dir.name === `${parent.name}/${dirName}`,
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
export const treeFromList = (fileList) => {
  const tree = { name: "", files: [], directories: [] }

  for (const file of fileList) {
    if (file.webkitRelativePath) {
      const tokens = file.webkitRelativePath.split("/")
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

export const submitMetadata = (client) => (datasetId, metadata) => {
  return client.mutate({
    mutation: SUBMIT_METADATA,
    variables: {
      datasetId,
      metadata: {
        datasetId,
        ...metadata,
      },
    },
    errorPolicy: "all",
  })
}
