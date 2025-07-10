/**
 * Implementation of dataset models internal to OpenNeuro's database
 *
 * See resolvers for interaction with other data sources.
 */
import * as Sentry from "@sentry/node"
import request from "superagent"
import requestNode from "request"
import objectHash from "object-hash"
import { Readable } from "stream"
import type * as Mongoose from "mongoose"
import config from "../config"
import * as subscriptions from "../handlers/subscriptions"
import { generateDataladCookie } from "../libs/authentication/jwt"
import { redis } from "../libs/redis"
import CacheItem, { CacheType } from "../cache/item"
import { updateDatasetRevision } from "./draft"
import { encodeFilePath, filesUrl, fileUrl, getFileName } from "./files"
import { getAccessionNumber } from "../libs/dataset"
import Dataset from "../models/dataset"
import Metadata from "../models/metadata"
import Permission from "../models/permission"
import Star from "../models/stars"
import Subscription from "../models/subscription"
import BadAnnexObject from "../models/badAnnexObject"
import { datasetsConnection } from "./pagination"
import { getDatasetWorker } from "../libs/datalad-service"
import notifications from "../libs/notifications"
import { createEvent, updateEvent } from "../libs/events"

export const giveUploaderPermission = (datasetId, userId) => {
  const permission = new Permission({ datasetId, userId, level: "admin" })
  return permission.save()
}

/**
 * Create a new dataset
 *
 * Internally we setup metadata and access
 * then create a new DataLad repo
 *
 * @param {string} uploader Id for user creating this dataset
 * @param {Object} userInfo User metadata
 * @returns {Promise} Resolves to {id: accessionNumber} for the new dataset
 */
export const createDataset = async (
  uploader: string,
  userInfo,
  { affirmedDefaced, affirmedConsent },
) => {
  // Obtain an accession number
  const datasetId = await getAccessionNumber()
  // Generate the created event
  const event = await createEvent(
    datasetId,
    uploader,
    { type: "created" },
  )
  try {
    const ds = new Dataset({ id: datasetId, uploader })
    await request
      .post(`${getDatasetWorker(datasetId)}/datasets/${datasetId}`)
      .set("Accept", "application/json")
      .set("Cookie", generateDataladCookie(config)(userInfo))
    // Write the new dataset to mongo after creation
    await ds.save()
    const md = new Metadata({ datasetId, affirmedDefaced, affirmedConsent })
    await md.save()
    await giveUploaderPermission(datasetId, uploader)
    // Creation is complete here, mark successful
    await updateEvent(event)
    await subscriptions.subscribe(datasetId, uploader)
    await notifications.snapshotReminder(datasetId)
    return ds
  } catch (e) {
    Sentry.captureException(e)
    // eslint-disable-next-line
    console.error(`Failed to create ${datasetId}: ${e}`)
    throw e
  }
}

interface WorkerDraftFields {
  // Commit id hash
  ref: string
  // Commit tree ref
  tree: string
  // Commit message
  message: string
  // Commit author time
  modified: string
}

/**
 * Return the latest commit
 * @param {string} id Dataset accession number
 */
export const getDraftHead = async (id): Promise<WorkerDraftFields> => {
  const draftRes = await request
    .get(`${getDatasetWorker(id)}/datasets/${id}/draft`)
    .set("Accept", "application/json")
  return draftRes.body
}

/**
 * Fetch dataset document and related fields
 */
export const getDataset = async (id) => {
  const dataset = await Dataset.findOne({ id }).lean()
  return {
    ...dataset,
    revision: (await getDraftHead(id)).ref,
  }
}

/**
 * Delete dataset and associated documents
 */
export const deleteDataset = async (datasetId, user) => {
  const event = await createEvent(
    datasetId,
    user.id,
    { type: "deleted" },
  )
  await request
    .del(`${getDatasetWorker(datasetId)}/datasets/${datasetId}`)
  await Dataset.deleteOne({ datasetId }).exec()
  await updateEvent(event)
  return true
}

/**
 * For public datasets, cache combinations of sorts/limits/cursors to speed responses
 * @param {object} options getDatasets options object
 */
export const cacheDatasetConnection = (options) => (connectionArguments) => {
  const connection = datasetsConnection(options)
  const cache = new CacheItem(
    redis,
    CacheType.datasetsConnection,
    [objectHash(options)],
    60,
  )
  return cache.get(() => connection(connectionArguments))
}

/**
 * mongo aggregates + match docs
 * @param {object} match MongoDB $match aggregate
 * @returns {Array<object>} Array of MongoDB aggregate pipelines
 */
const aggregateArraySetup = (match): Mongoose.Expression => [{ $match: match }]

/**
 * Add any filter steps based on the filterBy options provided
 * @param {object} options GraphQL query parameters
 * @returns {(match: object) => Array<any>} Array of aggregate stages
 */
