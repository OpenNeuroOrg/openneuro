/**
 * Minimalist OpenNeuro client with no dependencies
 */

import { getConfig } from "./config.ts"
import { LoginError, QueryError, ResponseError } from "./error.ts"

interface GraphQLError {
  message: string
  locations?: { line: number; column: number }[]
  path?: string[]
  extensions?: unknown
}

/**
 * Patterns that identify a GraphQL error caused by missing credentials
 */
const authenticationErrorPattern =
  /logged in|log in|not authori[sz]ed|unauthori[sz]ed|authentication/i

/**
 * Throw the most useful error available for a failed GraphQL response
 *
 * GraphQL reports failures as an array of objects that carry a server side
 * stack trace. Printing the whole array buries the one line that matters, so
 * only the messages are kept, and a failure caused by missing credentials is
 * reported as a LoginError explaining how to fix it.
 * @param errors The errors array from a GraphQL response
 */
function throwGraphQLError(errors: GraphQLError[]): never {
  const message = errors
    .map((error) => error?.message)
    .filter((message) => typeof message === "string" && message.length > 0)
    .join("\n")
  if (!message) {
    throw new ResponseError(JSON.stringify(errors))
  }
  if (authenticationErrorPattern.test(message)) {
    throw new LoginError(
      `${message}\nRun \`openneuro login\` to authenticate. If you have already logged in, your API key may no longer be valid, so generate a new one and run \`openneuro login\` again.`,
    )
  }
  throw new ResponseError(message)
}

function request(query: string, variables = {}): Promise<Response> {
  const config = getConfig()
  return fetch(`${config.url}/crn/graphql`, {
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
    } | null
  }
  errors?: GraphQLError[]
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
  if (body.errors) {
    throwGraphQLError(body.errors)
  }
  if (!body.data) {
    throw new QueryError("Invalid response")
  }
  const datasetId = body.data.createDataset?.id
  if (!datasetId) {
    // An undefined accession number is used to build the local repository
    // path, so it fails much later with a path error that says nothing about
    // the request that actually failed.
    throw new ResponseError(
      "The server did not return an accession number for the new dataset.",
    )
  }
  return datasetId
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

export async function getLatestSnapshotVersion(datasetId: string) {
  const query = `
  query($datasetId: ID!) {
    dataset(id: $datasetId) {
      latestSnapshot {
        id
        tag
      }
    }
  }
  `
  const res = await request(query, { datasetId })
  const body = await res.json()
  if (body.errors) {
    throwGraphQLError(body.errors)
  }
  if (body.data) {
    return body.data.dataset.latestSnapshot.tag
  } else {
    throw new QueryError("Invalid response")
  }
}
