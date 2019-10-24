import { trackDownload } from './track-download.js'
import { downloadUri } from './download-uri.js'

/**
 * Downloads a dataset via the native file API, skipping expensive compression if the browser supports it
 * @param {string} datasetId Accession number string for a dataset
 * @param {string} snapshotTag Snapshot tag name
 */
export const downloadNative = (datasetId, snapshotTag) => async () => {
  const uri = downloadUri(datasetId, snapshotTag)
  const filesToDownload = await (await fetch(uri)).json()
  trackDownload(datasetId, snapshotTag)
  // Obtain primary URL for each file
  const dirHandle = await window.chooseFileSystemEntries({
    type: 'openDirectory',
  })
  for (const file of filesToDownload.files) {
    let dirLevel = dirHandle
    // Get list of any parent directories
    const pathTokens = file.filename.split('/')
    const dirTokens = pathTokens.slice(0, -1)
    const filename = pathTokens.slice(-1)
    if (dirTokens.length > 0) {
      for (const token of dirTokens) {
        dirLevel = await dirLevel.getDirectory(token, { create: true })
      }
    }
    const fileHandle = await dirLevel.getFile(filename, { create: true })
    // Skip files which are already complete
    if (fileHandle.size == file.size) continue
    const writer = await fileHandle.createWriter()
    const ff = await fetch(file.urls.pop())
    await writer.write(0, await ff.blob())
    await writer.close()
  }
}
