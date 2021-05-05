import 'cross-fetch/polyfill'
import fs from 'fs'
import path from 'path'
import mkdirp from 'mkdirp'
import { getToken, getUrl } from './config.js'
import { downloadDataset } from './datasets'

export const downloadUrl = (baseUrl, datasetId, tag) =>
  tag
    ? `${baseUrl}crn/datasets/${datasetId}/snapshots/${tag}/download`
    : `${baseUrl}crn/datasets/${datasetId}/download`

export const checkDestination = destination => {
  if (fs.existsSync(destination)) {
    // Exists, check if directory
    if (!fs.lstatSync(destination).isDirectory()) {
      throw new Error(`Target file "${destination}" must be a directory`)
    }
  } else {
    // Doesn't exist, make directory
    fs.mkdirSync(destination)
  }
}

/**
 * Test if a file exists and matches correct size
 * @param {string} destination
 * @param {string} filename
 * @param {number} size
 */
export const testFile = (destination, filename, size) => {
  const fullPath = path.join(destination, filename)
  if (fs.existsSync(fullPath)) {
    return fs.lstatSync(fullPath).size !== size
  } else {
    return true
  }
}

const getFetchHeaders = () => ({
  cookie: `accessToken=${getToken()}`,
})

const handleFetchReject = err => {
  console.error(
    'Error starting download - please check your connection or try again later',
  )
  console.dir(err)
}

/**
 * Download one file from a remote URL
 * @param {string} destination Destination directory path
 * @param {string} filename
 * @param {string} fileUrl URL to download from
 * @param {object} apmTransaction Active APM transaction (optional)
 */
export const downloadFile = async (
  destination,
  filename,
  fileUrl,
  apmTransaction,
) => {
  try {
    const fullPath = path.join(destination, filename)
    // Create any needed parent dirs
    mkdirp.sync(path.dirname(fullPath))
    const writeStream = fs.createWriteStream(fullPath)
    try {
      const response = await fetch(fileUrl, {
        headers: getFetchHeaders(),
      })
      /** @ts-expect-error @type {import('stream').Readable} */
      const stream = response.body
      if (response.status === 200) {
        // Setup end/error handler with Promise interface
        const responsePromise = new Promise((resolve, reject) => {
          stream.on('end', () => resolve())
          stream.on('error', err => {
            if (apmTransaction) apmTransaction.captureError(err)
            reject(err)
          })
        })
        // Start piping data
        stream.pipe(writeStream)
        return responsePromise
      } else {
        console.error(
          `Error ${response.status} fetching "${filename}" - ${response.statusText}`,
        )
      }
    } catch (err) {
      handleFetchReject(err)
    }
  } catch (err) {
    if (apmTransaction) apmTransaction.captureError(err)
    throw err
  }
}

export const getDownload = (
  destination,
  datasetId,
  tag,
  apmTransaction,
  client,
) => {
  const apmSetup = apmTransaction.startSpan('downloadDataset')
  return downloadDataset(client)({ datasetId, tag }).then(async files => {
    apmTransaction.addLabels({ datasetId, tag })
    checkDestination(destination)
    apmSetup.end()
    for (const file of files) {
      if (testFile(destination, file.filename, file.size)) {
        // Now actually download
        const apmDownload = apmTransaction.startSpan(
          `download ${file.filename}:${file.size}`,
        )
        // eslint-disable-next-line no-console
        console.log(`Downloading "${file.filename}" - size ${file.size} bytes`)
        await downloadFile(
          destination,
          file.filename,
          file.urls[file.urls.length - 1],
          apmTransaction,
        )
        if (apmDownload) apmDownload.end()
      } else {
        // eslint-disable-next-line no-console
        console.log(`Skipping present file "${file.filename}"`)
      }
    }
  })
}
