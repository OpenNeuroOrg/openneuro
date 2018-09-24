/**
 * Get description data from backend
 */
import request from 'superagent'
import { objectUrl } from './files.js'
import { getDraftFiles } from './draft.js'
import { getSnapshotHexsha } from './snapshots.js'

export const defaultDescription = {
  Name: 'Unnamed Dataset',
  BIDSVersion: '1.1.1',
}

/**
 * Find dataset_description.json id and fetch description object
 * @param {string} datasetId
 * @returns {(files: [Object]) => Promise} Promise resolving to dataset_description.json contents or defaults
 */
export const getDescriptionObject = datasetId => files => {
  const file = files.find(f => f.filename === 'dataset_description.json')
  if (file) {
    return request
      .get(objectUrl(datasetId, file.id))
      .then(({ body, type }) => {
        // Guard against non-JSON responses
        if (type === 'application/json') return body
        else throw new Error('dataset_description.json is not JSON')
      })
      .catch(() => {
        // dataset_description does not exist or is not JSON, return default fields
        return defaultDescription
      })
  } else {
    return Promise.resolve(defaultDescription)
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
