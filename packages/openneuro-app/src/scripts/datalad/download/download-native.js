import * as Sentry from '@sentry/browser'
import { trackDownload } from './track-download.js'
import {
  downloadToast,
  downloadToastUpdate,
  downloadToastDone,
  downloadAbortToast,
  nativeErrorToast,
  permissionsToast,
  downloadCompleteToast,
  requestFailureToast,
} from './native-file-toast.jsx'
import { apm } from '../../apm.js'
import { downloadDataset } from './download-query'

/**
 * Given a file, create any missing parent directories, obtain directory handle, and return the file handle within that
 * @param {*} initialDirectoryHandle Native file API directoryEntry
 * @param {string} path 'sub-01/anat/subject-image.nii.gz' style paths
 */
export const openFileTree = async (initialDirectoryHandle, path) => {
  let directoryHandle = initialDirectoryHandle
  // Get list of any parent directories
  const pathTokens = path.split('/')
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
    this.name = 'DownloadAbortError'
  }
}

/**
 * Downloads a dataset via the native file API, skipping expensive compression if the browser supports it
 * @param {string} datasetId Accession number string for a dataset
 * @param {string} snapshotTag Snapshot tag name
 */
export const downloadNative = (datasetId, snapshotTag, client) => async () => {
  const filesToDownload = await downloadDataset(client)({
    datasetId,
    snapshotTag,
  })

  // Try trackDownload but don't worry if it fails
  try {
    trackDownload(datasetId, snapshotTag)
  } catch (err) {
    Sentry.captureException(err)
  }
  const apmTransaction = apm.startTransaction(
    `download:${datasetId}`,
    'download',
  )
  if (apmTransaction)
    apmTransaction.addLabels({ datasetId, snapshot: snapshotTag })
  let downloadCanceled = false
  let toastId
  try {
    const apmSelect =
      apmTransaction && apmTransaction.startSpan('showDirectoryPicker')
    // Open user selected directory
    const dirHandle = await window.showDirectoryPicker()
    toastId = downloadToast(
      dirHandle.name,
      datasetId,
      snapshotTag,
      () => (downloadCanceled = true),
    )
    apmSelect && apmSelect.end()
    for (const [index, file] of filesToDownload.entries()) {
      const apmDownload =
        apmTransaction &&
        apmTransaction.startSpan(`download ${file.filename}:${file.size}`)
      if (downloadCanceled) {
        throw new DownloadAbortError('Download canceled by user request')
      }
      const fileHandle = await openFileTree(dirHandle, file.filename)
      // Skip files which are already complete
      if (fileHandle.size == file.size) continue
      const writable = await fileHandle.createWritable()
      const { body, status, statusText } = await fetch(file.urls.pop())
      if (status === 200) {
        await body.pipeTo(writable)
      } else {
        apmDownload && apmDownload.captureError(statusText)
        return requestFailureToast()
      }
      apmDownload && apmDownload.end()
      downloadToastUpdate(toastId, index / filesToDownload.length)
    }
    downloadCompleteToast(dirHandle.name)
  } catch (err) {
    if (err.name === 'AbortError') {
      return
    } else if (err.name === 'DownloadAbortError') {
      downloadAbortToast()
    } else if (err.name === 'NotAllowedError') {
      permissionsToast()
    } else {
      // Some unknown issue occurred (out of disk space, disk caught fire, etc...)
      nativeErrorToast()
    }
    Sentry.captureException(err)
  } finally {
    if (apmTransaction) apmTransaction.end()
    downloadToastDone(toastId)
  }
}
