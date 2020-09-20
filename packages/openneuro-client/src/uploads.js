import gql from 'graphql-tag'

export const prepareUpload = gql`
  mutation prepareUpload($datasetId: ID!, $files: [UploadFile]!) {
    prepareUpload(datasetId: $datasetId, files: $files) {
      id
      datasetId
      token
      endpoint
    }
  }
`

export const finishUpload = gql`
  mutation finishUpload($uploadId: ID!) {
    finishUpload(uploadId: $uploadId)
  }
`

/**
 * Convert to URL compatible path
 * @param {String} path
 */
export const encodeFilePath = path => {
  return path.replace(new RegExp('/', 'g'), ':')
}

/**
 * Convert from a URL compatible path
 * @param {String} path
 */
export const decodeFilePath = path => {
  return path.replace(new RegExp(':', 'g'), '/')
}

/**
 * Given a file list, calculate total size
 */
export const uploadSize = files =>
  files.map(f => f.size).reduce((a, b) => a + b)

/**
 * Determine parallelism based on Request list
 * @param {Array<Request>} requests
 * @param {number} bytes expected total size of all requests
 * @returns {number}
 */
export function uploadParallelism(requests, bytes) {
  const averageSize = bytes / requests.length
  const parallelism = averageSize / 524288 // 512KB
  if (parallelism > 16) {
    return 16
  } else if (parallelism < 2) {
    return 2
  } else {
    return Math.round(parallelism)
  }
}

/**
 * Extract filename from Request URL
 * @param {string} url .../a:path:to:a:file
 */
export function parseFilename(url) {
  const filePath = url.substring(url.lastIndexOf('/') + 1)
  return decodeFilePath(filePath)
}

/**
 * Repeatable function for single file upload fetch request
 * @param {UploadProgress} uploadProgress Progress controller instance
 * @param {fetch} fetch Fetch implementation to use - useful for environments without a native fetch
 * @returns {function (Request, number): Promise<Response>}
 */
export const uploadFile = (uploadProgress, fetch) => (request, attempt = 1) => {
  const filename = parseFilename(request.url)
  // This is needed to cancel the request in case of client errors
  if ('startUpload' in uploadProgress) {
    uploadProgress.startUpload(filename)
  }
  return fetch(request).then(async response => {
    if (response.status === 200) {
      // We need to wait for the response body or fetch-h2 may leave the connection open
      await response.json()
      if ('finishUpload' in uploadProgress) {
        uploadProgress.finishUpload(filename)
      }
      uploadProgress.increment()
    } else {
      if (attempt > 3) {
        if ('failUpload' in uploadProgress) {
          uploadProgress.failUpload(filename)
        }
        throw new Error(
          `Failed to upload file after ${attempt} attempts - "${request.url}"`,
        )
      } else {
        // Retry if up to attempts times
        await uploadFile(uploadProgress, fetch)(request, attempt + 1)
      }
    }
  })
}

export async function uploadParallel(
  requests,
  totalSize,
  uploadProgress,
  fetch = global.fetch,
) {
  // Array stride of parallel requests
  const parallelism = uploadParallelism(requests, totalSize)
  for (
    let rIndex = 0;
    rIndex < requests.length;
    rIndex = rIndex + parallelism
  ) {
    await Promise.allSettled(
      requests
        .slice(rIndex, rIndex + parallelism)
        .map(uploadFile(uploadProgress, fetch)),
    )
  }
}
