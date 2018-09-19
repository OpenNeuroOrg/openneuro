/**
 * Get description data from backend
 */
import request from 'superagent'
import { objectUrl } from './files.js'
import { getDraftFiles } from './draft.js'

/**
 * Get a parsed dataset_description.json
 * @param {string} datasetId - dataset or snapshot object
 */
export const description = (obj, { datasetId, revision }) =>
  getDraftFiles(datasetId, revision).then(files => {
    const gitObjectId = files.find(
      f => f.filename === 'dataset_description.json',
    ).id
    return request
      .get(objectUrl(datasetId, gitObjectId))
      .then(({ body }) => body)
  })
