/**
 * Manage serving a Draft object based on DataLad working trees
 */
import request from 'superagent'
import mongo from '../libs/mongo.js'
import config from '../config.js'

const uri = config.datalad.uri

export const getDraftFiles = datasetId => {
  const filesUrl = `${uri}/datasets/${datasetId}/files`
  return request
    .get(filesUrl)
    .set('Accept', 'application/json')
    .then(({ body: { files } }) => files)
}

export const updateDatasetRevision = datasetId => gitRef => {
  /**
   * Update the revision pointer in a draft on changes
   */
  return mongo.collections.crn.datasets.update(
    { id: datasetId },
    { $set: { revision: gitRef } },
  )
}
