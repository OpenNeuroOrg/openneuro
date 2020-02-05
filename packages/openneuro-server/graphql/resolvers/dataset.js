import * as datalad from '../../datalad/dataset.js'
import pubsub from '../pubsub.js'
import mongo from '../../libs/mongo'
import { snapshots, latestSnapshot } from './snapshots.js'
import { description } from './description.js'
import { checkDatasetRead, checkDatasetWrite } from '../permissions.js'
import { createSnapshot } from '../../datalad/snapshots.js'
import { user } from './user.js'
import { draft } from './draft.js'
import { permissions } from './permissions.js'
import { datasetComments } from './comment.js'
import { metadata } from './metadata.js'
import * as dataladAnalytics from '../../datalad/analytics.js'
import DatasetModel from '../../models/dataset.js'
import fetch from 'node-fetch'
import * as Sentry from '@sentry/node'
import { UpdatedFile } from '../utils/file.js'

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
      // @ts-ignore
      return description(obj, {
        datasetId: obj.id,
        revision: sortedSnapshots[0].hexsha,
      }).then(desc => desc.Name)
    } else if (obj.revision) {
      // Return the draft name or null
      // @ts-ignore
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
export const updateFiles = async (
  obj,
  { datasetId, files: fileTree },
  { user, userInfo },
) => {
  try {
    await checkDatasetWrite(datasetId, user, userInfo)
    const promises = updateFilesTree(datasetId, fileTree)
    const updatedFiles = await Promise.all(promises)
    await datalad.commitFiles(datasetId, userInfo)
    // Check if this is the first data commit and no snapshots exist
    const snapshot = await mongo.collections.crn.snapshots.findOne({
      datasetId,
    })
    if (!snapshot) await createSnapshot(datasetId, '1.0.0', user)
    pubsub.publish('filesUpdated', {
      datasetId,
      filesUpdated: {
        action: 'UPDATE',
        payload: updatedFiles,
      },
    })
    return true
  } catch (err) {
    Sentry.captureException(err)
    return false
  }
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
  const filesPromises = files.map(file => {
    return datalad
      .addFile(datasetId, name, file)
      .then(({ filename, size }) => new UpdatedFile(filename, size))
  })
  const dirPromises = directories.map(tree => updateFilesTree(datasetId, tree))
  return filesPromises.concat(...dirPromises)
}

/**
 * Delete files from a draft
 */
export const deleteFiles = async (
  obj,
  { datasetId, files: fileTree },
  { user, userInfo },
) => {
  try {
    await checkDatasetWrite(datasetId, user, userInfo)
    const deletedFiles = await Promise.all(deleteFilesTree(datasetId, fileTree))
    await datalad.commitFiles(datasetId, userInfo)
    pubsub.publish('filesUpdated', {
      datasetId,
      filesUpdated: {
        action: 'DELETE',
        payload: deletedFiles,
      },
    })
    return true
  } catch (err) {
    Sentry.captureException(err)
    return false
  }
}

export const deleteFile = async (
  obj,
  { datasetId, path, filename },
  { user, userInfo },
) => {
  try {
    await checkDatasetWrite(datasetId, user, userInfo)
    const deletedFile = await datalad
      .deleteFile(datasetId, path, { name: filename })
      .then(filename => new UpdatedFile(filename))
    await datalad.commitFiles(datasetId, userInfo)
    pubsub.publish('filesUpdated', {
      datasetId,
      filesUpdated: {
        action: 'DELETE',
        payload: [deletedFile],
      },
    })
    return true
  } catch (err) {
    Sentry.captureException(err)
    return false
  }
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
  const { path, files, directories } = fileTree
  if (files.length || directories.length) {
    const filesPromises = files.map(({ filename }) =>
      datalad
        .deleteFile(datasetId, path, { name: filename })
        .then(filename => new UpdatedFile(filename)),
    )
    const dirPromises = directories.map(tree =>
      deleteFilesTree(datasetId, tree),
    )
    return filesPromises.concat(...dirPromises)
  } else {
    return [
      datalad
        .deleteFile(datasetId, path, { name: '' })
        .then(filename => new UpdatedFile(filename)),
    ]
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
 * Is this dataset available on brainlife?
 */
export const onBrainlife = async dataset => {
  const url = `https://brainlife.io/api/warehouse/datalad/datasets?find={"path":{"$regex":"${dataset.id}$"}}`
  const res = await fetch(url)
  const body = await res.json()
  if (Array.isArray(body)) {
    return body[0].path === `OpenNeuroDatasets/${dataset.id}`
  } else {
    return false
  }
}

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
  onBrainlife,
  metadata,
}

export default Dataset
