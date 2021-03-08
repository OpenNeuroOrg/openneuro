import * as datalad from '../../datalad/dataset.js'
import pubsub from '../pubsub.js'
import { removeDatasetSearchDocument } from '../../graphql/resolvers/dataset-search.js'
import { snapshots, latestSnapshot } from './snapshots.js'
import { description } from './description.js'
import { checkDatasetRead, checkDatasetWrite } from '../permissions.js'
import { user } from './user.js'
import { permissions } from './permissions.js'
import { datasetComments } from './comment.js'
import { metadata } from './metadata.js'
import { history } from './history.js'
import * as dataladAnalytics from '../../datalad/analytics.js'
import DatasetModel from '../../models/dataset.js'
import Deletion from '../../models/deletion.js'
import fetch from 'node-fetch'
import * as Sentry from '@sentry/node'
import { UpdatedFile } from '../utils/file.js'
import { getDatasetWorker } from '../../libs/datalad-service.js'
import { getDraftHead } from '../../datalad/dataset.js'

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
      return description({
        id: obj.id,
        revision: sortedSnapshots[0].hexsha,
      }).then(desc => desc.Name)
    } else if (obj.revision) {
      // Return the draft name or null
      return description({
        id: obj.id,
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
export const createDataset = (
  obj,
  { affirmedDefaced, affirmedConsent },
  { user, userInfo },
) => {
  // Check for a valid login
  if (user) {
    if (affirmedDefaced || affirmedConsent) {
      return datalad.createDataset(user, userInfo, {
        affirmedDefaced,
        affirmedConsent,
      })
    } else {
      throw new Error(
        'New dataset must be defaced or have participant consent.',
      )
    }
  } else {
    throw new Error('You must be logged in to create a dataset.')
  }
}

/**
 * Delete an existing dataset, as well as all snapshots
 */
export const deleteDataset = async (
  obj,
  { id, reason, redirect },
  { user, userInfo },
) => {
  await checkDatasetWrite(id, user, userInfo)
  const deleted = await datalad.deleteDataset(id)
  // Remove from the current version of the Elastic index
  try {
    await removeDatasetSearchDocument(id)
  } catch (err) {
    // This likely means this dataset had not yet been indexed
    console.error(err)
  }
  await new Deletion({
    datasetId: id,
    reason,
    redirect,
    user: { _id: user },
  }).save()
  await pubsub.publish('datasetDeleted', {
    datasetId: id,
    datasetDeleted: id,
  })
  return deleted
}

/**
 * Delete files from a draft
 */
export const deleteFiles = async (
  obj,
  { datasetId, path },
  { user, userInfo },
) => {
  try {
    await checkDatasetWrite(datasetId, user, userInfo)
    await datalad.deletePath(datasetId, path, userInfo)
    pubsub.publish('filesUpdated', {
      datasetId,
      filesUpdated: {
        action: 'DELETE',
        payload: [
          {
            id: `${path}:0`,
            filename: path,
          },
        ],
      },
    })
    return true
  } catch (err) {
    console.error(err)
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
      .deleteFile(datasetId, path, { name: filename }, userInfo)
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
  try {
    dataladAnalytics.trackAnalytics(datasetId, tag, type)
    return true
  } catch (err) {
    return false
  }
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
  try {
    const url = `https://brainlife.io/api/warehouse/datalad/datasets?find={"path":{"$regex":"${dataset.id}$"}}`
    const res = await fetch(url)
    const body = await res.json()
    if (Array.isArray(body) && body.length) {
      return body[0].path === `OpenNeuroDatasets/${dataset.id}`
    } else {
      return false
    }
  } catch (err) {
    return false
  }
}

const worker = obj => getDatasetWorker(obj.id)

/**
 * Dataset object
 */
const Dataset = {
  uploader: ds => user(ds, { id: ds.uploader }),
  draft: async obj => ({
    id: obj.id,
    revision: await getDraftHead(obj.id),
    modified: obj.modified,
  }),
  snapshots,
  latestSnapshot,
  analytics,
  stars,
  followers,
  permissions,
  name: datasetName,
  comments: datasetComments,
  following,
  starred,
  onBrainlife,
  metadata,
  history,
  worker,
}

export default Dataset
