import { datasets, files } from 'openneuro-client'

/**
 * Create a dataset and update the label
 * @param {object} client Apollo client
 */
export const createDataset = client => label => {
  return client
    .mutate({
      mutation: datasets.createDataset,
      variables: { label },
      errorPolicy: 'all',
    })
    .then(({ data }) => data.createDataset.id)
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
    const dirIndex = parent.directories.find(
      dir => dir.name === `${parent.name}/${dirName}`,
    )
    if (dirIndex) {
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

/**
 * Update the files on a dataset given a
 * @param {object} client Apollo client
 */
export const updateFiles = client => (datasetId, fileList) => {
  const tree = treeFromList(fileList)
  return client.mutate({
    mutation: files.updateFiles,
    variables: { datasetId, files: tree },
    errorPolicy: 'all',
  })
}
