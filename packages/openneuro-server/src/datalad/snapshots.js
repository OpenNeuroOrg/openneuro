/**
 * Get snapshots from datalad-service tags
 */
import * as Sentry from '@sentry/node'
import request from 'superagent'
import { redis, redlock } from '../libs/redis'
import CacheItem, { CacheType } from '../cache/item'
import config from '../config.js'
import pubsub from '../graphql/pubsub.js'
import { updateDatasetName } from '../graphql/resolvers/dataset.js'
import { description } from '../graphql/resolvers/description.js'
import doiLib from '../libs/doi/index.js'
import { getFiles } from './files'
import { generateDataladCookie } from '../libs/authentication/jwt'
import notifications from '../libs/notifications'
import Dataset from '../models/dataset.js'
import Snapshot from '../models/snapshot.js'
import { trackAnalytics } from './analytics.js'
import { updateDatasetRevision } from './draft.js'
import { getDatasetWorker } from '../libs/datalad-service'

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
    Snapshot.find({ datasetId: datasetId, tag: { $in: tags } }).exec(
      (err, metadata) => {
        if (err) reject(err)
        snapshots = snapshots.map(s => {
          const matchMetadata = metadata.find(m => m.tag == s.tag)
          s.created = matchMetadata ? matchMetadata.created : null
          return s
        })
        resolve(snapshots)
      },
    )
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
    const oldDesc = await description({ id: datasetId, revision: 'HEAD' })
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

/**
 * Get a list of all snapshot tags available for a dataset
 *
 * This is equivalent to `git tag` on the repository
 *
 * @param {string} datasetId Dataset accession number
 */
export const getSnapshots = datasetId => {
  const url = `${getDatasetWorker(datasetId)}/datasets/${datasetId}/snapshots`
  const cache = new CacheItem(redis, CacheType.snapshotIndex, [datasetId])
  return cache.get(() =>
    request
      .get(url)
      .set('Accept', 'application/json')
      .then(async ({ body: { snapshots } }) => {
        snapshots = await getSnapshotMetadata(datasetId, snapshots)
        return snapshots
      }),
  )
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
  const indexCache = new CacheItem(redis, CacheType.snapshotIndex, [datasetId])
  const snapshotCache = new CacheItem(redis, CacheType.snapshot, [
    datasetId,
    tag,
  ])

  // lock snapshot id to prevent upload/update conflicts
  const snapshotLock = await lockSnapshot(datasetId, tag)

  try {
    await createIfNotExistsDoi(datasetId, tag, descriptionFieldUpdates)

    const createSnapshotUrl = `${getDatasetWorker(
      datasetId,
    )}/datasets/${datasetId}/snapshots/${tag}`
    const snapshot = await postSnapshot(
      user,
      createSnapshotUrl,
      descriptionFieldUpdates,
      snapshotChanges,
    )
    snapshot.created = new Date()
    snapshot.files = await getFiles(datasetId, tag)

    // Clear the index now that the new snapshot is ready
    indexCache.drop()

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
    indexCache.drop()
    snapshotCache.drop()
    snapshotLock.unlock()
    Sentry.captureException(err)
    return err
  }
}

export const deleteSnapshot = (datasetId, tag) => {
  const url = `${getDatasetWorker(
    datasetId,
  )}/datasets/${datasetId}/snapshots/${tag}`
  return request.del(url).then(async ({ body }) => {
    const indexCache = new CacheItem(redis, CacheType.snapshotIndex, [
      datasetId,
    ])
    const snapshotCache = new CacheItem(redis, CacheType.snapshot, [
      datasetId,
      tag,
    ])
    await indexCache.drop()
    await snapshotCache.drop()
    pubsub.publish('snapshotsUpdated', {
      datasetId,
      snapshotsUpdated: {
        id: datasetId,
        snapshots: await getSnapshots(datasetId),
      },
    })
    return body
  })
}

/**
 * Get the contents of a snapshot (files, git metadata) from datalad-service
 * @param {string} datasetId Dataset accession number
 * @param {string} tag Tag name to retrieve
 */
export const getSnapshot = (datasetId, tag) => {
  const url = `${getDatasetWorker(
    datasetId,
  )}/datasets/${datasetId}/snapshots/${tag}`
  // Track a view for each snapshot query
  trackAnalytics(datasetId, tag, 'views')
  const cache = new CacheItem(redis, CacheType.snapshot, [datasetId, tag])
  return cache.get(() =>
    request
      .get(url)
      .set('Accept', 'application/json')
      .then(async ({ body }) => {
        const { created, hexsha } = await Snapshot.findOne({
          datasetId,
          tag,
        }).exec()
        const snapshot = { ...body, created, hexsha }
        return snapshot
      }),
  )
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
  return Snapshot.findOne({ datasetId, tag }, { hexsha: true })
    .exec()
    .then(result => (result ? result.hexsha : null))
}

/**
 * Get Public Snapshots
 *
 * Returns the most recent snapshots of all publicly available datasets
 */
export const getPublicSnapshots = () => {
  // query all publicly available dataset
  return Dataset.find({ public: true }, 'id')
    .exec()
    .then(datasets => {
      const datasetIds = datasets.map(dataset => dataset.id)
      return Snapshot.aggregate([
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
      ]).exec()
    })
}
