import { inspect } from 'util'
import { files } from 'openneuro-client'
import validate from 'bids-validator'
import { getFileTree } from './files'

/**
 * BIDS validator promise wrapper
 *
 * @param {string} dir directory to validate
 * @param {Object} options validate.BIDS options
 */
const validatePromise = (dir, options = {}) => {
  return new Promise((resolve, reject) => {
    validate.BIDS(dir, options, ({ errors, warnings }, summary) => {
      if (errors.length + warnings.length === 0) {
        resolve({ summary })
      } else {
        reject({ errors, warnings })
      }
    })
  })
}

const fatalError = err => {
  // eslint-disable-next-line no-console
  console.error(err)
  process.exit(1)
}

/**
 * Validate and upload a dataset
 *
 * @param {Object} client - Initialized Apollo client to upload with
 * @param {string} dir - Directory to upload
 * @param {string} datasetId - Optionally update an existing dataset
 */
export const validateAndUpload = (client, dir) => datasetId => {
  return validatePromise(dir)
    .catch(fatalError)
    .then(() => datasetUpload(client, dir, datasetId))
    .catch(fatalError)
}

/**
 * Make an upload request given an array of streams
 */
export const uploadTree = (client, datasetId) => tree => {
  return client
    .mutate({
      mutation: files.updateFiles,
      variables: { datasetId, files: tree },
    })
    .catch(err => {
      // Since the error response content type does not match the request
      // we need some special error handling any requests with Upload scalars
      if (
        err.hasOwnProperty('networkError') &&
        err.networkError &&
        err.networkError.hasOwnProperty('result')
      ) {
        for (const message of err.networkError.result.errors) {
          // eslint-disable-next-line no-console
          console.error(inspect(message))
        }
        process.exit(1)
      } else {
        throw err
      }
    })
}

/**
 * Read and upload a dataset directory
 *
 * @param {Object} client - Initialized Apollo client to upload with
 * @param {string} dir - Directory to upload
 * @param {string} datasetId - Optionally update an existing dataset
 */
export const datasetUpload = (client, dir, datasetId) => {
  return getFileTree(dir, dir).then(uploadTree(client, datasetId))
}
