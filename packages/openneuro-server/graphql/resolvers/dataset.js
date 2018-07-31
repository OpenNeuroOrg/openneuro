import * as datalad from '../../datalad/dataset.js'
import * as snapshots from '../../datalad/snapshots.js'
import pubsub from '../pubsub.js'
import { checkDatasetRead, checkDatasetWrite } from '../permissions.js'

export const dataset = (obj, { id }, { user, userInfo }) => {
  return checkDatasetRead(id, user, userInfo).then(() => {
    return datalad.getDataset(id)
  })
}

export const datasets = (parent, args, { user, userInfo }) => {
  if (user) {
    return datalad.getDatasets({ userId: user, admin: userInfo.admin })
  } else {
    return datalad.getDatasets()
  }
}

/**
 * Create an empty dataset (new repo, new accession number)
 */
export const createDataset = (obj, { label }, { user, userInfo }) => {
  // Check for a valid login
  if (user) {
    return datalad.createDataset(label, user, userInfo)
  } else {
    throw new Error('You must be logged in to create a dataset.')
  }
}

/**
 * Delete an existing dataset, as well as all snapshots
 */
export const deleteDataset = (obj, { id }, { user, userInfo }) => {
  return checkDatasetWrite(id, user, userInfo).then(() => {
    return datalad.deleteDataset(id).then(deleted => {
      pubsub.publish('datasetDeleted', { id })
      return deleted
    })
  })
}

/**
 * Tag the working tree for a dataset
 */
export const createSnapshot = (obj, { datasetId, tag }, { user, userInfo }) => {
  return checkDatasetWrite(datasetId, user, userInfo).then(() => {
    return snapshots.createSnapshot(datasetId, tag, userInfo)
  })
}

/**
 * Remove a tag from a dataset
 */
export const deleteSnapshot = (obj, { datasetId, tag }, { user, userInfo }) => {
  return checkDatasetWrite(datasetId, user, userInfo).then(() => {
    return snapshots.deleteSnapshot(datasetId, tag)
  })
}

/**
 * Add files to a draft
 */
export const updateFiles = (
  obj,
  { datasetId, files: fileTree },
  { user, userInfo },
) => {
  return checkDatasetWrite(datasetId, user, userInfo).then(() => {
    const promises = updateFilesTree(datasetId, fileTree)
    return Promise.all(promises)
      .then(() =>
        datalad
          .commitFiles(datasetId, userInfo)
          .then(() => pubsub.publish('draftFilesUpdated', { id: datasetId })),
      )
      .then(() => ({
        id: new Date(),
      }))
  })
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
  { user, userInfo },
) => {
  return checkDatasetWrite(datasetId, user, userInfo).then(() => {
    // TODO - The id returned here is a placeholder
    const promises = deleteFilesTree(datasetId, fileTree)
    return Promise.all(promises)
      .then(() =>
        datalad
          .commitFiles(datasetId, userInfo)
          .then(() => pubsub.publish('draftFilesUpdated', { id: datasetId })),
      )
      .then(() => ({
        id: new Date(),
      }))
  })
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
export const updatePublic = (
  obj,
  { datasetId, publicFlag },
  { user, userInfo },
) => {
  return checkDatasetWrite(datasetId, user, userInfo).then(() => {
    return datalad.updatePublic(datasetId, publicFlag)
  })
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
 * Get analytics for a dataset or snapshot
 */
export const analytics = async obj => {
  // if the dataset field exists, the request is from a snapshot, and
  // we resolve the datasetId from the dataset snapshot field of context.
  // otherwise, just use the id field because the object is a dataset
  const datasetId = obj && obj.dataset ? (await obj.dataset()).id : obj.id

  // if the object is a snapshot, grab the tag. otherwise, tag is null
  const tag = obj && obj.tag ? obj.tag : null
  return datalad.getDatasetAnalytics(datasetId, tag)
}

/**
 * Track analytic of type 'view' or 'download' for a dataset / snapshot
 */
export const trackAnalytics = (obj, { datasetId, tag, type }) => {
  return datalad.trackAnalytics(datasetId, tag, type)
}
