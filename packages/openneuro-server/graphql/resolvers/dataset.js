import * as datalad from '../../datalad/dataset.js'
import pubsub from '../pubsub.js'
import { snapshots, latestSnapshot } from './snapshots.js'
import { description } from './description.js'
import { checkDatasetRead, checkDatasetWrite } from '../permissions.js'
import { user } from './user.js'
import { draft } from './draft.js'
import { permissions } from './permissions.js'
import { datasetComments } from './comment.js'
import * as dataladAnalytics from '../../datalad/analytics.js'
import DatasetModel from '../../models/dataset.js'

export const dataset = (obj, { id }, { user, userInfo }) => {
  return checkDatasetRead(id, user, userInfo).then(() => {
    return datalad.getDataset(id)
  })
}

export const datasets = (parent, args, { user, userInfo }) => {
  if (user) {
    return datalad.getDatasets({ ...args, userId: user, admin: userInfo.admin })
  } else {
    return datalad.getDatasets(args)
  }
}

export const snapshotCreationComparison = ({ created: a }, { created: b }) => {
  return new Date(a).getTime() - new Date(b).getTime()
}

/**
 * Find the canonical name for a dataset from snapshots and drafts
 * @param {object} obj Dataset object (at least {id: "datasetId"})
 */
export const datasetName = obj => {
  return snapshots(obj).then(results => {
    if (results && results.length) {
      // Return the latest snapshot name
      const sortedSnapshots = results.sort(snapshotCreationComparison)
      return description(obj, {
        datasetId: obj.id,
        revision: sortedSnapshots[0].hexsha,
      }).then(desc => desc.Name)
    } else if (obj.revision) {
      // Return the draft name or null
      return description(obj, {
        datasetId: obj.id,
        revision: obj.revision,
      }).then(desc => desc.Name)
    } else {
      return null
    }
  })
}

/**
 * Resolve the best dataset name and cache in mongodb
 * @param {string} datasetId
 */
export const updateDatasetName = datasetId =>
  datasetName({ id: datasetId }).then(name =>
    DatasetModel.update({ id: datasetId }, { $set: { name } }).exec(),
  )

/**
 * Create an empty dataset (new repo, new accession number)
 */
export const createDataset = (obj, args, { user, userInfo }) => {
  // Check for a valid login
  if (user) {
    return datalad.createDataset(user, userInfo)
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
      .then(() => datalad.commitFiles(datasetId, userInfo))
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
          .then(() => pubsub.publish('draftFilesUpdated', { datasetId })),
      )
      .then(() => ({
        id: new Date(),
      }))
  })
}

export const deleteFile = async (
  obj,
  { datasetId, path, filename },
  { user, userInfo },
) => {
  await checkDatasetWrite(datasetId, user, userInfo)
  await datalad.deleteFile(datasetId, path, { name: filename })
  return datalad.commitFiles(datasetId, userInfo).then(() => true)
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
  return dataladAnalytics.trackAnalytics(datasetId, tag, type)
}

/**
 * Get the star count for the dataset
 */
export const stars = async obj => {
  const datasetId = obj && obj.dataset ? (await obj.dataset()).id : obj.id
  return datalad.getStars(datasetId)
}

/**
 * Get the follower count for the dataset
 */
export const followers = async obj => {
  const datasetId = obj && obj.dataset ? (await obj.dataset()).id : obj.id
  return datalad.getFollowers(datasetId)
}

/**
 * Is this user following?
 *
 * Returns null for anonymous users
 */
export const following = (obj, _, { user }) =>
  user
    ? datalad.getUserFollowed(obj.id, user).then(res => (res ? true : false))
    : null

/**
 * Has the user starred this dataset?
 *
 * Returns null for anonymous users
 */
export const starred = (obj, _, { user }) =>
  user
    ? datalad.getUserStarred(obj.id, user).then(res => (res ? true : false))
    : null

/**
 * Dataset object
 */
const Dataset = {
  uploader: ds => user(ds, { id: ds.uploader }),
  draft,
  snapshots,
  latestSnapshot,
  analytics: ds => analytics(ds),
  stars: ds => stars(ds),
  followers: ds => followers(ds),
  permissions: ds =>
    permissions(ds).then(p =>
      p.map(permission =>
        Object.assign(permission, {
          user: user(ds, { id: permission.userId }),
        }),
      ),
    ),
  name: datasetName,
  comments: datasetComments,
  following,
  starred,
}

export default Dataset
