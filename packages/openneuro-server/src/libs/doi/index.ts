import config from "../../config"
import type {
  DataCite,
  DataciteDoiRequest,
  DoiState,
} from "../../types/datacite"

/**
 * @param {Object} doiConfig
 * @param {string} doiConfig.username DOI service username
 * @param {string} doiConfig.password DOI service password
 */
export const formatBasicAuth = (doiConfig) =>
  "Basic " +
  Buffer.from(doiConfig.username + ":" + doiConfig.password).toString("base64")

/**
 * Build a DOI string from dataset accession number and optional snapshot ID.
 */
export function createDOI(accNumber: string, snapshotId?: string): string {
  let doi = config.doi.prefix + "/openneuro." + accNumber
  if (snapshotId) {
    doi = doi + ".v" + snapshotId
  }
  return doi
}

/**
 * Build the Datacite JSON API request payload.
 */
export function buildPayload(
  attributes: DataCite,
  event?: DataCite["event"],
): DataciteDoiRequest {
  return {
    data: {
      type: "dois",
      attributes: {
        ...attributes,
        ...(event ? { event } : {}),
        schemaVersion: "http://datacite.org/schema/kernel-4",
      },
    },
  }
}

/**
 * Create or update a DOI via the Datacite JSON REST API.
 * Uses PUT to {baseUrl}dois/{doi} which handles both create and update.
 */
export async function upsertDoi(
  payload: DataciteDoiRequest,
): Promise<Response> {
  const doi = payload.data.attributes.doi
  const url = `${config.doi.url}dois/${encodeURIComponent(doi)}`
  const response = await fetch(url, {
    method: "PUT",
    headers: {
      "Authorization": formatBasicAuth(config.doi),
      "Content-Type": "application/vnd.api+json",
    },
    body: JSON.stringify(payload),
  })
  if (!response.ok) {
    const body = await response.text()
    throw new Error(
      `Datacite API error ${response.status} for ${doi}: ${body}`,
    )
  }
  return response
}

/**
 * Transition a DOI's state without re-sending full metadata.
 */
export async function updateDoiState(
  doi: string,
  event: DataCite["event"],
): Promise<void> {
  const url = `${config.doi.url}dois/${encodeURIComponent(doi)}`
  const payload = {
    data: {
      type: "dois",
      attributes: { event },
    },
  }
  const response = await fetch(url, {
    method: "PUT",
    headers: {
      "Authorization": formatBasicAuth(config.doi),
      "Content-Type": "application/vnd.api+json",
    },
    body: JSON.stringify(payload),
  })
  if (!response.ok) {
    const body = await response.text()
    throw new Error(
      `Datacite API state transition error ${response.status} for ${doi}: ${body}`,
    )
  }
}

/**
 * Create a draft DOI for a dataset snapshot.
 * Returns the DOI string.
 */
export async function createDraftDoi(
  attributes: DataCite,
): Promise<string> {
  const payload = buildPayload(attributes)
  await upsertDoi(payload)
  return attributes.doi
}

/**
 * Transition a DOI from draft to findable.
 */
export async function publishDoi(doi: string): Promise<void> {
  await updateDoiState(doi, "publish")
}

/**
 * Transition a DOI from findable to registered (hidden but reserved).
 */
export async function hideDoi(doi: string): Promise<void> {
  await updateDoiState(doi, "hide")
}

/**
 * Fetch a DOI record from DataCite. Returns the DOI string and state if it
 * exists, or null if it does not (404). Throws on other errors.
 */
export async function fetchDoiFromDatacite(
  doi: string,
): Promise<{ doi: string; state: DoiState } | null> {
  const url = `${config.doi.url}dois/${encodeURIComponent(doi)}`
  const response = await fetch(url, {
    headers: { Authorization: formatBasicAuth(config.doi) },
  })
  if (response.status === 404) return null
  if (!response.ok) {
    const body = await response.text()
    throw new Error(
      `Datacite API error ${response.status} fetching ${doi}: ${body}`,
    )
  }
  const json = (await response.json()) as {
    data: { attributes: { doi: string; state: string } }
  }
  return {
    doi: json.data.attributes.doi,
    state: json.data.attributes.state as DoiState,
  }
}
