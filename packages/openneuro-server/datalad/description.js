/**
 * Get description data from backend
 */
import request from 'superagent'
import { objectUrl } from './files.js'
import { getDraftFiles } from './draft.js'
import { getSnapshotHexsha } from './snapshots.js'

/**
 * Find dataset_description.json id and fetch description object
 * @param {string} datasetId
 * @param {array[object]} files
 */
export const getDescriptionObject = datasetId => files => {
  const file = files.find(f => f.filename === 'dataset_description.json')
  try {
    return request.get(objectUrl(datasetId, file.id)).then(({ body }) => body)
  } catch (e) {
    // dataset_description does not exist or is not JSON, return null fields
    return Promise.resolve(null)
  }
}

/**
 * Get a parsed dataset_description.json
 * @param {string} datasetId - dataset or snapshot object
 */
export const description = async (obj, { datasetId, revision, tag }) =>
  getDraftFiles(
    datasetId,
    revision ? revision : await getSnapshotHexsha(datasetId, tag),
  ).then(getDescriptionObject(datasetId))
