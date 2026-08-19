/**
 * Client for the ORCID Member API 3.0 works endpoints.
 *
 * Writing to a user's ORCID record requires an access token issued to that user
 * with the /activities/update scope. See libs/orcid/token.ts for how those are
 * loaded.
 */
import config from "../../config"
import type {
  OrcidWork,
  OrcidWorksResponse,
  OrcidWorkSummary,
} from "../../types/orcid"

const ORCID_API_VERSION = "v3.0"

const orcidApiUrl = (path: string): string =>
  `${config.auth.orcid.apiURI}/${ORCID_API_VERSION}/${path}`

const orcidHeaders = (accessToken: string): Record<string, string> => ({
  "Authorization": `Bearer ${accessToken}`,
  "Content-Type": "application/vnd.orcid+json",
  "Accept": "application/json",
})

/**
 * ORCID returns errors as JSON but falls back to HTML for some failures, so
 * read the body as text and only summarize it in the thrown error.
 */
const orcidError = async (
  response: Response,
  action: string,
): Promise<Error> => {
  const body = await response.text().catch(() => "")
  return new Error(
    `ORCID API error ${response.status} while ${action}: ${body.slice(0, 500)}`,
  )
}

/**
 * Parse the put-code out of the Location header returned by a work creation.
 *
 * Location looks like `https://api.orcid.org/v3.0/0000-0000-0000-0000/work/12345`
 */
export const putCodeFromLocation = (
  location: string | null,
): number | null => {
  if (!location) return null
  const match = location.match(/\/work\/(\d+)\/?$/)
  return match ? Number(match[1]) : null
}

/**
 * Every work summary on an ORCID record, including works added by other systems.
 */
export const getWorkSummaries = async (
  orcid: string,
  accessToken: string,
): Promise<OrcidWorkSummary[]> => {
  const response = await fetch(orcidApiUrl(`${orcid}/works`), {
    headers: orcidHeaders(accessToken),
  })
  if (!response.ok) {
    throw await orcidError(response, `reading works for ${orcid}`)
  }
  const body = (await response.json()) as OrcidWorksResponse
  return (body.group || []).flatMap((group) => group["work-summary"] || [])
}

/**
 * True if a work summary was created by this OpenNeuro deployment.
 *
 * Works added by other systems (or by hand) must never be modified, ORCID
 * rejects those writes but this avoids relying on that.
 */
export const isOpenNeuroWork = (summary: OrcidWorkSummary): boolean =>
  summary.source?.["source-client-id"]?.path === config.auth.orcid.clientID

/**
 * Map of external id value to put-code for works this deployment created.
 *
 * Used to recover put-codes for works we have no local record of, which keeps
 * the sync idempotent even if our records are lost or a work is added twice.
 */
export const openNeuroWorkPutCodes = (
  summaries: OrcidWorkSummary[],
): Map<string, number> => {
  const putCodes = new Map<string, number>()
  for (const summary of summaries.filter(isOpenNeuroWork)) {
    for (const externalId of summary["external-ids"]?.["external-id"] || []) {
      const value = externalId["external-id-value"]
      // Keep the lowest put-code so repeated runs converge on one work
      const existing = putCodes.get(value)
      if (existing === undefined || summary["put-code"] < existing) {
        putCodes.set(value, summary["put-code"])
      }
    }
  }
  return putCodes
}

/**
 * Add a new work to a user's ORCID record, returning the assigned put-code.
 */
export const createWork = async (
  orcid: string,
  accessToken: string,
  work: OrcidWork,
): Promise<number> => {
  const response = await fetch(orcidApiUrl(`${orcid}/work`), {
    method: "POST",
    headers: orcidHeaders(accessToken),
    body: JSON.stringify(work),
  })
  if (!response.ok) {
    throw await orcidError(response, `creating a work for ${orcid}`)
  }
  const putCode = putCodeFromLocation(response.headers.get("location"))
  if (putCode === null) {
    throw new Error(
      `ORCID API did not return a put-code when creating a work for ${orcid}`,
    )
  }
  return putCode
}

/**
 * Replace an existing work on a user's ORCID record.
 */
export const updateWork = async (
  orcid: string,
  accessToken: string,
  putCode: number,
  work: OrcidWork,
): Promise<void> => {
  const response = await fetch(orcidApiUrl(`${orcid}/work/${putCode}`), {
    method: "PUT",
    headers: orcidHeaders(accessToken),
    body: JSON.stringify({ ...work, "put-code": putCode }),
  })
  if (!response.ok) {
    throw await orcidError(
      response,
      `updating work ${putCode} for ${orcid}`,
    )
  }
}
