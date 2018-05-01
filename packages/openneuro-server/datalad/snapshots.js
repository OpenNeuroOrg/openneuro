/**
 * Get snapshots from datalad-service tags
 */
import request from 'superagent'
import config from '../config.js'

const uri = config.datalad.uri

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
  return request
    .get(url)
    .set('Accept', 'application/json')
    .then(({ body }) => {
      return body
    })
}
