import config from "../../config"
import { createDOI } from "./index"
import { validateDataciteMetadata } from "./validate"
import { getDataciteYml } from "../../utils/datacite-utils"
import { description } from "../../datalad/description"
import { getPrimaryModality } from "../../graphql/resolvers/summary"
import type { Creator, DataCite } from "../../types/datacite"

/**
 * Assemble Datacite metadata for a DOI from datacite.yml or BIDS fallback.
 *
 * Priority:
 * 1. If datacite.yml exists and has creators, use its attributes as the base.
 * 2. Otherwise, build minimal metadata from dataset_description.json.
 *
 * Always ensures publisher, publicationYear, types.resourceTypeGeneral,
 * doi, and url are set.
 */
export async function assembleMetadata(
  datasetId: string,
  snapshotId: string,
  revision?: string,
  snapshotDate?: Date | string,
): Promise<DataCite> {
  const doi = createDOI(datasetId, snapshotId)
  const url = `${config.url}/datasets/${datasetId}/versions/${snapshotId}`

  const dataciteYml = await getDataciteYml(datasetId, revision)
  const ymlAttrs = dataciteYml?.data?.attributes

  // Check if datacite.yml provided meaningful creator data
  const hasDataciteCreators = Array.isArray(ymlAttrs?.creators) &&
    ymlAttrs.creators.length > 0

  let creators: Creator[]
  let titles: DataCite["titles"]
  let descriptions: DataCite["descriptions"]
  let contributors: DataCite["contributors"]
  let resourceType: string | undefined

  const desc = await description({
    id: datasetId,
    revision: revision || "HEAD",
  })

  if (hasDataciteCreators) {
    creators = ymlAttrs.creators
    titles = ymlAttrs.titles?.length
      ? ymlAttrs.titles
      : [{ title: desc.Name || datasetId }]
    descriptions = ymlAttrs.descriptions
    // Strip empty givenName/familyName and the internal `order` field.
    // Also filter out contributors whose name contains more than one comma,
    // which indicates multiple names were concatenated into a single string.
    contributors = ymlAttrs.contributors
      ?.filter((c) => (c.name?.split(",").length ?? 1) <= 2)
      .map((c) => {
        const { givenName, familyName, order: _order, ...rest } = c
        return {
          ...rest,
          ...(givenName?.trim() ? { givenName } : {}),
          ...(familyName?.trim() ? { familyName } : {}),
        }
      })
    resourceType = ymlAttrs.types?.resourceType
  } else {
    // Fall back to BIDS dataset_description.json
    creators = (desc.Authors || [])
      .filter((author: string) => author)
      .map((author: string) => ({
        name: author,
        nameType: "Personal" as const,
      }))
    titles = [{ title: desc.Name || datasetId }]
    descriptions = desc.Description
      ? [{ description: desc.Description, descriptionType: "Abstract" }]
      : undefined
    contributors = undefined
    resourceType = await getPrimaryModality(datasetId)
  }

  const attributes: DataCite = {
    doi,
    url,
    creators: creators as DataCite["creators"],
    titles: titles as DataCite["titles"],
    publisher: { name: "OpenNeuro" },
    publicationYear: (snapshotDate ? new Date(snapshotDate) : new Date())
      .getFullYear().toString(),
    types: {
      resourceTypeGeneral: "Dataset",
      ...(resourceType ? { resourceType } : {}),
    },
    schemaVersion: "http://datacite.org/schema/kernel-4",
    ...(descriptions ? { descriptions } : {}),
    ...(contributors?.length ? { contributors } : {}),
  }

  const errors = validateDataciteMetadata(attributes)
  if (errors.length > 0) {
    const messages = errors.map((e) => `${e.field}: ${e.message}`).join("; ")
    throw new Error(`DOI metadata validation failed: ${messages}`)
  }

  return attributes
}
