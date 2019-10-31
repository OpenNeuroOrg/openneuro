import * as Sentry from '@sentry/browser'
import { trackDownload } from './track-download.js'
import {
  nativeErrorToast,
  permissionsToast,
  downloadCompleteToast,
} from './native-file-toast.jsx'
import { downloadUri } from './download-uri.js'

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
      directoryHandle = await directoryHandle.getDirectory(token, {
        create: true,
      })
    }
  }
  return directoryHandle.getFile(filename, { create: true })
}

/**
 * Downloads a dataset via the native file API, skipping expensive compression if the browser supports it
 * @param {string} datasetId Accession number string for a dataset
 * @param {string} snapshotTag Snapshot tag name
 */
export const downloadNative = (datasetId, snapshotTag) => async () => {
  const uri = downloadUri(datasetId, snapshotTag)
  const filesToDownload = await (await fetch(uri + '?skip-bundle')).json()
  // Try trackDownload but don't worry if it fails
  try {
    trackDownload(datasetId, snapshotTag)
  } catch (err) {
    Sentry.captureException(err)
  }
  try {
    // Open user selected directory
    const dirHandle = await window.chooseFileSystemEntries({
      type: 'openDirectory',
    })
    for (const file of filesToDownload.files) {
      const fileHandle = await openFileTree(dirHandle, file.filename)
      // Skip files which are already complete
      if (fileHandle.size == file.size) continue
      const writer = await fileHandle.createWriter()
      const ff = await fetch(file.urls.pop())
      await writer.write(0, ff.arrayBuffer())
      await writer.close()
    }
    downloadCompleteToast(dirHandle.name)
  } catch (err) {
    if (err.name === 'NoModificationAllowedError') {
      permissionsToast()
    } else {
      // Some unknown issue occurred (out of disk space, disk caught fire, etc...)
      nativeErrorToast()
    }
    Sentry.captureException(err)
  }
}
