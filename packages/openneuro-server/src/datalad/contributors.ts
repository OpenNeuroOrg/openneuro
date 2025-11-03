import * as Sentry from "@sentry/node"
import CacheItem, { CacheType } from "../cache/item"
import { redis } from "../libs/redis"
import {
  type DatasetOrSnapshot,
  datasetOrSnapshot,
} from "../utils/datasetOrSnapshot"
import {
  getDataciteYml,
  normalizeRawContributors,
  updateContributorsUtil,
} from "../utils/datacite-utils"
import type { Contributor, RawDataciteYml } from "../types/datacite"
import { description } from "./description"

/**
 * GraphQL resolver: fetch contributors for a dataset or snapshot
 * Pure function: reads Datacite.yml or dataset_description.json and returns the list
 */
export const contributors = async (
  obj: DatasetOrSnapshot,
): Promise<Contributor[]> => {
  if (!obj) return []

  const { datasetId, revision } = datasetOrSnapshot(obj)
  if (!datasetId) return []

  const revisionShort = revision ? revision.substring(0, 7) : "HEAD"
  const dataciteCache = new CacheItem(redis, CacheType.dataciteYml, [
    datasetId,
    revisionShort,
  ])

  try {
    const dataciteData: RawDataciteYml & { contentType?: string } | null =
      await dataciteCache.get(() => getDataciteYml(datasetId, revision))

    if (!dataciteData) return []

    // --- Capture unexpected content type ---
    if (
      dataciteData.contentType &&
      dataciteData.contentType !== "application/yaml"
    ) {
      Sentry.captureMessage(
        `Datacite file for ${datasetId}:${revisionShort} served with unexpected Content-Type: ${dataciteData.contentType}. Attempting YAML parse anyway.`,
      )
    }

    const attributes = dataciteData.data?.attributes
    const resourceType = attributes?.types?.resourceTypeGeneral

    // --- Wrong resourceTypeGeneral ---
    if (resourceType && resourceType !== "Dataset") {
      Sentry.captureMessage(
        `Datacite file for ${datasetId}:${revisionShort} found but resourceTypeGeneral is '${resourceType}', not 'Dataset'.`,
      )
      return []
    }

    // --- Contributors from Datacite.yml ---
    if (attributes?.contributors?.length) {
      const normalized = await normalizeRawContributors(attributes.contributors)
      return normalized
        .map((c, index) => ({ ...c, order: c.order ?? index + 1 }))
        .sort((a, b) => (a.order ?? 0) - (b.order ?? 0))
    }

    // --- Dataset type but no contributors ---
    if (resourceType === "Dataset") {
      Sentry.captureMessage(
        `Datacite file for ${datasetId}:${revisionShort} is Dataset type but provided no contributors.`,
      )
    }

    // --- Fallback: dataset_description.json authors ---
    const datasetDescription = await description(obj)
    if (datasetDescription?.Authors?.length) {
      return datasetDescription.Authors.map((
        author: string,
        index: number,
      ) => ({
        name: author.trim(),
        givenName: undefined,
        familyName: undefined,
        orcid: undefined,
        contributorType: "Researcher",
        order: index + 1,
        userId: undefined,
      }))
    }

    return []
  } catch (err) {
    Sentry.captureException(err)
    return []
  }
}

/**
 * GraphQL mutation resolver
 */
export interface UserInfo {
  id?: string
  _id?: string
}

export interface GraphQLContext {
  userInfo: UserInfo | null
}

export const updateContributors = async (
  _parent: DatasetOrSnapshot,
  args: { datasetId: string; newContributors: Contributor[] },
  context: GraphQLContext,
) => {
  const userId = context?.userInfo?.id || context?.userInfo?._id
  if (!userId) {
    return { success: false, dataset: null }
  }

  try {
    const contributorsToSave = args.newContributors.map((c, index) => ({
      ...c,
      contributorType: c.contributorType || "Researcher",
      order: c.order ?? index + 1,
    }))

    const result = await updateContributorsUtil(
      args.datasetId,
      contributorsToSave,
      userId,
    )

    return {
      success: true,
      dataset: {
        id: args.datasetId,
        draft: {
          id: args.datasetId,
          contributors: contributorsToSave.sort((a, b) =>
            (a.order ?? 0) - (b.order ?? 0)
          ),
          files: result.draft.files || [],
          modified: new Date().toISOString(),
        },
      },
    }
  } catch (err) {
    Sentry.captureException(err)
    return { success: false, dataset: null }
  }
}
