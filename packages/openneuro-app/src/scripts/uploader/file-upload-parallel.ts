/**
 * Convert from a URL compatible path
 * @param {String} path
 */
export const decodeFilePath = (path) => {
  return path.replace(new RegExp(":", "g"), "/")
}

/**
 * Determine parallelism based on Request list
 * @param {Array<Request>} requests
 * @param {number} bytes expected total size of all requests
 * @returns {number}
 */
export function uploadParallelism(requests, bytes) {
  const averageSize = bytes / requests.length
  const parallelism = averageSize / 524288 // 512KB
  if (parallelism > 8) {
    return 8
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
  const filePath = url.substring(url.lastIndexOf("/") + 1)
  return decodeFilePath(filePath)
}

/**
 * Control retry delay for upload file requests
 * @param {number} step Attempt number
 * @param {Request} request Active request
 */
export async function retryDelay(step, request) {
  if (step <= 4) {
    await new Promise((r) => setTimeout(r, step ** 2 * 1000))
  } else {
    throw new Error(
      `Failed to upload file after ${step} attempts - "${request.url}"`,
    )
  }
}

/**
 * Repeatable function for single file upload fetch request
 * @param {object} uploadProgress Progress controller instance
 * @param {typeof fetch} fetch Fetch implementation to use - useful for environments without a native fetch
 * @returns {function (Request, number): Promise<Response|void>}
 */
export const uploadFile =
  (uploadProgress, fetch) => async (request, attempt = 1) => {
    // Create a retry function with attempts incremented
    const filename = parseFilename(request.url)
    const handleFailure = async (failure) => {
      const retryClone = request.clone()
      // eslint-disable-next-line no-console
      console.warn(`\nRetrying upload for ${filename}: ${failure}`)
      try {
        await retryDelay(attempt, request)
        return uploadFile(uploadProgress, fetch)(retryClone, attempt + 1)
      } catch (err) {
        if ("failUpload" in uploadProgress) {
          uploadProgress.failUpload(filename)
        }
        throw err
      }
    }
    // This is needed to cancel the request in case of client errors
    if ("startUpload" in uploadProgress) {
      uploadProgress.startUpload(filename)
    }
    try {
      // Clone before using the request to allow retries to reuse the body
      const response = await fetch(request)
      if (response.status === 200) {
        // We need to wait for the response body or fetch-h2 may leave the connection open
        await response.json()
        if ("finishUpload" in uploadProgress) {
          uploadProgress.finishUpload(filename)
        }
        uploadProgress.increment()
      } else {
        await handleFailure(response.statusText)
      }
    } catch (err) {
      await handleFailure(err)
    }
  }

/**
 * @param {Request[]} requests
 * @param {number} totalSize
 * @param {object} uploadProgress
 * @param {typeof fetch} fetch
 */
export async function uploadParallel(
  requests,
  totalSize,
  uploadProgress,
  fetch,
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
