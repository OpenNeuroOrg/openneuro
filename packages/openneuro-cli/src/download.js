import fs from "fs"
import path from "path"
import mkdirp from "mkdirp"
import cliProgress from "cli-progress"
import { getToken } from "./config.js"
import { downloadDataset } from "./datasets"
import fetch from "node-fetch"
import nodeFetch, { Request, Response } from "node-fetch"

Object.assign(global, { fetch: nodeFetch, Request, Response })

export const checkDestination = (destination) => {
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

const handleFetchReject = (err) => {
  console.error(
    "Error starting download - please check your connection or try again later",
  )
  console.dir(err)
}

/**
 * Download one file from a remote URL
 * @param {string} destination Destination directory path
 * @param {string} filename
 * @param {string} fileUrl URL to download from
 */
export const downloadFile = async (
  destination,
  filename,
  fileUrl,
  downloadProgress,
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
      const stream = response.body
      if (response.status === 200) {
        // Setup end/error handler with Promise interface
        const responsePromise = new Promise((resolve, reject) => {
          stream.on("end", () => resolve())
          stream.on("data", () => {
            downloadProgress.update(writeStream.bytesWritten)
          })
          stream.on("error", (err) => {
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
    throw err
  }
}

export const getDownload = async (
  destination,
  datasetId,
  tag,
  client,
  treePath = "",
  tree = null,
) => {
  const files = await downloadDataset(client)({ datasetId, tag, tree })
  checkDestination(destination)
  for (const file of files) {
    const downloadPath = path.join(treePath, file.filename)
    if (file.directory) {
      await getDownload(
        destination,
        datasetId,
        tag,
        client,
        downloadPath,
        file.id,
      )
    } else {
      const downloadProgress = new cliProgress.SingleBar({
        format: " [{bar}] {percentage}% | ETA: {eta}s | {value}/{total} | " +
          downloadPath,
        clearOnComplete: false,
        hideCursor: true,
        position: "center",
        etaBuffer: 65536,
        autopadding: true,
      })
      if (testFile(destination, downloadPath, file.size)) {
        // Now actually download
        downloadProgress.start(file.size, 0)
        try {
          await downloadFile(
            destination,
            downloadPath,
            file.urls[file.urls.length - 1],
            downloadProgress,
          )
          downloadProgress.update(file.size)
        } catch (err) {
          console.error(err)
        } finally {
          downloadProgress.stop()
        }
      } else {
        downloadProgress.start(file.size, file.size)
        downloadProgress.stop()
      }
    }
  }
}
