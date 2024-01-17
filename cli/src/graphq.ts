/**
 * Minimalist OpenNeuro client with no dependencies
 */

import { getConfig } from "./commands/login.ts"
import { QueryError } from "./error.ts"

function request(query: string, variables = {}): Promise<Response> {
  const config = getConfig()
  return fetch(config.url, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${config.token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ query, variables }),
  })
}

const createDatasetMutation = `
mutation($affirmedConsent: Boolean, $affirmedDefaced: Boolean) {
  createDataset(affirmedConsent: $affirmedConsent, affirmedDefaced: $affirmedDefaced) {
    id
  }
}
`

interface CreateDatasetMutationResponse {
  data?: {
    createDataset: {
      id: string
    }
  }
  error?: {
    message: string
  }
}

/**
 * Create a new dataset
 * @param affirmedDefaced Has the upload affirmed this dataset is defaced?
 * @param affirmedConsent Has the uploader affirmed they have obtained participant conset to share non-defaced images?
 * @returns Dataset ID
 */
export async function createDataset(
  affirmedDefaced: boolean,
  affirmedConsent: boolean,
): Promise<string> {
  const res = await request(createDatasetMutation, {
    affirmedDefaced,
    affirmedConsent,
  })
  const body: CreateDatasetMutationResponse = await res.json()
  if (body.error) {
    throw new QueryError(JSON.stringify(body.error))
  }
  if (body.data) {
    return body?.data?.createDataset?.id
  } else {
    throw new QueryError("Invalid response")
  }
}

const prepareUploadMutation = `
mutation($datasetId: ID!, $uploadId: ID!) {
  prepareUpload(datasetId: $datasetId, uploadId: $uploadId) {
    id
  }
}
`

/**
 * Setup an upload on the server side
 * @param datasetId Accession number `e.g. ds000001`
 * @param uploadId UUID for the upload if this is a resume operation
 * @returns The UUID for this upload
 */
export async function prepareUpload(
  datasetId: string,
  uploadId: string | undefined,
) {
  const uuid = uploadId ? uploadId : crypto.randomUUID()
  await request(prepareUploadMutation, {
    datasetId,
    uploadId: uuid,
  })
  return uuid
}

export async function finishUpload() {
}