export const datasetsFilter = (options) => (match) => {
  const aggregates = aggregateArraySetup(match)
  if (options.modality) {
    aggregates.push(
      ...[
        {
          $lookup: {
            from: "snapshots",
            localField: "id",
            foreignField: "datasetId",
            as: "snapshots",
          },
        },
        { $addFields: { snapshots: { $slice: ["$snapshots", -1] } } },
        {
          $lookup: {
            from: "summaries",
            localField: "snapshots.0.hexsha",
            foreignField: "id",
            as: "summaries",
          },
        },
        {
          $match: {
            "summaries.0.modalities": new RegExp(`^${options.modality}$`, "i"),
          },
        },
      ],
    )
    return aggregates
  }
  const filterMatch: Mongoose.Expression = {}
  if ("filterBy" in options) {
    const filters = options.filterBy
    if (
      "admin" in options &&
      options.admin &&
      "all" in filters &&
      filters.all
    ) {
      // For admins and {filterBy: all}, ignore any passed in matches
      aggregates.length = 0
    }
    // Apply any filters as needed
    if ("public" in filters && filters.public) {
      filterMatch.public = true
    }
    if ("saved" in filters && filters.saved) {
      aggregates.push({
        $lookup: {
          from: "stars",
          let: { datasetId: "$id" },
          pipeline: [
            {
              $match: {
                $expr: {
                  $and: [
                    { $eq: ["$userId", options.userId] },
                    { $eq: ["$datasetId", "$$datasetId"] },
                  ],
                },
              },
            },
          ],
          as: "saved",
        },
      })
      filterMatch.saved = { $exists: true, $ne: [] } // arr datasetIds
    }

    if ("userId" in options && "shared" in filters && filters.shared) {
      filterMatch.uploader = { $ne: options.userId }
    }
    if ("userId" in options && "starred" in filters && filters.starred) {
      aggregates.push({
        $lookup: {
          from: "stars",
          let: { datasetId: "$id" },
          pipeline: [
            {
              $match: {
                $expr: {
                  $and: [
                    { $eq: ["$datasetId", "$$datasetId"] },
                    { $eq: ["$userId", options.userId] },
                  ],
                },
              },
            },
          ],
          as: "starred",
        },
      })
      filterMatch.starred = { $exists: true, $ne: [] }
    }
    if ("invalid" in filters && filters.invalid) {
      // SELECT * FROM datasets JOIN issues ON datasets.revision = issues.id WHERE ...
      aggregates.push({
        $lookup: {
          from: "issues", //look at issues collection
          let: { revision: "$revision" }, // find issue match revision datasets.revision
          pipeline: [
            { $unwind: "$issues" },
            {
              $match: {
                $expr: {
                  $and: [
                    { $eq: ["$id", "$$revision"] }, // JOIN CONSTRAINT  issues.id = datasets.revision
                    { $eq: ["$issues.severity", "error"] }, // WHERE severity = 'error'  issues.severity db
                  ],
                },
              },
            },
          ],
          as: "issues",
        },
      })
      // Count how many error fields matched in previous step
      aggregates.push({
        $addFields: {
          errorCount: { $size: "$issues" },
        },
      })
      // Filter any datasets with no errors
      filterMatch.errorCount = { $gt: 0 }
    }
    aggregates.push({ $match: filterMatch })
  }
  return aggregates
}
/**
 * Fetch all datasets
 * @param {object} options {orderBy: {created: 'ascending'}, filterBy: {public: true}}
 */
export const getDatasets = (options) => {
  const filter = datasetsFilter(options)
  const connection = datasetsConnection(options)
  if (options && "userId" in options) {
    // Authenticated request
    return Permission.find({ userId: options.userId })
      .exec()
      .then((datasetsAllowed) => {
        const datasetIds = datasetsAllowed.map(
          (permission) => permission.datasetId,
        )
        // Match allowed datasets
        if ("myDatasets" in options && options.myDatasets) {
          // Exclude other users public datasets even though we have access to those
          return connection(filter({ id: { $in: datasetIds } }))
        } else {
          // Include your own or public datasets
          return connection(
            filter({ $or: [{ id: { $in: datasetIds } }, { public: true }] }),
          )
        }
      })
  } else if (options?.indexing) {
    return connection([])
  } else {
    if (options?.myDatasets) {
      // Return zero datasets for anonymous "myDatasets" request
      return connection(filter({ id: false }))
    }
    // Anonymous request implies public datasets only
    const match = { public: true }
    // Anonymous requests can be cached
    const cachedConnection = cacheDatasetConnection(options)
    return cachedConnection(filter(match))
  }
}

// Files to skip in uploads
const filenameBlacklist = new RegExp(/.DS_Store|Icon\r|^\._/)
const pathBlacklist = new RegExp(/^.git|^.gitattributes|^.datalad|^.heudiconv/)
export const testBlacklist = (path, filename) =>
  filenameBlacklist.test(filename) || pathBlacklist.test(path)

/**
 * Add files to a dataset
 */
