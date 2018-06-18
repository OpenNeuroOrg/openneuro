/**
 * Get snapshots from datalad-service tags
 */
import request from 'superagent'
import mongo from '../libs/mongo'
import { redis } from '../libs/redis.js'
import config from '../config.js'
import { addFileUrl } from './utils.js'

const c = mongo.collections
const uri = config.datalad.uri

/**
 * Index of snapshots
 *
 * This should get cleared when snapshots are added or removed
 * @param {string} datasetId
 */
const snapshotIndexKey = datasetId => {
  return `openneuro:snapshot-index:${datasetId}`
}

const createSnapshotMetadata = (datasetId, tag, hexsha, created) => {
  return c.crn.snapshots.update(
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
  let tags = snapshots.map(s => s.tag)
  return new Promise((resolve, reject) => {
    c.crn.snapshots
      .find({ datasetId: datasetId, tag: { $in: tags } })
      .toArray((err, metadata) => {
        if (err) reject(err)
        snapshots = snapshots.map(s => {
          const match_metadata = metadata.find(m => m.tag == s.tag)
          s.created = match_metadata ? match_metadata.created : null
          return s
        })
        resolve(snapshots)
      })
  })
}

/**
 * Snapshot the current working tree for a dataset
 * @param {String} datasetId - Dataset ID string
 * @param {String} tag - Snapshot identifier and git tag
 * @returns {Promise} - resolves when tag is created
 */
export const createSnapshot = async (datasetId, tag) => {
  const url = `${uri}/datasets/${datasetId}/snapshots/${tag}`
  const indexKey = snapshotIndexKey(datasetId)
  const sKey = snapshotKey(datasetId, tag)
  // Only create after the key is deleted to prevent race condition
  return redis.del(indexKey).then(() =>
    request
      .post(url)
      .set('Accept', 'application/json')
      .then(({ body }) => {
        body.created = new Date()
        // Eager caching for snapshots
        // Set the key and after resolve to body
        return (
          redis
            .set(sKey, JSON.stringify(body))
            // Metadata for snapshots
            .then(() =>
              createSnapshotMetadata(
                datasetId,
                tag,
                body.hexsha,
                body.created,
              ).then(() => body),
            )
        )
      }),
  )
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
      .then(() => body),
  )
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
 * Get the contents of a snapshot (files, git metadata) from datalad-service
 * @param {string} datasetId Dataset accession number
 * @param {string} tag Tag name to retrieve
 */
export const getSnapshot = (datasetId, tag) => {
  const url = `${uri}/datasets/${datasetId}/snapshots/${tag}`
  const key = snapshotKey(datasetId, tag)
  return redis.get(key).then(data => {
    if (data) return JSON.parse(data)
    else
      return request
        .get(url)
        .set('Accept', 'application/json')
        .then(async ({ body }) => {
          // Only add S3 URLs for public datasets
          const dataset = await c.crn.datasets.findOne(
            { id: datasetId },
            { public: true },
          )
          let externalFiles
          if (dataset.public) {
            externalFiles = await c.crn.files
              .findOne({ datasetId, tag }, { files: true })
              .then(result => result.files)
          }
          // If not public, fallback URLs are used
          const filesWithUrls = body.files.map(
            addFileUrl(datasetId, tag, externalFiles),
          )
          const snapshot = { ...body, files: filesWithUrls }
          redis.set(key, JSON.stringify(snapshot))
          return snapshot
        })
  })
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
