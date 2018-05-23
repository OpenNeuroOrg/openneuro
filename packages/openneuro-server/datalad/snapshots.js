/**
 * Get snapshots from datalad-service tags
 */
import request from 'superagent'
import { redis } from '../libs/redis.js'
import config from '../config.js'

const uri = config.datalad.uri

const snapshotKey = (datasetId, tag) => {
  return `openneuro:snapshot:${datasetId}:${tag}`
}

export const getSnapshots = datasetId => {
  const url = `${uri}/datasets/${datasetId}/snapshots`
  return request
    .get(url)
    .set('Accept', 'application/json')
    .then(({ body: { snapshots } }) => {
      return snapshots
    })
}

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
