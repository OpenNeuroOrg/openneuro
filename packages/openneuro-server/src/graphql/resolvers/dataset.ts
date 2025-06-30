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

export const dataset = async (obj, { id }, { user, userInfo }) => {
  await checkDatasetRead(id, user, userInfo)
  return promiseTimeout(datalad.getDataset(id), 30000)
}

export const datasets = (parent, args, { user, userInfo }) => {
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
  { created: a, tag: a_tag },
  { created: b, tag: b_tag },
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
export const datasetName = (obj) => {
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
export const updateDatasetName = (datasetId) =>
  datasetName({ id: datasetId }).then((name) =>
    DatasetModel.updateOne({ id: datasetId }, { $set: { name } }).exec()
  )

/**
 * Create an empty dataset (new repo, new accession number)
 */
export const createDataset = (
  obj,
  { affirmedDefaced, affirmedConsent },
  { user, userInfo },
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
  obj,
  { id, reason, redirect },
  { user, userInfo },
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
  obj,
  { datasetId, files },
  { user, userInfo },
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
  obj,
  { datasetId, snapshot, path, filename, annexKey },
  { user, userInfo },
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
  obj,
  { datasetId, snapshot, filepath, annexKey },
  { user, userInfo },
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
  obj,
  { datasetId, publicFlag },
  { user, userInfo },
) => {
  return checkDatasetWrite(datasetId, user, userInfo).then(() => {
    return datalad.updatePublic(datasetId, publicFlag, user)
  })
}

/**
 * Get analytics for a dataset or snapshot
 */
export const analytics = async (obj) => {
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
export const trackAnalytics = (obj, { datasetId, tag, type }) => {
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
export const stars = async (obj) => {
  const datasetId = obj && obj.dataset ? (await obj.dataset()).id : obj.id
  return datalad.getStars(datasetId)
}

/**
 * Get the follower count for the dataset
 */
export const followers = async (obj) => {
  const datasetId = obj && obj.dataset ? (await obj.dataset()).id : obj.id
  return datalad.getFollowers(datasetId)
}

/**
 * Is this user following?
 *
 * Returns null for anonymous users
 */
export const following = (obj, _, { user }) =>
  user
    ? datalad.getUserFollowed(obj.id, user).then((res) => (res ? true : false))
    : null

/**
 * Has the user starred this dataset?
 *
 * Returns null for anonymous users
 */
export const starred = (obj, _, { user }) =>
  user
    ? datalad.getUserStarred(obj.id, user).then((res) => (res ? true : false))
    : null

const worker = (obj) => getDatasetWorker(obj.id)

/**
 * Dataset object
 */
const Dataset = {
  uploader: (ds, _, context) => user(ds, { id: ds.uploader }, context),
  draft: async (obj) => {
    const draftHead = await datalad.getDraftHead(obj.id)
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
