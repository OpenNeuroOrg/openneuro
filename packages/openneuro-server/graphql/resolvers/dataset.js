import * as datalad from '../../datalad/dataset'

export const dataset = (obj, { id }) => {
  return datalad.getDataset(id)
}

export const datasets = () => {
  return datalad.getDatasets()
}

/**
 * Create an empty dataset (new repo, new accession number)
 */
export const createDataset = (obj, { label }, { user, userInfo }) => {
  return datalad.createDataset(label, user, userInfo)
}

/**
 * Tag the working tree for a dataset
 */
export const createSnapshot = (obj, { datasetId, tag }) => {
  return datalad.createSnapshot(datasetId, tag)
}

/**
 * Add files to a draft
 */
export const updateFiles = (
  obj,
  { datasetId, files: fileTree },
  { userInfo: { firstname, lastname, email } },
) => {
  // TODO - The id returned here is a placeholder
  const promises = updateFilesTree(datasetId, fileTree)
  return Promise.all(promises)
    .then(() =>
      datalad.commitFiles(datasetId, `${firstname} ${lastname}`, email),
    )
    .then(() => ({
      id: new Date(),
    }))
}

/**
 * Recursively walk an upload tree and return an array of
 * promises for each forwarded request.
 *
 * @param {string} datasetId
 * @param {object} fileTree
 */
export const updateFilesTree = (datasetId, fileTree) => {
  // drafts just need something to invalidate client cache
  const { name, files, directories } = fileTree
  const filesPromises = files.map(file =>
    datalad.addFile(datasetId, name, file),
  )
  const dirPromises = directories.map(tree => updateFilesTree(datasetId, tree))
  return filesPromises.concat(...dirPromises)
}

/**
 * Update the dataset Public status
 */
export const updatePublic = (obj, { datasetId, publicFlag}) => {
  console.log('hit the updatePublic resolver!')
  return datalad.updatePublic(datasetId, publicFlag)
}