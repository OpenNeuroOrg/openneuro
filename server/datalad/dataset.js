/**
 * Implementation of dataset models
 */
import request from 'superagent'
import config from '../config'
import mongo from '../libs/mongo'
import { getAccessionNumber } from '../libs/dataset'

const c = mongo.collections
const uri = config.datalad.uri

/**
 * Create a new dataset
 *
 * Internally we setup metadata and access
 * then create a new DataLad repo
 *
 * @param {String} label - descriptive label for this dataset
 * @returns {Promise} - resolves to dataset id of the new dataset
 */
export const createDataset = label => {
  return new Promise(async (resolve, reject) => {
    const datasetId = await getAccessionNumber()
    const datasetObj = { id: datasetId, label }
    const dsObj = await c.crn.datasets.insertOne(datasetObj)
    // If successful, create the repo
    const url = `${uri}/datasets/${datasetId}`
    if (dsObj) {
      await request.post(url).set('Accept', 'application/json')
      resolve(datasetId)
    } else {
      reject(Error(`Failed to create ${datasetId} - "${label}"`))
    }
  })
}

/**
 * Snapshot the current working tree for a dataset
 * @param {String} dsId - Dataset ID string
 * @param {String} tag - Snapshot identifier and git tag
 * @returns {Promise} - resolves when tag is created
 */
export const createSnapshot = async (datasetId, tag) => {
  const url = `${uri}/datasets/${datasetId}/snapshot/${tag}`
  return request.post(url).set('Accept', 'application/json')
}
