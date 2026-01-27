/**
 * Get snapshots from datalad-service tags
 */
import * as Sentry from "@sentry/node"
import request from "superagent"
import { redis, redlock } from "../libs/redis"
import CacheItem, { CacheType } from "../cache/item"
import config from "../config"
import {
  snapshotCreationComparison,
  updateDatasetName,
} from "../graphql/resolvers/dataset"
import { description } from "../graphql/resolvers/description"
import doiLib from "../libs/doi/index"
import { getFiles } from "./files"
import { generateDataladCookie } from "../libs/authentication/jwt"
import notifications from "../libs/notifications"
import Dataset from "../models/dataset"
import Snapshot from "../models/snapshot"
import type { SnapshotDocument } from "../models/snapshot"
import { updateDatasetRevision } from "./draft"
import { getDatasetWorker } from "../libs/datalad-service"
import { join } from "path"
import { createEvent, updateEvent } from "../libs/events"
import { queueIndexDataset } from "../queues/producer-methods"

const lockSnapshot = (datasetId, tag) => {
  return redlock.lock(
    `openneuro:create-snapshot-lock:${datasetId}:${tag}`,
    1800000,
  )
}

const createSnapshotMetadata = (datasetId, tag, hexsha, created) => {
  return Snapshot.updateOne(
    { datasetId: datasetId, tag: tag },
    {
      $set: {
        datasetId: datasetId,
        tag: tag,
        hexsha: hexsha,
        created: created,
      },
    },
    { upsert: true },
  )
}

const createIfNotExistsDoi = async (
  datasetId,
  tag,
  descriptionFieldUpdates,
) => {
  if (config.doi.username && config.doi.password) {
    // Mint a DOI
    // Get the newest description
    try {
      const oldDesc = await description({ id: datasetId, revision: "HEAD" })
      const snapshotDoi = await doiLib.registerSnapshotDoi(
        datasetId,
        tag,
        oldDesc,
      )
      if (snapshotDoi) {
        descriptionFieldUpdates["DatasetDOI"] = `doi:${snapshotDoi}`
      }
    } catch (err) {
      Sentry.captureException(err)
      // eslint-disable-next-line no-console
      console.error(err)
      throw new Error("DOI minting failed.")
    }
  }
}

const postSnapshot = async (
  user,
  createSnapshotUrl,
  descriptionFieldUpdates,
  snapshotChanges,
) => {
  // Create snapshot once DOI is ready
  const response = await request
    .post(createSnapshotUrl)
    .send({
      description_fields: descriptionFieldUpdates,
      snapshot_changes: snapshotChanges,
    })
    .set("Accept", "application/json")
    .set("Cookie", generateDataladCookie(config)(user))

  return response.body
}

/**
 * Get a list of all snapshot tags available for a dataset
 *
 * This is equivalent to `git tag` on the repository
 *
 * @param {string} datasetId Dataset accession number
 * @returns {Promise<import('../models/snapshot').SnapshotDocument[]>}
 */
export const getSnapshots = async (datasetId): Promise<SnapshotDocument[]> => {
  const dataset = await Dataset.findOne({ id: datasetId })
  if (!dataset) return null
  const url = `${getDatasetWorker(datasetId)}/datasets/${datasetId}/snapshots`
  return request
    .get(url)
    .set("Accept", "application/json")
    .then(({ body: { snapshots } }) => {
      return snapshots.sort(snapshotCreationComparison)
    })
}

const announceNewSnapshot = async (snapshot, datasetId, user) => {
  if (snapshot.files) {
    notifications.snapshotCreated(datasetId, snapshot, user) // send snapshot notification to subscribers
  }
}

/**
 * Snapshot the current working tree for a dataset
 * @param {String} datasetId - Dataset ID string
 * @param {String} tag - Snapshot identifier and git tag
 * @param {Object} user - User object that has made the snapshot request
 * @param {Object} descriptionFieldUpdates - Key/value pairs to update dataset_description.json
 * @param {Array<string>} snapshotChanges - Array of changes to inject into CHANGES file
 * @returns {Promise<Snapshot>} - resolves when tag is created
 */