export const addFile = async (datasetId, path, file) => {
  try {
    const { filename, mimetype, createReadStream, capacitor } = await file

    // Apply blacklist to uploaded files
    if (testBlacklist(path, filename)) {
      return true
    }

    const stream = createReadStream()

    // This does not close the fs-capacitor stream until the stream has finished
    // but it does prevent new readers and allows for cleanup of the temp file buffer
    capacitor.destroy()

    // Start request to backend
    return new Promise((resolve, reject) => {
      const responseFile = {
        filename: getFileName(path, filename),
        size: 0,
      }
      const downstreamRequest = requestNode(
        {
          url: fileUrl(datasetId, path, filename),
          method: "post",
          headers: { "Content-Type": mimetype },
        },
        (err) => (err ? reject(err) : resolve(responseFile)),
      )
      // Attach error handler for incoming request and start feeding downstream
      stream
        .on("data", (chunk) => {
          responseFile.size += chunk.length
        })
        .on("error", (err) => {
          if (err.constructor.name === "FileStreamDisconnectUploadError") {
            // Catch client disconnects.
            // eslint-disable-next-line no-console
            console.warn(
              `Client disconnected during upload for dataset "${datasetId}".`,
            )
          } else {
            // Unknown error, log it at least.
            // eslint-disable-next-line no-console
            console.error(err)
          }
        })
        .pipe(downstreamRequest)
    })
  } catch (err) {
    if (err.constructor.name === "UploadPromiseDisconnectUploadError") {
      // Catch client aborts silently
    } else {
      // Raise any unknown errors
      throw err
    }
  }
}

/**
 * Add file using a string and path
 *
 * Used to mock the stream interface in addFile
 */
export const addFileString = (datasetId, filename, mimetype, content) =>
  addFile(datasetId, "", {
    filename,
    mimetype,
    // Mock a stream so we can reuse addFile
    createReadStream: () => {
      const stream = new Readable()
      stream._read = () => {
        // Content is available already, _read does nothing
      }
      stream.push(content)
      stream.push(null)
      return stream
    },
    // Mock capacitor
    capacitor: {
      destroy: () => {
        // There is no capacitor to destroy
      },
    },
  })

/**
 * Commit a draft
 */
export const commitFiles = (datasetId, user) => {
  let gitRef
  const url = `${getDatasetWorker(datasetId)}/datasets/${datasetId}/draft`
  return request
    .post(url)
    .set("Cookie", generateDataladCookie(config)(user))
    .set("Accept", "application/json")
    .then((res) => {
      gitRef = res.body.ref
      return updateDatasetRevision(datasetId).then(() => gitRef)
    })
}

/**
 * Delete existing files in a dataset
 */
export const deleteFiles = (datasetId, files, user) => {
  const filenames = files.map(({ filename, path }) =>
    filename ? getFileName(path, filename) : encodeFilePath(path)
  )
  return request
    .del(filesUrl(datasetId))
    .set("Cookie", generateDataladCookie(config)(user))
    .set("Accept", "application/json")
    .send({ filenames })
    .then(() => filenames)
}

/**
 * Delete the file's annex object and any public replicas
 */
export const removeAnnexObject = (
  datasetId,
  snapshot,
  filepath,
  annexKey,
  user,
) => {
  const worker = getDatasetWorker(datasetId)
  const url =
    `http://${worker}/datasets/${datasetId}/snapshots/${snapshot}/annex-key/${annexKey}`
  return request
    .del(url)
    .set("Cookie", generateDataladCookie(config)(user))
    .set("Accept", "application/json")
    .then(async () => {
      const existingBAO = await BadAnnexObject.find({ annexKey }).exec()
      if (existingBAO) {
        existingBAO.forEach((bAO) => {
          bAO.remover = user._id
          bAO.removed = true
          bAO.save()
        })
      } else {
        const badAnnexObj = new BadAnnexObject({
          datasetId,
          snapshot,
          filepath,
          annexKey,
          remover: user._id,
          removed: true,
        })
        badAnnexObj.save()
      }
    })
}

/**
 * Flags file. Would be good to find a better way to store flags on dataset.
 */
export const flagAnnexObject = (
  datasetId,
  snapshot,
  filepath,
  annexKey,
  user,
) => {
  const badAnnexObj = new BadAnnexObject({
    datasetId,
    snapshot,
    filepath,
    annexKey,
    flagger: user,
    flagged: true,
  })
  badAnnexObj.save()
}

/**
 * Update public state
 */
export async function updatePublic(datasetId, publicFlag, user) {
  const event = await createEvent(
    datasetId,
    user.id,
    { type: "published", public: publicFlag },
  )
  await Dataset.updateOne(
    { id: datasetId },
    { public: publicFlag, publishDate: new Date() },
    { upsert: true },
  ).exec()
  await updateEvent(event)
}

export const getDatasetAnalytics = (datasetId, _tag) => {
  return Dataset.findOne({ id: datasetId }).then((ds) => ({
    datasetId,
    views: ds.views || 0,
    downloads: ds.downloads || 0,
  }))
}

export const getStars = (datasetId) => Star.find({ datasetId })

export const getUserStarred = (datasetId, userId) =>
  Star.countDocuments({ datasetId, userId }).exec()

export const getFollowers = (datasetId) => {
  return Subscription.find({
    datasetId: datasetId,
  }).exec()
}

export const getUserFollowed = (datasetId, userId) =>
  Subscription.findOne({
    datasetId,
    userId,
  }).exec()
