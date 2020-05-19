/**
 * Get snapshots from datalad-service tags
 */
import * as Sentry from '@sentry/node'
import request from 'superagent'
import mongo from '../libs/mongo'
import { redis, redlock } from '../libs/redis.js'
import config from '../config.js'
import pubsub from '../graphql/pubsub.js'
import { updateDatasetName } from '../graphql/resolvers/dataset.js'
import { description } from '../graphql/resolvers/description.js'
import doiLib from '../libs/doi/index.js'
import { filesKey, getFiles } from './files.js'
import { generateDataladCookie } from '../libs/authentication/jwt'
import notifications from '../libs/notifications'
import Snapshot from '../models/snapshot.js'
import { trackAnalytics } from './analytics.js'
import { updateDatasetRevision } from './draft.js'

const c = mongo.collections
const uri = config.datalad.uri

/**
 * Snapshot contents key
 *
 * Immutable data
 *
 * @param {string} datasetId
 * @param {string} tag
 */
const snapshotKey = (datasetId, tag) => {
  return `openneuro:snapshot:${datasetId}:${tag}`
}

/**
 * Index of snapshots
 *
 * This should get cleared when snapshots are added or removed
 * @param {string} datasetId
 */
const snapshotIndexKey = datasetId => {
  return `openneuro:snapshot-index:${datasetId}`
}

const lockSnapshot = (datasetId, tag) => {
  return redlock.lock(
    `openneuro:create-snapshot-lock:${datasetId}:${tag}`,
    1800000,
  )
}

const createSnapshotMetadata = (datasetId, tag, hexsha, created) => {
  return Snapshot.update(
    { datasetId: datasetId, tag: tag },
    {
      $set: {
        datasetId: datasetId,
        tag: tag,
        hexsha: hexsha,
        created: created,
      },
    },
    { upsert: true },
  )
}

const getSnapshotMetadata = (datasetId, snapshots) => {
  const tags = snapshots.map(s => s.tag)
  return new Promise((resolve, reject) => {
    c.crn.snapshots
      .find({ datasetId: datasetId, tag: { $in: tags } })
      .toArray((err, metadata) => {
        if (err) reject(err)
        snapshots = snapshots.map(s => {
          const matchMetadata = metadata.find(m => m.tag == s.tag)
          s.created = matchMetadata ? matchMetadata.created : null
          return s
        })
        resolve(snapshots)
      })
  })
}

const createIfNotExistsDoi = async (
  datasetId,
  tag,
  descriptionFieldUpdates,
) => {
  if (config.doi.username && config.doi.password) {
    // Mint a DOI
    // Get the newest description
    const oldDesc = await description({}, { datasetId, revision: 'HEAD' })
    const snapshotDoi = await doiLib.registerSnapshotDoi(
      datasetId,
      tag,
      oldDesc,
    )
    if (snapshotDoi) descriptionFieldUpdates['DatasetDOI'] = snapshotDoi
    else throw new Error('DOI minting failed.')
  }
}

const postSnapshot = async (
  user,
  createSnapshotUrl,
  descriptionFieldUpdates,
  snapshotChanges,
) => {
  // Create snapshot once DOI is ready
  const response = await request
    .post(createSnapshotUrl)
    .send({
      description_fields: descriptionFieldUpdates, // eslint-disable-line @typescript-eslint/camelcase
      snapshot_changes: snapshotChanges, // eslint-disable-line @typescript-eslint/camelcase
    })
    .set('Accept', 'application/json')
    .set('Cookie', generateDataladCookie(config)(user))

  return response.body
}

const getSnapshotFiles = async (datasetId, sKey, snapshot) => {
  let files
  // We should almost always get the fast path here
  const fKey = filesKey(datasetId, snapshot.hexsha)
  const filesFromCache = await redis.get(fKey)
  if (filesFromCache) {
    files = JSON.parse(filesFromCache)
    // Eager caching for snapshots if all data is available
    redis.set(sKey, JSON.stringify(snapshot))
  } else {
    // Return the promise so queries won't block
    files = getFiles(datasetId, snapshot.hexsha)
  }
  return files
}

/**
 * Get a list of all snapshot tags available for a dataset
 *
 * This is equivalent to `git tag` on the repository
 *
 * @param {string} datasetId Dataset accession number
 */
export const getSnapshots = datasetId => {
  const url = `${uri}/datasets/${datasetId}/snapshots`
  const key = snapshotIndexKey(datasetId)
  return redis.get(key).then(data => {
    if (data) return JSON.parse(data)
    else
      return request
        .get(url)
        .set('Accept', 'application/json')
        .then(async ({ body: { snapshots } }) => {
          snapshots = await getSnapshotMetadata(datasetId, snapshots)
          redis.set(key, JSON.stringify(snapshots))
          return snapshots
        })
  })
}

const announceNewSnapshot = async (snapshot, datasetId, user) => {
  if (snapshot.files) {
    notifications.snapshotCreated(datasetId, snapshot, user) // send snapshot notification to subscribers
  }
  pubsub.publish('snapshotsUpdated', {
    datasetId,
    snapshotsUpdated: {
      id: datasetId,
      snapshots: await getSnapshots(datasetId),
      latestSnapshot: snapshot,
    },
  })
}

