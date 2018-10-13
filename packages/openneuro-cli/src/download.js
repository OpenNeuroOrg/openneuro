import fs from 'fs'
import path from 'path'
import mkdirp from 'mkdirp'
import request from 'superagent'
import { getToken, getUrl } from './config.js'

export const downloadUrl = (datasetId, tag) =>
  tag
    ? `${getUrl()}crn/datasets/${datasetId}/snapshots/${tag}/download`
    : `${getUrl()}crn/datasets/${datasetId}/download`

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

export const getDownloadMetadata = (datasetId, tag) =>
  request
    .get(downloadUrl(datasetId, tag))
    .set('Cookie', `accessToken=${getToken()}`)

export const downloadFile = async (destination, filename, fileUrl) => {
  const fullPath = path.join(destination, filename)
  // Create any needed parent dirs
  mkdirp.sync(path.dirname(fullPath))
  const writeStream = fs.createWriteStream(fullPath)
  await request
    .get(fileUrl)
    .set('Cookie', `accessToken=${getToken()}`)
    .pipe(writeStream)
}

export const getDownload = (destination, datasetId, tag) =>
  getDownloadMetadata(datasetId, tag).then(async ({ body }) => {
    checkDestination(destination)
    for (let file of body.files) {
      if (testFile(destination, file.filename, file.size)) {
        // Now actually download
        // eslint-disable-next-line no-console
        console.log(`Downloading "${file.filename}" - size ${file.size} bytes`)
        await downloadFile(destination, file.filename, file.urls.pop())
      } else {
        // eslint-disable-next-line no-console
        console.log(`Skipping present file "${file.filename}"`)
      }
    }
  })
