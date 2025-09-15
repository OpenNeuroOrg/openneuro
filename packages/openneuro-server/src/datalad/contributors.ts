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
      console.log(
        "[contributors] normalized contributors from datacite.yml:",
        normalized,
      )
      return normalized
    }

    // Fallback: use dataset_description.json authors if datacite.yml is missing or empty
    const datasetDescription = await description(obj)
    if (datasetDescription?.Authors?.length) {
      const fallbackContributors = datasetDescription.Authors.map((
        author: string,
      ) => ({
        name: author.trim(),
        givenName: undefined,
        familyName: undefined,
        orcid: undefined,
        contributorType: "Contributor",
        userId: undefined,
      }))
      console.log(
        "[contributors] fallback contributors from dataset_description.json:",
        fallbackContributors,
      )
      return fallbackContributors
    }

    // If neither source has contributors, return empty array
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
 * Utility function to update contributors in datacite.yml
 */
export const updateContributorsUtil = async (
  datasetId: string,
  newContributors: Contributor[],
  userId: string,
) => {
  if (!datasetId) throw new Error("datasetId is required")
  if (!newContributors?.length) {
    throw new Error("newContributors cannot be empty")
  }

  // Fetch current datacite.yml as JS object
  let dataciteData = await getDataciteYml(datasetId)
  if (!dataciteData) {
    dataciteData = emptyDataciteYml()
  }

  // Deep copy helper
  const deepCopy = <T>(obj: T): T => JSON.parse(JSON.stringify(obj))

  // ---- STEP 1: Build Contributors Array ----
  const contributorsCopy: RawDataciteContributor[] = deepCopy(
    newContributors.map((c) => ({
      name: c.name,
      givenName: c.givenName || "",
      familyName: c.familyName || "",
      // Default to "Personal" unless explicitly specified otherwise
      nameType: "Personal" as const,
      nameIdentifiers: c.orcid
        ? [
          {
            nameIdentifier: `https://orcid.org/${c.orcid}`,
            nameIdentifierScheme: "ORCID",
            schemeUri: "https://orcid.org",
          },
        ]
        : [],
      contributorType: c.contributorType || "Researcher", // Default to "Researcher"
    })),
  )

  // ---- STEP 2: Build Creators Array Without contributorType ----
  const creatorsCopy: RawDataciteCreator[] = deepCopy(
    contributorsCopy.map(({ contributorType, ...rest }) => rest),
  )

  // ---- STEP 3: Assign to dataciteData ----
  dataciteData.data.attributes.creators = creatorsCopy
  dataciteData.data.attributes.contributors = contributorsCopy

  // ---- STEP 4: Save ----
  await saveDataciteYmlToRepo(datasetId, userId, dataciteData)

  return true
}

/**
 * GraphQL mutation resolver (named export)
 */
export const updateContributors = async (
  _parent: any,
  args: { datasetId: string; newContributors: Contributor[] },
  context: any,
) => {
  console.log("[updateContributors] args:", JSON.stringify(args, null, 2))
  console.log("[updateContributors] context:", JSON.stringify(context, null, 2))

  // Extract user ID from context (handles ORCID or Mongo _id)
  const userId = context?.userInfo?.id || context?.userInfo?._id
  if (!userId) {
    console.warn("[updateContributors] userId missing in context")
    return { success: false, contributors: [] }
  }

  try {
    // Prepare contributors payload
    const contributorsToSave = args.newContributors.map((c) => ({
      ...c,
      contributorType: c.contributorType || "Researcher",
    }))

    console.log(
      "[updateContributors] contributorsToSave:",
      JSON.stringify(contributorsToSave, null, 2),
    )
    console.log("[updateContributors] using userId:", userId)

    // Call utility function to update datacite.yml
    const result = await updateContributorsUtil(
      args.datasetId,
      contributorsToSave,
      userId,
    )
    console.log("[updateContributors] updateContributorsUtil result:", result)

    return {
      success: true,
      contributors: contributorsToSave,
    }
  } catch (err) {
    console.error("[updateContributors] Error:", err)
    Sentry.captureException(err)
    return { success: false, contributors: [] }
  }
}
