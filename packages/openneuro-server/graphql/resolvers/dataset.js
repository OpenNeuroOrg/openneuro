import * as datalad from '../../datalad/dataset.js'
import * as snapshots from '../../datalad/snapshots.js'
import pubsub from '../pubsub.js'
import { updateDatasetRevision, getPartialStatus } from '../../datalad/draft.js'

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
  return datalad.createDataset(label, user, userInfo).then(dataset => {
    return dataset
  })
}

/**
 * Delete an existing dataset, as well as all snapshots
 */
export const deleteDataset = (obj, { label }) => {
  return datalad.deleteDataset(label).then(deleted => {
    pubsub.publish('datasetDeleted', { id: label })
    return deleted
  })
}

/**
 * Tag the working tree for a dataset
 */
export const createSnapshot = (obj, { datasetId, tag }) => {
  return snapshots.createSnapshot(datasetId, tag)
}

/**
 * Remove a tag from a dataset
 */
export const deleteSnapshot = (obj, { datasetId, tag }) => {
  return snapshots.deleteSnapshot(datasetId, tag)
}

/**
 * Add files to a draft
 */
export const updateFiles = (
  obj,
  { datasetId, files: fileTree },
  { userInfo: { name, email } },
) => {
  // TODO - The id returned here is a placeholder
  const promises = updateFilesTree(datasetId, fileTree)
  return Promise.all(promises)
    .then(() =>
      datalad
        .commitFiles(datasetId, name, email)
        .then(res => {
          return res.body.ref
        })
        .then(updateDatasetRevision(datasetId))
        .then(() => pubsub.publish('draftFilesUpdated', { id: datasetId })),
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
 * Delete files from a draft
 */
export const deleteFiles = (
  obj,
  { datasetId, files: fileTree },
  { userInfo: { name, email } },
) => {
  // TODO - The id returned here is a placeholder
  const promises = deleteFilesTree(datasetId, fileTree)
  return Promise.all(promises)
    .then(() =>
      datalad
        .commitFiles(datasetId, name, email)
        .then(res => {
          return res.body.ref
        })
        .then(updateDatasetRevision(datasetId))
        .then(() => pubsub.publish('draftFilesUpdated', { id: datasetId })),
    )
    .then(() => ({
      id: new Date(),
    }))
}

/**
 * Recursively walk a delete tree and return an array of
 * promises for each forwarded request.
 *
 * @param {string} datasetId
 * @param {object} fileTree
 */
export const deleteFilesTree = (datasetId, fileTree) => {
  // drafts just need something to invalidate client cache
  const { name, files, directories } = fileTree
  if (files.length) {
    const filesPromises = files.map(file =>
      datalad.deleteFile(datasetId, name, file),
    )
    const dirPromises = directories.map(tree =>
      deleteFilesTree(datasetId, tree),
    )
    return filesPromises.concat(...dirPromises)
  } else {
    return [datalad.deleteFile(datasetId, name, { name: '' })]
  }
}

/**
 * Update the dataset Public status
 */
export const updatePublic = (obj, { datasetId, publicFlag }) => {
  return datalad.updatePublic(datasetId, publicFlag)
}

/**
 * Update the file urls within a snapshot
 */
export const updateSnapshotFileUrls = (obj, { fileUrls }) => {
  const datasetId = fileUrls.datasetId
  const snapshotTag = fileUrls.tag
  const files = fileUrls.files
  return snapshots.updateSnapshotFileUrls(datasetId, snapshotTag, files)
}

/**
 * Check if a dataset draft is partially uploaded
 */
export const partial = (obj, { datasetId }) => {
  return getPartialStatus(datasetId)
}