/**
 * Snapshot the current working tree for a dataset
 * @param {String} datasetId - Dataset ID string
 * @param {String} tag - Snapshot identifier and git tag
 * @param {Object} user - User object that has made the snapshot request
 * @returns {Promise} - resolves when tag is created
 */
export const createSnapshot = async (
  datasetId,
  tag,
  user,
  descriptionFieldUpdates = {},
  snapshotChanges = [],
) => {
  const indexKey = snapshotIndexKey(datasetId)
  const sKey = snapshotKey(datasetId, tag)

  // lock snapshot id to prevent upload/update conflicts
  const snapshotLock = await lockSnapshot(datasetId, tag)

  try {
    await createIfNotExistsDoi(datasetId, tag, descriptionFieldUpdates)

    const createSnapshotUrl = `${uri}/datasets/${datasetId}/snapshots/${tag}`
    const snapshot = await postSnapshot(
      user,
      createSnapshotUrl,
      descriptionFieldUpdates,
      snapshotChanges,
    )
    snapshot.created = new Date()
    snapshot.files = await getSnapshotFiles(datasetId, sKey, snapshot)

    // Clear the index now that the new snapshot is ready
    redis.del(indexKey)

    await Promise.all([
      // Update the draft status in datasets collection in case any changes were made (DOI, License)
      updateDatasetRevision(datasetId, snapshot.hexsha),

      // Update metadata in snapshots collection
      createSnapshotMetadata(datasetId, tag, snapshot.hexsha, snapshot.created),

      // Trigger an async update for the name field (cache for sorting)
      updateDatasetName(datasetId),
    ])

    snapshotLock.unlock()
    announceNewSnapshot(snapshot, datasetId, user)
    return snapshot
  } catch (err) {
    // delete the keys if any step fails
    // this avoids inconsistent cache state after failures
    redis.del(sKey)
    redis.del(indexKey)
    snapshotLock.unlock()
    Sentry.captureException(err)
    return err
  }
}

// TODO - deleteSnapshot
// It should delete the index redis key
export const deleteSnapshot = (datasetId, tag) => {
  const url = `${uri}/datasets/${datasetId}/snapshots/${tag}`
  const indexKey = snapshotIndexKey(datasetId)
  const sKey = snapshotKey(datasetId, tag)

  return request.del(url).then(({ body }) =>
    redis
      .del(indexKey)
      .then(() => redis.del(sKey))
      .then(async () => {
        pubsub.publish('snapshotsUpdated', {
          datasetId,
          snapshotsUpdated: {
            id: datasetId,
            snapshots: await getSnapshots(datasetId),
          },
        })
        return body
      }),
  )
}

/**
 * Get the contents of a snapshot (files, git metadata) from datalad-service
 * @param {string} datasetId Dataset accession number
 * @param {string} tag Tag name to retrieve
 */
export const getSnapshot = (datasetId, tag) => {
  const url = `${uri}/datasets/${datasetId}/snapshots/${tag}`
  const key = snapshotKey(datasetId, tag)
  // Track a view for each snapshot query
  trackAnalytics(datasetId, tag, 'views')
  return redis.get(key).then(data => {
    if (data) return JSON.parse(data)
    else
      return request
        .get(url)
        .set('Accept', 'application/json')
        .then(async ({ body }) => {
          const { created, hexsha } = await c.crn.snapshots.findOne({
            datasetId,
            tag,
          })
          const snapshot = { ...body, created, hexsha }
          redis.set(key, JSON.stringify(snapshot))
          return snapshot
        })
  })
}

/**
 * Get the hexsha for a snapshot from the datasetId and tag
 *
 * Returns null for snapshots which do not exist
 *
 * @param {string} datasetId
 * @param {string} tag
 */
export const getSnapshotHexsha = (datasetId, tag) => {
  return c.crn.snapshots
    .findOne({ datasetId, tag }, { hexsha: true })
    .then(result => (result ? result.hexsha : null))
}

export const updateSnapshotFileUrls = (datasetId, snapshotTag, files) => {
  //insert the file url data into mongo
  return c.crn.files
    .updateOne(
      {
        datasetId: datasetId,
        tag: snapshotTag,
      },
      {
        $set: {
          datasetId: datasetId,
          tag: snapshotTag,
          files: files,
        },
      },
      {
        upsert: true,
      },
    )
    .then(data => {
      // Clear snapshot cache when we get new URLs
      return redis.del(snapshotKey(datasetId, snapshotTag)).then(() => data)
    })
}

/**
 * Get Public Snapshots
 *
 * Returns the most recent snapshots of all publicly available datasets
 */
export const getPublicSnapshots = () => {
  // query all publicly available dataset
  return c.crn.datasets
    .find({ public: true })
    .project({ id: 1 })
    .toArray(datasets => {
      const datasetIds = datasets.map(dataset => dataset.id)
      return c.crn.snapshots.aggregate([
        { $match: { datasetId: { $in: datasetIds } } },
        { $sort: { created: -1 } },
        {
          $group: {
            _id: '$datasetId',
            snapshots: { $push: '$$ROOT' },
          },
        },
        {
          $replaceRoot: {
            newRoot: { $arrayElemAt: ['$snapshots', 0] },
          },
        },
      ])
    })
}
