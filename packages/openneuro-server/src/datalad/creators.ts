import yaml from "js-yaml"
import * as Sentry from "@sentry/node"
import CacheItem, { CacheType } from "../cache/item"
import { redis } from "../libs/redis"
import { fileUrl } from "./files"
import {
  type DatasetOrSnapshot,
  datasetOrSnapshot,
} from "../utils/datasetOrSnapshot"
import { description } from "./description"
import { validateOrcid } from "../utils/orcid-utils"

export interface Creator {
  name: string
  givenName?: string
  familyName?: string
  orcid?: string
}

interface NameIdentifier {
  nameIdentifier: string
  nameIdentifierScheme: string
  schemeUri?: string
}

interface Affiliation {
  name: string
  schemeUri?: string
  affiliationIdentifier?: string
  affiliationIdentifierScheme?: string
}

interface RawDataciteCreator {
  name: string
  nameType: "Personal" | "Organizational"
  givenName?: string
  familyName?: string
  nameIdentifiers?: NameIdentifier[]
  affiliation?: Affiliation[]
}

interface RawDataciteTypes {
  resourceType?: string
  resourceTypeGeneral: string
}

interface RawDataciteAttributes {
  creators?: RawDataciteCreator[]
  types: RawDataciteTypes
}

interface RawDataciteYml {
  data: {
    attributes: RawDataciteAttributes
  }
}

/**
 * Attempts to read and parse the datacite metadata file.
 */
const getDataciteYml = async (
  datasetId: string,
  revision: string,
): Promise<RawDataciteYml | null> => {
  const dataciteFileUrl = fileUrl(datasetId, "", "datacite", revision)
  try {
    const res = await fetch(dataciteFileUrl)
    const contentType = res.headers.get("content-type")

    if (res.status === 200) {
      if (
        !contentType?.includes("application/yaml") &&
        !contentType?.includes("text/yaml")
      ) {
        Sentry.captureMessage(
          `Datacite file for ${datasetId}:${revision} served with unexpected Content-Type: ${contentType}. Attempting YAML parse anyway.`,
        )
      }

      const text = await res.text()
      try {
        const parsedYaml: RawDataciteYml = yaml.load(text) as RawDataciteYml
        return parsedYaml
      } catch (parseErr) {
        throw new Error(
          `Found datacite file for dataset ${datasetId} (revision: ${revision}), but failed to parse it as YAML:`,
          { cause: parseErr },
        )
      }
    } else if (res.status === 404) {
      // common for datacite file to not exist
      return null
    } else {
      throw new Error(
        `Attempted to read datacite file for dataset ${datasetId} (revision: ${revision}) and received status ${res.status}.`,
      )
    }
  } catch (fetchErr) {
    Sentry.captureException(fetchErr) // Capture fetch errors
    return null
  }
}

/**
 * Normalizes datacite.yml creators to the Creator interface, extracting ORCID IDs.
 * Returns Creator[]
 */
export const normalizeDataciteCreators = (
  rawCreators: RawDataciteCreator[] | undefined,
): Creator[] => {
  if (!rawCreators) {
    return []
  }

  return rawCreators.map((rawCreator) => {
    const orcidIdentifier = rawCreator.nameIdentifiers?.find(
      (ni: NameIdentifier) =>
        ni.nameIdentifierScheme?.toUpperCase() === "ORCID",
    )

    const orcidNumber = validateOrcid(orcidIdentifier?.nameIdentifier)

    return {
      name: rawCreator.name ||
        [rawCreator.givenName, rawCreator.familyName].filter(Boolean).join(
          " ",
        ) || "Unknown Creator",
      givenName: rawCreator.givenName,
      familyName: rawCreator.familyName,
      orcid: orcidNumber, // ORCID number or undefined
    }
  })
}

/**
 * Normalizes dataset_description.json authors.
 * Returns Creator[] with only the 'name' field populated from the author string.
 */
const normalizeBidsAuthors = (authors: unknown): Creator[] => {
  if (!Array.isArray(authors)) {
    return []
  }
  return authors
    .map((authorString) => {
      if (typeof authorString === "string") {
        const trimmedAuthorString = authorString.trim()
        return {
          name: trimmedAuthorString,
        }
      }
      return null
    })
    .filter(Boolean) as Creator[] // Filter out nulls and assert type
}

/**
 * Get creators (authors) for a dataset, prioritizing datacite.yml/yaml,
 * checking resourceTypeGeneral for Dataset.
 */
export const creators = async (obj: DatasetOrSnapshot): Promise<Creator[]> => {
  const { datasetId, revision } = datasetOrSnapshot(obj)
  const revisionShort = revision.substring(0, 7)

  // Default fallback for authors if neither file provides them
  const defaultAuthors: Creator[] = []
  let parsedCreators: Creator[] | null = null

  // 1. Try to get creators from datacite (backend resolves .yml or .yaml)
  const dataciteCache = new CacheItem(redis, CacheType.dataciteYml, [
    datasetId,
    revisionShort,
  ])
  try {
    const dataciteData = await dataciteCache.get(() =>
      getDataciteYml(datasetId, revision)
    )

    // --- Check resourceTypeGeneral and access new creators path ---
    if (dataciteData) {
      const resourceTypeGeneral = dataciteData?.data?.attributes?.types
        ?.resourceTypeGeneral

      if (resourceTypeGeneral === "Dataset") {
        parsedCreators = normalizeDataciteCreators(
          dataciteData.data.attributes.creators,
        )
        if (parsedCreators.length > 0) {
          Sentry.captureMessage(
            `Loaded creators from datacite file for ${datasetId}:${revision} (ResourceType: ${resourceTypeGeneral})`,
          )
        } else {
          // No creators found in datacite file even if resourceTypeGeneral is Dataset
          Sentry.captureMessage(
            `Datacite file for ${datasetId}:${revision} is Dataset type but provided no creators.`,
          )
        }
      } else {
        Sentry.captureMessage(
          `Datacite file for ${datasetId}:${revision} found but resourceTypeGeneral is '${resourceTypeGeneral}', not 'Dataset'.`,
        )
      }
    }
  } catch (error) {
    Sentry.captureException(error)
    // Continue to fallback if datacite file processing failed
  }

  // 2. If datacite file didn't provide creators or was not a 'Dataset', try dataset_description.json
  if (!parsedCreators || parsedCreators.length === 0) {
    try {
      const datasetDescription = await description(obj)
      if (
        datasetDescription &&
        Array.isArray(datasetDescription.Authors)
      ) {
        parsedCreators = normalizeBidsAuthors(
          datasetDescription.Authors,
        )
        Sentry.captureMessage(
          `Loaded creators from dataset_description.json via description resolver for ${datasetId}:${revision}`,
        )
      }
    } catch (error) {
      Sentry.captureException(error)
    }
  }

  // Return the parsed creators or the default empty array
  return parsedCreators || defaultAuthors
}