export const createSnapshot = async (
  datasetId,
  tag,
  user,
  descriptionFieldUpdates = {},
  snapshotChanges = [],
) => {
  const snapshotCache = new CacheItem(redis, CacheType.snapshot, [
    datasetId,
    tag,
  ])

  // lock snapshot id to prevent upload/update conflicts
  const snapshotLock = await lockSnapshot(datasetId, tag)

  try {
    // Create a version attempt event
    const event = await createEvent(datasetId, user.id, {
      type: "versioned",
      version: tag,
    })
    await createIfNotExistsDoi(datasetId, tag, descriptionFieldUpdates)

    const createSnapshotUrl = `${
      getDatasetWorker(
        datasetId,
      )
    }/datasets/${datasetId}/snapshots/${tag}`
    const snapshot = await postSnapshot(
      user,
      createSnapshotUrl,
      descriptionFieldUpdates,
      snapshotChanges,
    )
    snapshot.created = new Date()
    snapshot.files = await getFiles(datasetId, tag)

    await Promise.all([
      // Update the draft status in datasets collection in case any changes were made (DOI, License)
      updateDatasetRevision(datasetId),

      // Update metadata in snapshots collection
      createSnapshotMetadata(datasetId, tag, snapshot.hexsha, snapshot.created),

      // Trigger an async update for the name field (cache for sorting)
      updateDatasetName(datasetId),
    ])

    // Version is created here and event is updated
    await updateEvent(event)

    // Immediate indexing for new snapshots
    queueIndexDataset(datasetId)

    announceNewSnapshot(snapshot, datasetId, user)
    return snapshot
  } catch (err) {
    // delete the keys if any step fails
    // this avoids inconsistent cache state after failures
    snapshotCache.drop()
    return err
  } finally {
    snapshotLock.unlock()
  }
}

export const deleteSnapshot = (datasetId, tag) => {
  const url = `${
    getDatasetWorker(
      datasetId,
    )
  }/datasets/${datasetId}/snapshots/${tag}`
  return request.del(url).then(async ({ body }) => {
    const snapshotCache = new CacheItem(redis, CacheType.snapshot, [
      datasetId,
      tag,
    ])
    await snapshotCache.drop()
    return body
  })
}

/**
 * Get the contents of a snapshot (files, git metadata) from datalad-service
 * @param {string} datasetId Dataset accession number
 * @param {string} commitRef Tag name to retrieve
 * @returns {Promise<import('../models/snapshot').SnapshotDocument>}
 */
export const getSnapshot = (
  datasetId,
  commitRef,
): Promise<SnapshotDocument> => {
  const url = `${
    getDatasetWorker(
      datasetId,
    )
  }/datasets/${datasetId}/snapshots/${commitRef}`
  const cache = new CacheItem(
    redis,
    CacheType.snapshot,
    [datasetId, commitRef],
    432000,
  )
  return cache.get(() =>
    request
      .get(url)
      .set("Accept", "application/json")
      .then(({ body }) => body)
  )
}

/**
 * Get the hexsha for a snapshot from the datasetId and tag
 *
 * Returns null for snapshots which do not exist
 *
 * @param {string} datasetId
 * @param {string} tag
 */
export const getSnapshotHexsha = (datasetId, tag) => {
  return Snapshot.findOne({ datasetId, tag }, { hexsha: true })
    .exec()
    .then((result) => (result ? result.hexsha : null))
}

/**
 * Get Public Snapshots
 *
 * Returns the most recent snapshots of all publicly available datasets
 */
export const getPublicSnapshots = () => {
  // query all publicly available dataset
  return Dataset.find({ public: true }, "id")
    .exec()
    .then((datasets) => {
      const datasetIds = datasets.map((dataset) => dataset.id)
      return Snapshot.aggregate([
        { $match: { datasetId: { $in: datasetIds } } },
        { $sort: { created: -1 } },
        {
          $group: {
            _id: "$datasetId",
            snapshots: { $push: "$$ROOT" },
          },
        },
        {
          $replaceRoot: {
            newRoot: { $arrayElemAt: ["$snapshots", 0] },
          },
        },
      ]).exec()
    })
}

/**
 * For snapshots, precache all trees for downloads
 */
export const downloadFiles = (datasetId, tag) => {
  const downloadCache = new CacheItem(redis, CacheType.snapshotDownload, [
    datasetId,
    tag,
  ], 432000)
  // Return an existing cache object if we have one
  return downloadCache.get(async () => {
    // If not, fetch all trees sequentially and cache the result (hopefully some or all trees are cached)
    const files = await getFilesRecursive(datasetId, tag, "")
    files.sort()
    return files
  })
}

export async function getFilesRecursive(datasetId, tree, path = "") {
  const files = []
  // Fetch files
  const fileTree = await getFiles(datasetId, tree)
  for (const file of fileTree) {
    const absPath = join(path, file.filename)
    if (file.directory) {
      files.push(...(await getFilesRecursive(datasetId, file.id, absPath)))
    } else {
      files.push({ ...file, filename: absPath })
    }
  }
  return files
}
