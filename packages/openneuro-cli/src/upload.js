import { inspect } from 'util'
import { files } from 'openneuro-client'
import validate from 'bids-validator'
import { getFileTree, generateChanges } from './files'

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
 * Runs validation and exits if an error is encountered
 * @param {string} dir Directory to validate
 * @param {object} validatorOptions Options passed to the validator
 */
export const validation = (dir, validatorOptions) => {
  return validatePromise(dir, validatorOptions).catch(fatalError)
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
 * Sort file streams so that dataset_description.json is first in the list
 *
 * We do this at the top level so that it is uploaded first
 * @param {Array} files
 */
export const sortFiles = files =>
  files.sort((x, y) => {
    return x.path.endsWith('dataset_description.json')
      ? -1
      : y.path.endsWith('dataset_description.json')
        ? 1
        : 0
  })

/**
 * Read and upload a dataset directory
 *
 * @param {Object} client - Initialized Apollo client to upload with
 * @param {string} dir - Directory to upload
 * @param {Object} options - {datasetId: 'ds000001', delete: false, files: [paths, to, exclude]}
 */
export const uploadDirectory = (client, dir, { datasetId, remoteFiles }) => {
  return getFileTree(dir, dir, { remoteFiles }).then(tree => {
    tree = generateChanges(tree)
    tree.files = sortFiles(tree.files)
    return uploadTree(client, datasetId)(tree)
  })
}
