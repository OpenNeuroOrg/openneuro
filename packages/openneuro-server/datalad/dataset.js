/**
 * Implementation of dataset models internal to OpenNeuro's database
 *
 * See resolvers for interaction with other data sources.
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
    const dsObj = await createDatasetModel(datasetId, label)
    // If successful, create the repo
    const url = `${uri}/datasets/${datasetId}`
    if (dsObj) {
      await request.post(url).set('Accept', 'application/json')
      resolve({ id: datasetId, label })
    } else {
      reject(Error(`Failed to create ${datasetId} - "${label}"`))
    }
  })
}

/**
 * Insert Dataset document
 *
 * Exported for tests.
 */
export const createDatasetModel = (id, label) => {
  const datasetObj = { id, label }
  return c.crn.datasets.insertOne(datasetObj)
}

/**
 * Fetch dataset document and related fields
 */
export const getDataset = id => {
  return c.crn.datasets.findOne({ id })
}

/**
 * Fetch all datasets
 *
 * TODO - Support cursor pagination
 */
export const getDatasets = () => {
  return c.crn.datasets.find().toArray()
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

/**
 * Add files to a dataset
 */
export const addFile = async (datasetId, stream) => {
  const url = `${uri}/datasets/${datasetId}/files/${stream.filename}`
  return request
    .post(url)
    .set('Accept', 'application/json')
    .attach(stream)
}

/**
 * Update an existing file
 */
export const updateFile = async (datasetId, stream) => {
  const url = `${uri}/datasets/${datasetId}/files/${stream.filename}`
  return request
    .put(url)
    .set('Accept', 'application/json')
    .attach(stream)
}
