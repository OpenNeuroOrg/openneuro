import * as Sentry from "@sentry/react"
import { trackDownload } from "./track-download.js"
import {
  downloadAbortToast,
  downloadCompleteToast,
  downloadToast,
  downloadToastDone,
  downloadToastUpdate,
  nativeErrorToast,
  permissionsToast,
  requestFailureToast,
} from "./native-file-toast.jsx"
import { downloadDataset } from "./download-query"

/**
 * Given a file, create any missing parent directories, obtain directory handle, and return the file handle within that
 * @param {*} initialDirectoryHandle Native file API directoryEntry
 * @param {string} path 'sub-01/anat/subject-image.nii.gz' style paths
 */
export const openFileTree = async (initialDirectoryHandle, path) => {
  let directoryHandle = initialDirectoryHandle
  // Get list of any parent directories
  const pathTokens = path.split("/")
  const dirTokens = pathTokens.slice(0, -1)
  const filename = pathTokens.slice(-1)
  if (dirTokens.length > 0) {
    for (const token of dirTokens) {
      directoryHandle = await directoryHandle.getDirectoryHandle(token, {
        create: true,
      })
    }
  }
  return directoryHandle.getFileHandle(filename, { create: true })
}

class DownloadAbortError extends Error {
  constructor(message) {
    super(message)
    this.name = "DownloadAbortError"
  }
}

let downloadCanceled

/**
 * Recursive download for file trees via browser file access API
 */
const downloadTree = async (
  { datasetId, snapshotTag, client, dirHandle, toastId },
  path = "",
  tree = null,
) => {
  const filesToDownload = await downloadDataset(client)({
    datasetId,
    snapshotTag,
    tree,
  })
  for (const [_index, file] of filesToDownload.entries()) {
    const downloadPath = path ? `${path}/${file.filename}` : file.filename
    if (file.directory) {
      // Next tree level
      await downloadTree(
        {
          datasetId,
          snapshotTag,
          client,
          dirHandle,
          toastId,
        },
        downloadPath,
        file.key,
      )
    } else {
      // Regular file
      if (downloadCanceled) {
        throw new DownloadAbortError("Download canceled by user request")
      }
      const fileHandle = await openFileTree(
        dirHandle,
        path ? `${path}/${file.filename}` : file.filename,
      )
      // Skip files which are already complete
      if (fileHandle.size == file.size) continue
      const writable = await fileHandle.createWritable()
      const { body, status, statusText } = await fetch(file.urls[0])
      let loaded = 0
      const progress = new TransformStream({
        transform(chunk, controller) {
          downloadToastUpdate(toastId, loaded / file.size, {
            datasetId,
            snapshotTag,
            downloadPath,
            dirName: dirHandle.name,
          })
          loaded += chunk.length
          controller.enqueue(chunk)
        },
      })
      if (status === 200) {
        await body.pipeThrough(progress).pipeTo(writable)
      } else {
        Sentry.captureException(statusText)
        return requestFailureToast(file.filename)
      }
    }
  }
}

/**
 * Downloads a dataset via the native file API, skipping expensive compression if the browser supports it
 * @param {string} datasetId Accession number string for a dataset
 * @param {string} snapshotTag Snapshot tag name
 */
export const downloadNative = (datasetId, snapshotTag, client) => async () => {
  // Try trackDownload but don't worry if it fails
  try {
    trackDownload(client, datasetId, snapshotTag)
  } catch (err) {
    Sentry.captureException(err)
  }
  const scope = new Sentry.Scope()
  scope.setContext("dataset", { datasetId, snapshot: snapshotTag })
  downloadCanceled = false
  let toastId
  try {
    // Open user selected directory
    const dirHandle = await window.showDirectoryPicker()
    toastId = downloadToast(
      dirHandle.name,
      datasetId,
      snapshotTag,
      () => (downloadCanceled = true),
    )
    await downloadTree({
      datasetId,
      snapshotTag,
      client,
      dirHandle,
      toastId,
    })
    downloadCompleteToast(dirHandle.name)
  } catch (err) {
    if (err.name === "AbortError") {
      return
    } else if (err.name === "DownloadAbortError") {
      downloadAbortToast()
    } else if (err.name === "NotAllowedError") {
      permissionsToast()
    } else {
      // Some unknown issue occurred (out of disk space, disk caught fire, etc...)
      nativeErrorToast()
    }
    Sentry.captureException(err)
  } finally {
    downloadToastDone(toastId)
    Sentry.getCurrentScope().clear()
  }
}
