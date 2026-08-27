/**
 * Translate the DataCite metadata for DOIs into the ORCID work format.
 */
import config from "../../config"
import { validateOrcid } from "../../utils/orcid-utils"
import type { DataCite } from "../../types/datacite"
import type {
  OrcidContributor,
  OrcidExternalId,
  OrcidPublicationDate,
  OrcidWork,
} from "../../types/orcid"

/** ORCID work type for a dataset in the 3.0 schema */
const ORCID_WORK_TYPE = "data-set"

/** ORCID rejects descriptions longer than this */
const MAX_DESCRIPTION_LENGTH = 5000

/** ORCID rejects titles longer than this */
const MAX_TITLE_LENGTH = 1000

/**
 * Stable identifier for a dataset across all of its versions.
 *
 * This is what lets the sync find the work it created for a dataset on a later
 * run - the DOI changes with every snapshot, this does not.
 */
export const datasetExternalIdValue = (datasetId: string): string =>
  `${config.url}/datasets/${datasetId}`

const truncate = (value: string, length: number): string =>
  value.length > length ? `${value.slice(0, length - 1)}…` : value

/**
 * ORCID wants zero padded string components and rejects partial dates that skip
 * a level, so month and day are only included together with what precedes them.
 */
const publicationDate = (date: Date): OrcidPublicationDate => ({
  year: { value: String(date.getUTCFullYear()) },
  month: { value: String(date.getUTCMonth() + 1).padStart(2, "0") },
  day: { value: String(date.getUTCDate()).padStart(2, "0") },
})

/**
 * DataCite creators become ORCID contributors with the author role.
 */
const workContributors = (
  attributes: DataCite,
): OrcidContributor[] =>
  (attributes.creators || []).map((creator, index) => {
    const creatorOrcid = validateOrcid(
      creator.nameIdentifiers?.find(
        (identifier) => identifier.nameIdentifierScheme === "ORCID",
      )?.nameIdentifier,
    )
    return {
      ...(creatorOrcid
        ? {
          "contributor-orcid": {
            uri: `https://orcid.org/${creatorOrcid}`,
            path: creatorOrcid,
            host: "orcid.org",
          },
        }
        : {}),
      "credit-name": { value: creator.name },
      "contributor-attributes": {
        "contributor-sequence": index === 0
          ? ("first" as const)
          : ("additional" as const),
        "contributor-role": "author",
      },
    }
  })

const workExternalIds = (
  datasetId: string,
  attributes: DataCite,
): OrcidExternalId[] => {
  const datasetUrl = datasetExternalIdValue(datasetId)
  const externalIds: OrcidExternalId[] = [
    {
      "external-id-type": "uri",
      "external-id-value": datasetUrl,
      "external-id-url": { value: datasetUrl },
      "external-id-relationship": "self",
    },
  ]
  if (attributes.doi) {
    externalIds.push({
      "external-id-type": "doi",
      "external-id-value": attributes.doi,
      "external-id-url": { value: `https://doi.org/${attributes.doi}` },
      "external-id-relationship": "self",
    })
  }
  return externalIds
}

/**
 * Build the ORCID work describing one dataset at one snapshot.
 *
 * @param datasetId Dataset accession number
 * @param attributes DataCite metadata for the snapshot being published
 * @param snapshotDate Creation date of the snapshot
 */
export const buildOrcidWork = (
  datasetId: string,
  attributes: DataCite,
  snapshotDate: Date,
): OrcidWork => {
  const abstract = attributes.descriptions?.find(
    (description) => description.descriptionType === "Abstract",
  ) || attributes.descriptions?.[0]

  return {
    title: {
      title: {
        value: truncate(
          attributes.titles?.[0]?.title || datasetId,
          MAX_TITLE_LENGTH,
        ),
      },
    },
    "journal-title": { value: "OpenNeuro" },
    ...(abstract?.description
      ? {
        "short-description": truncate(
          abstract.description,
          MAX_DESCRIPTION_LENGTH,
        ),
      }
      : {}),
    type: ORCID_WORK_TYPE,
    "publication-date": publicationDate(snapshotDate),
    "external-ids": { "external-id": workExternalIds(datasetId, attributes) },
    ...(attributes.url ? { url: { value: attributes.url } } : {}),
    ...(attributes.creators?.length
      ? { contributors: { contributor: workContributors(attributes) } }
      : {}),
  }
}
