/**
 * Manage serving a Draft object based on DataLad working trees
 */
import request from 'superagent'
import config from '../config.js'

const uri = config.datalad.uri

export const getDraftFiles = datasetId => {
  const filesUrl = `${uri}/datasets/${datasetId}/files`
  return request
    .get(filesUrl)
    .set('Accept', 'application/json')
    .then(({ body: { files } }) => files)
}
