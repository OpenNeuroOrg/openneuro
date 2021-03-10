import fetch from 'cross-fetch'
import fs from 'fs'
import path from 'path'
import mkdirp from 'mkdirp'
import { getToken, getUrl } from './config.js'

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

const getFetchOptions = () => ({
  headers: {
    cookie: `accessToken=${getToken()}`,
  },
})

const handleFetchReject = err => {
  console.error(
    'Error starting download - please check your connection or try again later',
  )
  console.dir(err)
}

/**
 * Obtain the listing of files to download
 * @param {string} datasetId
 * @param {string} tag
 */
export const getDownloadMetadata = async (datasetId, tag) => {
  try {
    const response = await fetch(
      downloadUrl(getUrl(), datasetId, tag),
      getFetchOptions(),
    )
    if (response.status === 200) {
      const body = await response.json()
      return body
    } else {
      console.error(
        `Error ${response.status} fetching download metadata - ${response.statusText}`,
      )
    }
  } catch (err) {
    handleFetchReject(err)
  }
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
      const response = await fetch(fileUrl, getFetchOptions())
      if (response.status === 200) {
        // Setup end/error handler with Promise interface
        const responsePromise = new Promise((resolve, reject) => {
          response.body.on('end', () => resolve())
          response.body.on('error', err => {
            if (apmTransaction) apmTransaction.captureError(err)
            reject(err)
          })
        })
        // Start piping data
        response.body.pipe(writeStream)
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

export const getDownload = (destination, datasetId, tag, apmTransaction) => {
  const apmSetup = apmTransaction.startSpan('getDownloadMetadata')
  return getDownloadMetadata(datasetId, tag).then(async body => {
    apmTransaction.addLabels({ datasetId, tag })
    checkDestination(destination)
    apmSetup.end()
    for (const file of body.files) {
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
          file.urls.pop(),
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
