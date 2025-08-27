import * as Sentry from "@sentry/node"
import CacheItem, { CacheType } from "../cache/item"
import { redis } from "../libs/redis"
import {
  type DatasetOrSnapshot,
  datasetOrSnapshot,
} from "../utils/datasetOrSnapshot"
import { getDataciteYml } from "../utils/datacite-utils"
import { validateOrcid } from "../utils/orcid-utils"
import type {
  Contributor,
  NameIdentifier,
  RawDataciteContributor,
} from "../types/datacite"

/**
 * Normalizes datacite contributors to the Contributor interface, extracting ORCID IDs.
 * Returns Contributor[]
 */
export const normalizeDataciteContributors = (
  rawContributors: RawDataciteContributor[] | undefined,
): Contributor[] => {
  if (!rawContributors) {
    return []
  }

  return rawContributors.map((rawContributor) => {
    const orcidIdentifier = rawContributor.nameIdentifiers?.find(
      (ni: NameIdentifier) =>
        ni.nameIdentifierScheme?.toUpperCase() === "ORCID",
    )

    const orcidNumber = validateOrcid(orcidIdentifier?.nameIdentifier)

    return {
      name: rawContributor.name ||
        [rawContributor.givenName, rawContributor.familyName].filter(Boolean)
          .join(
            " ",
          ) ||
        "Unknown Contributor",
      givenName: rawContributor.givenName,
      familyName: rawContributor.familyName,
      orcid: orcidNumber, // ORCID number or undefined
      contributorType: rawContributor.contributorType,
    }
  })
}

/**
 * Get contributors for a dataset, prioritizing datacite
 * checking resourceTypeGeneral for Dataset.
 */
export const contributors = async (
  obj: DatasetOrSnapshot,
): Promise<Contributor[]> => {
  const { datasetId, revision } = datasetOrSnapshot(obj)
  const revisionShort = revision.substring(0, 7)

  let parsedContributors: Contributor[] = []

  // 1. Try to get contributors from datacite
  const dataciteCache = new CacheItem(redis, CacheType.dataciteYml, [
    datasetId,
    revisionShort,
  ])
  try {
    const dataciteData = await dataciteCache.get(() =>
      getDataciteYml(datasetId, revision)
    )

    // --- Check resourceTypeGeneral and access new contributors path ---
    if (dataciteData) {
      const resourceTypeGeneral = dataciteData?.data?.attributes?.types
        ?.resourceTypeGeneral

      if (resourceTypeGeneral === "Dataset") {
        parsedContributors = normalizeDataciteContributors(
          dataciteData.data.attributes.contributors,
        )
        if (parsedContributors.length > 0) {
          Sentry.captureMessage(
            `Loaded contributors from datacite file for ${datasetId}:${revision} (ResourceType: ${resourceTypeGeneral})`,
          )
        } else {
          // No contributors found in datacite file even if resourceTypeGeneral is Dataset
          Sentry.captureMessage(
            `Datacite file for ${datasetId}:${revision} is Dataset type but provided no contributors.`,
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
  }

  // Return the parsed contributors or the default empty array
  return parsedContributors
}
