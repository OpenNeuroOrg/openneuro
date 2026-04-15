import * as datalad from "../../datalad/dataset"
import { removeDatasetSearchDocument } from "./dataset-search"
import { latestSnapshot, snapshots } from "./snapshots"
import { description } from "./description"
import {
  checkDatasetAdmin,
  checkDatasetRead,
  checkDatasetWrite,
} from "../permissions"
import { user } from "./user"
import { permissions } from "./permissions"
import { datasetComments } from "./comment"
import { metadata } from "./metadata"
import { history } from "./history"
import * as dataladAnalytics from "../../datalad/analytics"
import DatasetModel from "../../models/dataset"
import Deletion from "../../models/deletion"
import { reviewers } from "./reviewer"
import { getDatasetWorker } from "../../libs/datalad-service"
import { getFileName } from "../../datalad/files"
import { onBrainlife } from "./brainlife"
import { brainInitiative } from "./brainInitiative"
import { derivatives } from "./derivatives"
import { promiseTimeout } from "../../utils/promiseTimeout"
import { datasetEvents } from "./datasetEvents"
import semver from "semver"
import { getDraftInfo } from "../../datalad/draft"
import type { GraphQLContext } from "../builder"
import type { DatasetDocument } from "../../models/dataset"

export const dataset = async (
  obj: unknown,
  { id }: { id: string },
  { user, userInfo }: GraphQLContext,
) => {
  await checkDatasetRead(id, user, userInfo)
  return promiseTimeout(datalad.getDataset(id), 30000)
}

export const datasets = (
  parent: unknown,
  args: Record<string, unknown>,
  { user, userInfo }: GraphQLContext,
) => {
  if (user) {
    return datalad.getDatasets({
      ...args,
      userId: user,
      admin: userInfo.admin,
    })
  } else {
    return datalad.getDatasets({ ...args, indexing: userInfo?.indexer })
  }
}

export const snapshotCreationComparison = (
  { created: a, tag: a_tag }: { created: Date | string; tag: string },
  { created: b, tag: b_tag }: { created: Date | string; tag: string },
) => {
  if (semver.valid(a_tag) && semver.valid(b_tag)) {
    return semver.compare(a_tag, b_tag)
  } else {
    return new Date(a).getTime() - new Date(b).getTime()
  }
}

/**
 * Find the canonical name for a dataset from snapshots and drafts
 * @param {object} obj Dataset object (at least {id: "datasetId"})
 */
export const datasetName = (obj: { id: string; revision?: string }) => {
  return snapshots(obj).then((results) => {
    if (results && results.length) {
      // Return the latest snapshot name
      const sortedSnapshots = results.sort(snapshotCreationComparison)
      return description({
        id: obj.id,
        revision: sortedSnapshots[0].hexsha,
      }).then((desc) => desc.Name)
    } else if (obj.revision) {
      // Return the draft name or null
      return description({
        id: obj.id,
        revision: obj.revision,
      }).then((desc) => desc.Name)
    } else {
      return null
    }
  })
}

/**
 * Resolve the best dataset name and cache in mongodb
 * @param {string} datasetId
 */
export const updateDatasetName = (datasetId: string) =>
  datasetName({ id: datasetId }).then((name) =>
    DatasetModel.updateOne({ id: datasetId }, { $set: { name } }).exec()
  )

/**
 * Create an empty dataset (new repo, new accession number)
 */
export const createDataset = (
  obj: unknown,
  { affirmedDefaced, affirmedConsent }: {
    affirmedDefaced: boolean
    affirmedConsent: boolean
  },
  { user, userInfo }: GraphQLContext,
) => {
  // Check for a valid login
  if (user) {
    if (affirmedDefaced || affirmedConsent) {
      return datalad.createDataset(user, userInfo, {
        affirmedDefaced,
        affirmedConsent,
      })
    } else {
      throw new Error(
        "New dataset must be defaced or have participant consent.",
      )
    }
  } else {
    throw new Error("You must be logged in to create a dataset.")
  }
}

/**
 * Delete an existing dataset, as well as all snapshots
 */
export const deleteDataset = async (
  obj: unknown,
  { id, reason, redirect }: { id: string; reason: string; redirect: string },
  { user, userInfo }: GraphQLContext,
) => {
  await checkDatasetWrite(id, user, userInfo)
  const deleted = await datalad.deleteDataset(id, userInfo)
  // Remove from the current version of the Elastic index
  try {
    await removeDatasetSearchDocument(id)
  } catch (err) {
    // This likely means this dataset had not yet been indexed
    /* eslint-disable-next-line no-console */
    console.error(err)
  }
  await new Deletion({
    datasetId: id,
    reason,
    redirect,
    user: { _id: user },
  }).save()
  return deleted
}

/**
 * Delete files from a draft
 */
