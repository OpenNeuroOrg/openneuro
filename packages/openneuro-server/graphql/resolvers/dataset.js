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
export const createDataset = (obj, { label }) => {
  return datalad.createDataset(label)
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
export const updateFiles = (obj, { datasetId, files: fileTree }) => {
  // TODO - The id returned here is a placeholder
  // drafts just need something to invalidate client cache
  const { name, files, directories } = fileTree
  const filesPromises = files.map(async file =>
    datalad.addFile(datasetId, name, await file),
  )
  const dirPromises = directories.map(tree =>
    updateFiles(obj, { datasetId, files: tree }),
  )
  return Promise.all([...filesPromises, ...dirPromises]).then(() => ({
    id: new Date(),
  }))
}
