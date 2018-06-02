/**
 * Manage serving a Draft object based on DataLad working trees
 */
import request from 'superagent'
import mongo from '../libs/mongo.js'
import { redis } from '../libs/redis.js'
import config from '../config.js'

const uri = config.datalad.uri

const draftFilesKey = (datasetId, revision) => {
  return `openneuro:draftFiles:${datasetId}:${revision}`
}

export const getDraftFiles = (datasetId, revision) => {
  const filesUrl = `${uri}/datasets/${datasetId}/files`
  const key = draftFilesKey(datasetId, revision)
  return redis.get(key).then(data => {
    if (data) return JSON.parse(data)
    else
      return request
        .get(filesUrl)
        .set('Accept', 'application/json')
        .then(({ body: { files } }) => {
          redis.set(key, JSON.stringify(files))
          return files
        })
  })
}

export const updateDatasetRevision = datasetId => gitRef => {
  /**
   * Update the revision pointer in a draft on changes
   */
  return mongo.collections.crn.datasets.update(
    { id: datasetId },
    { $set: { revision: gitRef, modified: new Date() } },
  )

export const getPartialStatus = datasetId => {
  const partialUrl = `${uri}/datasets/${datasetId}/draft`
  return request
    .get(partialUrl)
    .set('Accept', 'application/json')
    .then(({ body: { partial } }) => partial)
}

