/**
 * Types for the ORCID Member API 3.0 works endpoints.
 *
 * https://info.orcid.org/documentation/api-tutorials/
 *
 * The ORCID JSON representation uses hyphenated keys so these interfaces do not
 * follow the usual camelCase convention.
 */

export interface OrcidValue {
  value: string
}

/** Relationship of an external id to the work it is attached to */
export type OrcidExternalIdRelationship = "self" | "part-of" | "version-of"

export interface OrcidExternalId {
  "external-id-type": string
  "external-id-value": string
  "external-id-url"?: OrcidValue
  "external-id-relationship": OrcidExternalIdRelationship
}

export interface OrcidExternalIds {
  "external-id": OrcidExternalId[]
}

export interface OrcidTitle {
  title: OrcidValue
  subtitle?: OrcidValue
  "translated-title"?: OrcidValue & { "language-code": string }
}

export interface OrcidPublicationDate {
  year: OrcidValue
  month?: OrcidValue
  day?: OrcidValue
}

export interface OrcidContributorOrcid {
  uri: string
  path: string
  host: string
}

export interface OrcidContributor {
  "contributor-orcid"?: OrcidContributorOrcid
  "credit-name"?: OrcidValue
  "contributor-attributes"?: {
    "contributor-sequence"?: "first" | "additional"
    "contributor-role": string
  }
}

export interface OrcidContributors {
  contributor: OrcidContributor[]
}

/**
 * A work as sent to POST /work and PUT /work/{putCode}.
 *
 * `put-code` is omitted on create and required on update.
 */
export interface OrcidWork {
  "put-code"?: number
  title: OrcidTitle
  "journal-title"?: OrcidValue
  "short-description"?: string
  type: string
  "publication-date"?: OrcidPublicationDate
  "external-ids": OrcidExternalIds
  url?: OrcidValue
  contributors?: OrcidContributors
  "language-code"?: string
}

export interface OrcidSource {
  "source-client-id"?: { uri: string; path: string; host: string }
  "source-orcid"?: { uri: string; path: string; host: string }
  "source-name"?: OrcidValue
}

export interface OrcidWorkSummary {
  "put-code": number
  source?: OrcidSource
  "external-ids"?: OrcidExternalIds
  title?: OrcidTitle
}

export interface OrcidWorksResponse {
  group?: {
    "work-summary"?: OrcidWorkSummary[]
  }[]
}
