import yaml from "js-yaml"
import * as Sentry from "@sentry/node"
import CacheItem, { CacheType } from "../cache/item"
import { redis } from "../libs/redis"
import { fileUrl } from "./files"
import {
  type DatasetOrSnapshot,
  datasetOrSnapshot,
} from "../utils/datasetOrSnapshot"
import { getDataciteYml } from "../utils/datacite-utils"
import { description } from "./description"
import { validateOrcid } from "../utils/orcid-utils"

import {
  Creator,
  NameIdentifier,
  RawDataciteCreator,
  RawDataciteYml,
} from "../types/datacite"

/**
 * Normalizes datacite creators to the Creator interface, extracting ORCID IDs.
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
    .filter(Boolean) as Creator[]
}

/**
 * Get creators (authors) for a dataset, prioritizing datacite
 * checking resourceTypeGeneral for Dataset.
 */
export const creators = async (obj: DatasetOrSnapshot): Promise<Creator[]> => {
  const { datasetId, revision } = datasetOrSnapshot(obj)
  const revisionShort = revision.substring(0, 7)

  // Default fallback for authors if neither file provides them
  const defaultAuthors: Creator[] = []
  let parsedCreators: Creator[] | null = null

  // 1. Try to get creators from datacite
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