export const deleteFiles = async (
  obj: unknown,
  { datasetId, files }: { datasetId: string; files: { path: string }[] },
  { user, userInfo }: GraphQLContext,
) => {
  try {
    await checkDatasetWrite(datasetId, user, userInfo)
    await datalad.deleteFiles(datasetId, files, userInfo)
    return true
  } catch (_err) {
    return false
  }
}

export const removeAnnexObject = async (
  obj: unknown,
  { datasetId, snapshot, path, filename, annexKey }: {
    datasetId: string
    snapshot: string
    path: string
    filename: string
    annexKey: string
  },
  { user, userInfo }: GraphQLContext,
) => {
  try {
    await checkDatasetAdmin(datasetId, user, userInfo)
    const filepath = getFileName(path, filename)
    await datalad.removeAnnexObject(
      datasetId,
      snapshot,
      filepath,
      annexKey,
      userInfo,
    )
    return true
  } catch (_err) {
    return false
  }
}

export const flagAnnexObject = async (
  obj: unknown,
  { datasetId, snapshot, filepath, annexKey }: {
    datasetId: string
    snapshot: string
    filepath: string
    annexKey: string
  },
  { user, userInfo }: GraphQLContext,
) => {
  try {
    await checkDatasetWrite(datasetId, user, userInfo)
    await datalad.flagAnnexObject(
      datasetId,
      snapshot,
      filepath,
      annexKey,
      userInfo,
    )
    return true
  } catch (_err) {
    return false
  }
}

/**
 * Update the dataset Public status
 */
export const updatePublic = (
  obj: unknown,
  { datasetId, publicFlag }: { datasetId: string; publicFlag: boolean },
  { user, userInfo }: GraphQLContext,
) => {
  return checkDatasetWrite(datasetId, user, userInfo).then(() => {
    return datalad.updatePublic(datasetId, publicFlag, user)
  })
}

/**
 * Get analytics for a dataset or snapshot
 */
export const analytics = async (
  obj: { id?: string; dataset?: () => Promise<{ id: string }>; tag?: string },
) => {
  // if the dataset field exists, the request is from a snapshot, and
  // we resolve the datasetId from the dataset snapshot field of context.
  // otherwise, just use the id field because the object is a dataset
  const datasetId = obj && obj.dataset ? (await obj.dataset()).id : obj.id

  // if the object is a snapshot, grab the tag. otherwise, tag is null
  const tag = obj && obj.tag ? obj.tag : null
  return datalad.getDatasetAnalytics(datasetId, tag)
}

/**
 * Track analytic of type 'view' or 'download' for a dataset / snapshot
 */
export const trackAnalytics = (
  obj: unknown,
  { datasetId, tag, type }: { datasetId: string; tag: string; type: string },
) => {
  try {
    dataladAnalytics.trackAnalytics(datasetId, tag, type)
    return true
  } catch (_err) {
    return false
  }
}

/**
 * Get the star count for the dataset
 */
export const stars = async (
  obj: { id?: string; dataset?: () => Promise<{ id: string }> },
) => {
  const datasetId = obj && obj.dataset ? (await obj.dataset()).id : obj.id
  return datalad.getStars(datasetId)
}

/**
 * Get the follower count for the dataset
 */
export const followers = async (
  obj: { id?: string; dataset?: () => Promise<{ id: string }> },
) => {
  const datasetId = obj && obj.dataset ? (await obj.dataset()).id : obj.id
  return datalad.getFollowers(datasetId)
}

/**
 * Is this user following?
 *
 * Returns null for anonymous users
 */
export const following = (
  obj: { id: string },
  _: unknown,
  { user }: { user: string },
) =>
  user
    ? datalad.getUserFollowed(obj.id, user).then((res) => (res ? true : false))
    : null

/**
 * Has the user starred this dataset?
 *
 * Returns null for anonymous users
 */
export const starred = (
  obj: { id: string },
  _: unknown,
  { user }: { user: string },
) =>
  user
    ? datalad.getUserStarred(obj.id, user).then((res) => (res ? true : false))
    : null

const worker = (obj: { id: string }) => getDatasetWorker(obj.id)

/**
 * Dataset object
 */
const Dataset = {
  uploader: (ds: DatasetDocument, _: unknown, context: GraphQLContext) =>
    user(ds, { id: ds.uploader }, context as never),
  draft: async (obj: DatasetDocument) => {
    const draftHead = await getDraftInfo(obj.id)
    return {
      id: obj.id,
      revision: draftHead.ref,
      modified: draftHead.modified,
    }
  },
  snapshots,
  latestSnapshot,
  analytics,
  stars,
  followers,
  permissions,
  name: datasetName,
  comments: datasetComments,
  following,
  starred,
  onBrainlife,
  derivatives,
  metadata,
  history,
  worker,
  reviewers,
  brainInitiative,
  events: datasetEvents,
}

export default Dataset
