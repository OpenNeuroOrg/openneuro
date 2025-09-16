import * as Sentry from "@sentry/node"
import CacheItem, { CacheType } from "../cache/item"
import { redis } from "../libs/redis"
import {
  type DatasetOrSnapshot,
  datasetOrSnapshot,
} from "../utils/datasetOrSnapshot"
import {
  emptyDataciteYml,
  getDataciteYml,
  normalizeRawContributors,
  saveDataciteYmlToRepo,
  updateContributorsUtil,
} from "../utils/datacite-utils"
import type {
  Contributor,
  RawDataciteContributor,
  RawDataciteCreator,
  RawDataciteYml,
} from "../types/datacite"
import { description } from "./description"

/**
 * GraphQL resolver: fetch contributors for a dataset or snapshot
 */
export const contributors = async (
  obj: DatasetOrSnapshot,
): Promise<Contributor[]> => {
  if (!obj) {
    console.warn("[contributors] Received null or undefined object")
    return []
  }

  const { datasetId, revision } = datasetOrSnapshot(obj)
  if (!datasetId) {
    console.warn(
      "[contributors] datasetId missing in DatasetOrSnapshot object:",
      obj,
    )
    return []
  }

  const revisionShort = revision ? revision.substring(0, 7) : "HEAD"
  console.log(
    "[contributors] datasetId:",
    datasetId,
    "revision:",
    revisionShort,
  )

  const dataciteCache = new CacheItem(redis, CacheType.dataciteYml, [
    datasetId,
    revisionShort,
  ])

  try {
    const dataciteData: RawDataciteYml | null = await dataciteCache.get(() =>
      getDataciteYml(datasetId, revision)
    )

    if (dataciteData?.data?.attributes?.contributors?.length) {
      const normalized = await normalizeRawContributors(
        dataciteData.data.attributes.contributors,
      )

      // 🔹 Ensure all contributors have an order, sort by order
      const orderedContributors = normalized
        .map((c, index) => ({
          ...c,
          order: c.order ?? index + 1,
        }))
        .sort((a, b) => a.order - b.order)

      console.log(
        "[contributors] normalized contributors with order:",
        orderedContributors,
      )
      return orderedContributors
    }

    // ---- Fallback: dataset_description.json authors ----
    const datasetDescription = await description(obj)
    if (datasetDescription?.Authors?.length) {
      const fallbackContributors = datasetDescription.Authors.map(
        (author: string, index: number) => ({
          name: author.trim(),
          givenName: undefined,
          familyName: undefined,
          orcid: undefined,
          contributorType: "Contributor",
          order: index + 1, // assign sequential order
          userId: undefined,
        }),
      )
      console.log(
        "[contributors] fallback contributors from dataset_description.json:",
        fallbackContributors,
      )
      return fallbackContributors
    }

    // No contributors found
    return []
  } catch (err) {
    console.error(
      "[contributors] error fetching contributors for",
      datasetId,
      "revision",
      revisionShort,
      err,
    )
    Sentry.captureException(err)
    return []
  }
}

/**
 * GraphQL mutation resolver (named export)
 */
export const updateContributors = async (
  _parent: any,
  args: { datasetId: string; newContributors: Contributor[] },
  context: any,
) => {
  const userId = context?.userInfo?.id || context?.userInfo?._id
  if (!userId) {
    console.warn("[updateContributors] Missing userId in context")
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
          files: result.draft.files || [], // optional
          modified: new Date().toISOString(),
        },
      },
    }
  } catch (err) {
    console.error("[updateContributors] Error:", err)
    Sentry.captureException(err)
    return { success: false, dataset: null }
  }
}
