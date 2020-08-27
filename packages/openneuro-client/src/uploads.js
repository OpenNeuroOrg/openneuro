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
 * Repeatable function for single file upload fetch request
 * @param {Request} request Constructed Request object
 * @param {number} attempt Increment attempt on retries
 */
export const uploadFile = uploadProgress => (request, attempt = 1) => {
  // This is needed to cancel the request in case of client errors
  return fetch(request).then(response => {
    if (response.status === 200) {
      uploadProgress.increment()
    } else {
      if (attempt > 3) {
        console.error(response)
        throw new Error(
          `Failed to upload file after ${attempt} attempts - "${request.url}"`,
        )
      } else {
        // Retry if up to attempts times
        return uploadFile(uploadProgress)(request, attempt + 1)
      }
    }
  })
}

export async function uploadParallel(requests, totalSize, uploadProgress) {
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
        .map(uploadFile(uploadProgress)),
    )
  }
}
