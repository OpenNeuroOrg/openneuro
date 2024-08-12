import cliProgress from "cli-progress"
import path from "path"
import inquirer from "inquirer"
import { promises as fs } from "fs"
import { createReadStream } from "fs"
import { uploads } from "@openneuro/client"
import validate from "bids-validator"
import { bytesToSize, getFiles } from "./files"
import { getUrl } from "./config"
import { AbortController, fetch, Request } from "fetch-h2"

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
        reject(validate.consoleFormat.issues({ errors, warnings }))
      }
    })
  })
}

const fatalError = (err) => {
  // eslint-disable-next-line no-console
  console.error(err)
  process.exit(1)
}

/**
 * Runs validation, logs summary or exits if an error is encountered
 * @param {string} dir Directory to validate
 * @param {object} validatorOptions Options passed to the validator
 */
export const validation = (dir, validatorOptions) => {
  return validatePromise(dir, validatorOptions)
    .then(function ({ summary }) {
      // eslint-disable-next-line no-console
      console.log(validate.consoleFormat.summary(summary))
    })
    .catch((err) => fatalError(err))
}

/**
 * Calculate the diff and prepare an upload
 *
 * @param {Object} client - Initialized Apollo client to call prepareUpload and finishUpload
 * @param {string} dir - Directory to upload
 * @param {Object} options Query parameters for prepareUpload mutation
 * @param {string} options.datasetId Accession number
 * @param {Array<object>} options.remoteFiles An array of files available in HEAD, matching files are skipped
 * @returns {Promise<Object|void>} prepareUpload mutation fields {id, token, files}
 */
export const prepareUpload = async (
  client,
  dir,
  { datasetId, remoteFiles },
) => {
  const files = []
  for await (const f of getFiles(dir)) {
    const rel = path.relative(dir, f)
    const remote = remoteFiles.find((remote) => remote.filename === rel)
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
    "=======================================================================",
  )
  if (files.length < 12) {
    console.log("Files to be uploaded:")
    for (const f of files) {
      console.log(`${f.filename} - ${bytesToSize(f.size)}`)
    }
  } else {
    const totalSize = uploads.uploadSize(files)
    console.log(
      `${files.length} files to be uploaded with a total size of ${
        bytesToSize(
          totalSize,
        )
      }`,
    )
  }
  const answer = await inquirer.prompt({
    type: "confirm",
    name: "start",
    message: "Begin upload?",
    default: true,
  })
  if (answer.start) {
    console.log(
      "=======================================================================",
    )
    // Filter out local paths in mutation
    const mutationFiles = files.map((f) => ({
      filename: f.filename,
      size: f.size,
    }))
    const { data } = await client.mutate({
      mutation: uploads.prepareUpload,
      variables: {
        datasetId,
        uploadId: uploads.hashFileList(datasetId, mutationFiles),
      },
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
}

export const uploadFiles = async ({
  id,
  datasetId,
  token,
  files,
  endpoint,
}) => {
  const uploadProgress = new cliProgress.SingleBar({
    format: datasetId +
      " [{bar}] {percentage}% | ETA: {eta}s | {value}/{total}",
    clearOnComplete: false,
    hideCursor: true,
    etaBuffer: Math.round(files.length / 10) + 1, // More stable values for many small files
  })
  uploadProgress.start(files.length, 0, {
    speed: "N/A",
  })
  const rootUrl = getUrl()
  const controller = new AbortController()
  // Limit open file handles for streams to avoid consuming extra file handles
  const MAX_STREAM_HANDLES = 512
  for (let n = 0; n < files.length; n += MAX_STREAM_HANDLES) {
    const filesChunk = files.slice(n, n + MAX_STREAM_HANDLES)
    const requests = filesChunk.map((file) => {
      // http://localhost:9876/uploads/0/ds001024/0de963b9-1a2a-4bcc-af3c-fef0345780b0/dataset_description.json
      const encodedFilePath = uploads.encodeFilePath(file.filename)
      const fileStream = createReadStream(file.path)
      fileStream.on("error", (err) => {
        console.error(err)
        fileStream.close()
        controller.abort()
      })
      fileStream.on("close", () => {
        if (fileStream.bytesRead === 0) {
          uploadProgress.stop()
          console.error(
            `Warning: "${file.filename}" read zero bytes - check that this file is readable and try again`,
          )
          controller.abort()
        }
      })
      const requestOptions = {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: fileStream,
        signal: controller.signal,
      }
      return new Request(
        `${rootUrl}uploads/${endpoint}/${datasetId}/${id}/${encodedFilePath}`,
        // @ts-ignore Node 18+ actually supports this despite types not advertising it
        requestOptions,
      )
    })
    try {
      await uploads.uploadParallel(
        requests,
        uploads.uploadSize(filesChunk),
        uploadProgress,
        fetch,
      )
    } catch (err) {
      console.error(
        "\nNot all files could be opened for upload, check file access and permissions and try again.",
      )
      console.error(err)
    }
  }
  uploadProgress.stop()
}

export const finishUpload = (client, uploadId) => {
  return client.mutate({
    mutation: uploads.finishUpload,
    variables: { uploadId: uploadId },
  })
}
