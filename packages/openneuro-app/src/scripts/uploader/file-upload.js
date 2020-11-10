import config from '../../../config'
import { uploads } from 'openneuro-client'

/**
 * Trim the webkitRelativePath value to only include the dataset relative path
 * @param {File} file FileAPI object from a browser multiple file selector
 */
export const getRelativePath = file => {
  const path = file.webkitRelativePath
  const dirIndex = path.indexOf('/')
  if (dirIndex === -1) {
    return path
  } else {
    return path.substring(dirIndex + 1, path.length)
  }
}

/**
 * Handle all variants of File objects and return the encoded upload file path
 *
 * Top level files have webkitRelativePath '' in some scenarios, use just the filename in that case
 *
 * @param {File} file
 * @param {object} options
 * @param {boolean} options.stripRelativePath
 **/
export const encodeFilePath = (file, options = { stripRelativePath: false }) =>
  file.webkitRelativePath
    ? uploads.encodeFilePath(
        options.stripRelativePath
          ? getRelativePath(file)
          : file.webkitRelativePath,
      )
    : file.name

/**
 * This provides a similar interface to Apollo mutation for a background fetch with a promise that resolves once all promises have settled
 * @param {object} options
 * @param {string} options.uploadId Upload identifier for resume
 * @param {string} options.datasetId Accession number
 * @param {number} options.endpoint Offset for upload endpoint
 * @param {Array<object>} options.filesToUpload Array of file objects
 * @param {string} options.token Credentials
 * @param {UploadProgress} options.uploadProgress Controller for reporting upload progress
 * @param {AbortController} options.abortController Fetch AbortController for halting uploads
 * @param {boolean} options.stripRelativePath True will remove the top-most directory name
 */
export async function uploadFiles({
  uploadId,
  datasetId,
  endpoint,
  filesToUpload,
  token,
  uploadProgress,
  abortController,
  stripRelativePath = true,
}) {
  // Maps FileAPI objects to Request with the correct URL and body
  let totalSize = 0
  const requests = filesToUpload.map(f => {
    totalSize += f.size
    const encodedFilePath = encodeFilePath(f, {
      stripRelativePath,
    })
    const fileUrl = `${config.url}/uploads/${endpoint}/${datasetId}/${uploadId}/${encodedFilePath}`
    return new Request(fileUrl, {
      method: 'POST',
      body: f,
      headers: {
        Authorization: `Bearer ${token}`,
      },
      credentials: 'omit',
      signal: abortController.signal,
    })
  })

  // TODO - This is disabled due to Chrome bugs
  // eslint-disable-next-line no-constant-condition
  if ('BackgroundFetchManager' in self && false) {
    // Verify the registration is ready
    const swReg = await navigator.serviceWorker.ready
    // If there is parallelism, the browser will handle it
    const bgFetch = await swReg.backgroundFetch.fetch(uploadId, requests, {
      title: `${datasetId} upload`,
      uploadTotal: totalSize,
    })
    return new Promise((resolve, reject) => {
      bgFetch.addEventListener('progress', () => {
        const percent = Math.round(
          (bgFetch.uploaded / bgFetch.uploadTotal) * 100,
        )
        console.log(`Upload progress: ${percent}%`)
      })
      bgFetch.addEventListener('backgroundfetchsuccess', bgFetchEvent => {
        resolve()
      })
      bgFetch.addEventListener('backgroundfetchfail', bgFetchEvent => {
        reject()
      })
    })
  } else {
    // No background fetch
    // Parallelism is handled by the client in this case
    return uploads.uploadParallel(requests, totalSize, uploadProgress)
  }
}
