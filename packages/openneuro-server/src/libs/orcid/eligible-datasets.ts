/**
 * Find the datasets a user has contributed to for publication as ORCID works.
 *
 * A user is a contributor when they uploaded the dataset or when their ORCID iD
 * appears in the dataset's datacite.yml. Uploads come straight from Mongo, but
 * datacite.yml lives in each dataset repository so the search index is used to
 * narrow the field before the authoritative file is read.
 */
import * as Sentry from "@sentry/node"
import { getElasticClient } from "../../elasticsearch/elastic-client"
import Dataset from "../../models/dataset"
import DeprecatedSnapshot from "../../models/deprecatedSnapshot"
import Snapshot from "../../models/snapshot"
import type { SnapshotDocument } from "../../models/snapshot"
import { getSnapshots } from "../../datalad/snapshots"
import type { SnapshotResponse } from "../../datalad/snapshots"
import { snapshotCreationComparison } from "../../utils/snapshots"
import { contributors } from "../../datalad/contributors"

const ELASTIC_INDEX = "datasets"

/** Upper bound on contributor matches returned from the search index */
const MAX_SEARCH_RESULTS = 1000

/** How a user is associated with a dataset */
export type ContributionKind = "uploader" | "contributor"

/**
 * The most recent snapshot of a dataset that has not been deprecated.
 *
 * Deprecated snapshots are withdrawn from the record, so their metadata must
 * never be the source for a work.
 */
export const latestUndeprecatedSnapshot = async (
  datasetId: string,
): Promise<SnapshotResponse | null> => {
  const snapshots = await getSnapshots(datasetId)
  if (!snapshots?.length) return null

  const newestFirst = [...snapshots].sort(snapshotCreationComparison).reverse()
  const deprecated = await DeprecatedSnapshot.find({
    id: { $in: newestFirst.map(({ tag }) => `${datasetId}:${tag}`) },
  })
    .lean()
    .exec()
  const deprecatedIds = new Set(deprecated.map(({ id }) => id))

  return newestFirst.find(
    ({ tag }) => !deprecatedIds.has(`${datasetId}:${tag}`),
  ) || null
}

/**
 * Snapshots returned from the datalad worker may not carry a hexsha, so fall
 * back to the tag which git resolves the same way.
 */
export const snapshotRevision = async (
  datasetId: string,
  snapshot: SnapshotResponse | SnapshotDocument,
): Promise<string> => {
  if (snapshot.hexsha) return snapshot.hexsha
  const stored = await Snapshot.findOne({ datasetId, tag: snapshot.tag })
    .lean()
    .exec()
  return stored?.hexsha || snapshot.tag
}

/**
 * Dataset ids the search index lists this ORCID iD as a contributor of.
 *
 * These are candidates only - the index trails the repositories, so every hit
 * is confirmed against datacite.yml before anything is written to ORCID.
 */
export const searchContributorDatasetIds = async (
  orcid: string,
): Promise<string[]> => {
  const result = await getElasticClient().search<{ id: string }>({
    index: ELASTIC_INDEX,
    size: MAX_SEARCH_RESULTS,
    _source: ["id"],
    query: {
      bool: {
        filter: [
          { term: { public: true } },
          { term: { "latestSnapshot.contributors.orcid.keyword": orcid } },
        ],
      },
    },
  })
  const total = typeof result.hits.total === "number"
    ? result.hits.total
    : result.hits.total?.value ?? 0
  if (total > MAX_SEARCH_RESULTS) {
    Sentry.captureMessage(
      `ORCID works sync found ${total} contributor datasets for ${orcid}, only the first ${MAX_SEARCH_RESULTS} will be published`,
    )
  }
  return result.hits.hits
    .map((hit) => hit._source?.id)
    .filter(Boolean) as string[]
}

export interface EligibleDatasets {
  candidates: Map<string, ContributionKind>
  /** Set when the search index could not be reached, uploads are still synced */
  searchError: string | null
}

/**
 * Every public dataset this user may have a work published for.
 *
 * Uploader matches are authoritative. Contributor matches come from the search
 * index and still need confirming with {@link isDataciteContributor}.
 */
export const eligibleDatasets = async (
  userId: string,
  orcid: string,
): Promise<EligibleDatasets> => {
  const candidates = new Map<string, ContributionKind>()

  const uploaded = await Dataset.find({ uploader: userId, public: true }, "id")
    .lean()
    .exec()
  for (const { id } of uploaded) candidates.set(id, "uploader")

  let searchIds: string[] = []
  let searchError: string | null = null
  try {
    searchIds = await searchContributorDatasetIds(orcid)
  } catch (err) {
    // Uploaded datasets can still be published without the index
    Sentry.captureException(err)
    searchError = String(err)
  }

  const unseen = searchIds.filter((id) => !candidates.has(id))
  if (unseen.length) {
    // Recheck the public flag against Mongo in case the index is stale
    const published = await Dataset.find(
      { id: { $in: unseen }, public: true },
      "id",
    )
      .lean()
      .exec()
    for (const { id } of published) candidates.set(id, "contributor")
  }

  return { candidates, searchError }
}

/**
 * Confirm an ORCID iD is listed in a snapshot's datacite.yml contributors.
 */
export const isDataciteContributor = async (
  datasetId: string,
  tag: string,
  hexsha: string,
  orcid: string,
): Promise<boolean> => {
  const snapshotContributors = await contributors({
    id: `${datasetId}:${tag}`,
    tag,
    hexsha,
  })
  return snapshotContributors.some(
    (contributor) => contributor.orcid === orcid,
  )
}
