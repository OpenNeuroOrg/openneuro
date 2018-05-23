/**
 * Get snapshots from datalad-service tags
 */
import request from 'superagent'
import { redis } from '../libs/redis.js'
import config from '../config.js'

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
  redis.del(indexKey).then(() =>
    request
      .post(url)
      .set('Accept', 'application/json')
      .then(({ body }) =>
        // Eager caching for snapshots
        // Set the key and after resolve to body
        redis.set(sKey, JSON.stringify(body)).then(() => body),
      ),
  )
}

// TODO - deleteSnapshot
// It should delete the index redis key

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
        .then(({ body: { snapshots } }) => {
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
        .then(({ body }) => {
          redis.set(key, JSON.stringify(body))
          return body
        })
  })
}
