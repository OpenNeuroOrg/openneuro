import cliProgress from 'cli-progress'
import path from 'path'
import fetch from 'node-fetch'
import inquirer from 'inquirer'
import { AbortController } from 'abort-controller'
import { createReadStream, promises as fs } from 'fs'
import { inspect } from 'util'
import { files, uploads } from 'openneuro-client'
import validate from 'bids-validator'
import { getFiles, bytesToSize } from './files'
import { getUrl } from './config'
import consoleFormat from 'bids-validator/utils/consoleFormat'

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
        reject(consoleFormat.issues({ errors, warnings }))
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
 * Given a file list, calculate total size
 */
export const uploadSize = files =>
  files.map(f => f.size).reduce((a, b) => a + b)

/**
 * Runs validation, logs summary or exits if an error is encountered
 * @param {string} dir Directory to validate
 * @param {object} validatorOptions Options passed to the validator
 */
export const validation = (dir, validatorOptions) => {
  return validatePromise(dir, validatorOptions)
    .then(function({ summary }) {
      // eslint-disable-next-line no-console
      console.log(consoleFormat.summary(summary))
    })
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
 * Calculate the diff and prepare an upload
 *
 * @param {Object} client - Initialized Apollo client to call prepareUpload and finishUpload
 * @param {string} dir - Directory to upload
 * @param {Object} options Query parameters for prepareUpload mutation
 * @param {string} options.datasetId Accession number
 * @param {Array<object>} options.remoteFiles An array of files available in HEAD, matching files are skipped
 * @returns {Promise<Object>} prepareUpload mutation fields {id, token, files}
 */
export const prepareUpload = async (
  client,
  dir,
  { datasetId, remoteFiles },
) => {
  const files = []
  for await (const f of getFiles(dir)) {
    const rel = path.relative(dir, f)
    const remote = remoteFiles.find(remote => remote.filename === rel)
    const { size } = await fs.stat(f)
    if (remote) {
      if (remote.size !== size) {
        files.push({ filename: rel, path: f, size })
      }
    } else {
      files.push({ filename: rel, path: f, size })
    }
  }
  console.log(
    '=======================================================================',
  )
  if (files.length < 12) {
    console.log('Files to be uploaded:')
    for (const f of files) {
      console.log(`${f.filename} - ${bytesToSize(f.size)}`)
    }
  } else {
    const totalSize = uploadSize(files)
    console.log(
      `${files.length} files to be uploaded with a total size of ${bytesToSize(
        totalSize,
      )}`,
    )
  }
  await inquirer.prompt({
    type: 'confirm',
    name: 'start',
    message: 'Begin upload?',
    default: true,
  })
  console.log(
    '=======================================================================',
  )
  // Filter out local paths in mutation
  const mutationFiles = files.map(f => ({ filename: f.filename, size: f.size }))
  const { data } = await client.mutate({
    mutation: uploads.prepareUpload,
    variables: { datasetId, files: mutationFiles },
  })
  const id = data.prepareUpload.id
  // eslint-disable-next-line no-console
  console.log(`Starting a new upload (${id}) to dataset: '${datasetId}'`)
  return {
    id,
    datasetId: data.prepareUpload.datasetId,
    token: data.prepareUpload.token,
    files,
    endpoint: data.prepareUpload.endpoint,
  }
}

/**
 * Determine parallelism based on file list
 * @param {Array<object>} files
 * @returns {number}
 */
export function uploadParallelism(files) {
  const bytes = uploadSize(files)
  const averageSize = bytes / files.length
  const parallelism = averageSize / 524288 // 512KB
  if (parallelism > 16) {
    return 16
  } else if (parallelism < 2) {
    return 2
  } else {
    return Math.round(parallelism)
  }
}

/**
 * Repeatable function for single file upload fetch request
 */
const uploadFile = ({
  id,
  endpoint,
  datasetId,
  token,
  rootUrl,
  uploadProgress,
}) => (f, attempt = 1) => {
  // http://localhost:9876/uploads/0/ds001024/0de963b9-1a2a-4bcc-af3c-fef0345780b0/dataset_description.json
  const encodedFilePath = uploads.encodeFilePath(f.filename)
  const fileUrl = `${rootUrl}uploads/${endpoint}/${datasetId}/${id}/${encodedFilePath}`
  const fileStream = createReadStream(f.path)
  // This is needed to cancel the request in case of client errors
  const controller = new AbortController()
  fileStream.on('error', err => {
    console.error(err)
    controller.abort()
  })
  return fetch(fileUrl, {
    method: 'POST',
    headers: {
      cookie: `accessToken=${token}`,
    },
    body: fileStream,
    signal: controller.signal,
  }).then(response => {
    if (response.status === 200) {
      uploadProgress.increment()
    } else {
      if (attempt > 3) {
        console.error(response)
        throw new Error(
          `Failed to upload file after ${attempt} attempts - "${f.filename}"`,
        )
      } else {
        // Retry if up to attempts times
        return uploadFile({
          id,
          endpoint,
          datasetId,
          token,
          rootUrl,
          uploadProgress,
        })(f, attempt + 1)
      }
    }
  })
}

export const uploadFiles = async ({
  id,
  datasetId,
  token,
  files,
  endpoint,
}) => {
  const uploadProgress = new cliProgress.SingleBar({
    format:
      datasetId + ' [{bar}] {percentage}% | ETA: {eta}s | {value}/{total}',
    clearOnComplete: false,
    hideCursor: true,
    etaBuffer: Math.round(files.length / 10), // More stable values for many small files
  })
  uploadProgress.start(files.length, 0, {
    speed: 'N/A',
  })
  const uploader = uploadFile({
    id,
    datasetId,
    token,
    endpoint,
    rootUrl: getUrl(),
    uploadProgress,
  })
  // Array stride of parallel requests
  const parallelism = uploadParallelism(files)
  for (let fIndex = 0; fIndex < files.length; fIndex = fIndex + parallelism) {
    await Promise.allSettled(
      files.slice(fIndex, fIndex + parallelism).map(uploader),
    )
  }
  uploadProgress.stop()
}

export const finishUpload = (client, uploadId) => {
  return client.mutate({
    mutation: uploads.finishUpload,
    variables: { uploadId: uploadId },
  })
}
