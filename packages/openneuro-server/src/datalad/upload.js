import fetch from 'node-fetch'
import { getDatasetWorker } from '../libs/datalad-service'

export const uploadUrl = (datasetId, uploadId) => {
  return `http://${getDatasetWorker(
    datasetId,
  )}/datasets/${datasetId}/upload/${uploadId}`
}

/**
 * Request datalad-service merge an upload into a draft
 * @param {string} datasetId
 * @param {string} uploadId
 * @param {string} forwardToken Single use JWT for making the final commit
 * @returns {Promise<object>}
 */
export const finishUploadRequest = async (
  datasetId,
  uploadId,
  forwardToken,
) => {
  const response = await fetch(uploadUrl(datasetId, uploadId), {
    method: 'POST',
    body: JSON.stringify({}),
    headers: {
      cookie: `accessToken=${forwardToken}`,
    },
  })
  if (response.status !== 200) {
    throw new Error(`Finish upload request failed - ${response.statusText}`)
  }
}
