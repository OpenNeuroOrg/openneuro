/**
 * Implementation of dataset models internal to OpenNeuro's database
 *
 * See resolvers for interaction with other data sources.
 */
import request from 'superagent'
import requestNode from 'request'
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
 * @param {String} datasetId - Dataset ID string
 * @param {String} tag - Snapshot identifier and git tag
 * @returns {Promise} - resolves when tag is created
 */
export const createSnapshot = async (datasetId, tag) => {
  const url = `${uri}/datasets/${datasetId}/snapshot/${tag}`
  return request.post(url).set('Accept', 'application/json')
}

/**
 * Convert to URL compatible path
 * @param {String} path
 */
const encodeFilePath = path => {
  return path.replace(new RegExp('/', 'g'), ':')
}

/**
 * Generate file URL for DataLad service
 * @param {String} datasetId
 * @param {String} path - Relative path for the file
 * @param {String} filename
 */
const fileUrl = (datasetId, path, filename) => {
  // If path is provided, this is a subdirectory, otherwise a root level file.
  const filePath = path ? [path, filename].join('/') : filename
  const fileName = encodeFilePath(filePath)
  const url = `http://${uri}/datasets/${datasetId}/files/${fileName}`
  return url
}

/**
 * Add files to a dataset
 */
export const addFile = async (datasetId, path, { filename, stream }) => {
  // Cannot use superagent 'request' due to inability to post streams
  return stream.pipe(requestNode.post(fileUrl(datasetId, path, filename)))
}

/**
 * Update an existing file
 */
export const updateFile = async (datasetId, path, { filename, stream }) => {
  // Cannot use superagent 'request' due to inability to post streams
  return stream.pipe(requestNode.put(fileUrl(datasetId, path, filename)))
}
