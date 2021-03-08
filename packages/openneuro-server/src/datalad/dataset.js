/**
 * Implementation of dataset models internal to OpenNeuro's database
 *
 * See resolvers for interaction with other data sources.
 */
import request from 'superagent'
import requestNode from 'request'
import objectHash from 'object-hash'
import { Readable } from 'stream'
import config from '../config'
import * as subscriptions from '../handlers/subscriptions.js'
import { generateDataladCookie } from '../libs/authentication/jwt'
import { redis } from '../libs/redis'
import CacheItem, { CacheType } from '../cache/item'
import { updateDatasetRevision, expireDraftFiles } from './draft.js'
import { fileUrl, pathUrl, getFileName, encodeFilePath } from './files'
import { getAccessionNumber } from '../libs/dataset.js'
import Dataset from '../models/dataset.js'
import Metadata from '../models/metadata.js'
import Permission from '../models/permission.js'
import Star from '../models/stars.js'
import Analytics from '../models/analytics.js'
import Subscription from '../models/subscription.js'
import { trackAnalytics } from './analytics.js'
import { datasetsConnection } from './pagination.js'
import { getDatasetWorker } from '../libs/datalad-service'

export const giveUploaderPermission = (datasetId, userId) => {
  const permission = new Permission({ datasetId, userId, level: 'admin' })
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
  uploader,
  userInfo,
  { affirmedDefaced, affirmedConsent },
) => {
  // Obtain an accession number
  const datasetId = await getAccessionNumber()
  try {
    const ds = new Dataset({ id: datasetId, uploader })
    const req = await request
      .post(`${getDatasetWorker(datasetId)}/datasets/${datasetId}`)
      .set('Accept', 'application/json')
      .set('Cookie', generateDataladCookie(config)(userInfo))
    // Write the new dataset to mongo after creation
    await ds.save()
    const md = new Metadata({ datasetId, affirmedDefaced, affirmedConsent })
    await md.save()
    await giveUploaderPermission(datasetId, uploader)
    await subscriptions.subscribe(datasetId, uploader)
    return ds
  } catch (e) {
    // eslint-disable-next-line
    console.error(`Failed to create ${datasetId}`)
    throw e
  }
}

/**
 * Return the latest commit
 * @param {string} id Dataset accession number
 */
export const getDraftHead = async id => {
  const draftRes = await request
    .get(`${getDatasetWorker(id)}/datasets/${id}/draft`)
    .set('Accept', 'application/json')
  return draftRes.body.hexsha
}

/**
 * Fetch dataset document and related fields
 */
export const getDataset = async id => {
  // Track any queries for one dataset as a view
  trackAnalytics(id, null, 'views')
  const dataset = await Dataset.findOne({ id }).lean()
  return {
    ...dataset,
    revision: await getDraftHead(id),
  }
}

/**
 * Delete dataset and associated documents
 */
export const deleteDataset = id =>
  request
    .del(`${getDatasetWorker(id)}/datasets/${id}`)
    .then(() => Dataset.deleteOne({ id }).exec())
    .then(() => true)

/**
 * For public datasets, cache combinations of sorts/limits/cursors to speed responses
 * @param {object} options getDatasets options object
 */
export const cacheDatasetConnection = options => connectionArguments => {
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
const aggregateArraySetup = match => [{ $match: match }]

/**
 * Add any filter steps based on the filterBy options provided
 * @param {object} options GraphQL query parameters
 * @returns {(match: object) => Array<any>} Array of aggregate stages
 */
export const datasetsFilter = options => match => {
  const aggregates = aggregateArraySetup(match)
  const filterMatch = {}
  if ('filterBy' in options) {
    const filters = options.filterBy
    if (
      'admin' in options &&
      options.admin &&
      'all' in filters &&
      filters.all
    ) {
      // For admins and {filterBy: all}, ignore any passed in matches
      aggregates.length = 0
    }
    // Apply any filters as needed
    if ('public' in filters && filters.public) {
      filterMatch.public = true
    }
    if ('saved' in filters && filters.saved) {
      aggregates.push({
        $lookup: {
          from: 'stars',
          let: { datasetId: '$id' },
          pipeline: [
            {
              $match: {
                $expr: {
                  $and: [
                    { $eq: ['$userId', options.userId] },
                    { $eq: ['$datasetId', '$$datasetId'] },
                  ],
                },
              },
            },
          ],
          as: 'saved',
        },
      })
      filterMatch.saved = { $exists: true, $ne: [] } // arr datasetIds
    }

    if ('userId' in options && 'shared' in filters && filters.shared) {
      filterMatch.uploader = { $ne: options.userId }
    }
    if ('userId' in options && 'starred' in filters && filters.starred) {
      aggregates.push({
        $lookup: {
          from: 'stars',
          let: { datasetId: '$id' },
          pipeline: [
            {
              $match: {
                $expr: {
                  $and: [
                    { $eq: ['$datasetId', '$$datasetId'] },
                    { $eq: ['$userId', options.userId] },
                  ],
                },
              },
            },
          ],
          as: 'starred',
        },
      })
      filterMatch.starred = { $exists: true, $ne: [] }
    }
    if ('invalid' in filters && filters.invalid) {
      // SELECT * FROM datasets JOIN issues ON datasets.revision = issues.id WHERE ...
      aggregates.push({
        $lookup: {
          from: 'issues', //look at issues collection
          let: { revision: '$revision' }, // find issue match revision datasets.revision
          pipeline: [
            { $unwind: '$issues' },
            {
              $match: {
                $expr: {
                  $and: [
                    { $eq: ['$id', '$$revision'] }, // JOIN CONSTRAINT  issues.id = datasets.revision
                    { $eq: ['$issues.severity', 'error'] }, // WHERE severity = 'error'  issues.severity db
                  ],
                },
              },
            },
          ],
          as: 'issues',
        },
      })
      // Count how many error fields matched in previous step
      aggregates.push({
        $addFields: {
          errorCount: { $size: '$issues' },
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
export const getDatasets = options => {
  const filter = datasetsFilter(options)
  const connection = datasetsConnection(options)
  if (options && 'userId' in options) {
    // Authenticated request
    return Permission.find({ userId: options.userId })
      .exec()
      .then(datasetsAllowed => {
        const datasetIds = datasetsAllowed.map(
          permission => permission.datasetId,
        )
        // Match allowed datasets
        if ('myDatasets' in options && options.myDatasets) {
          // Exclude other users public datasets even though we have access to those
          return connection(filter({ id: { $in: datasetIds } }))
        } else {
          // Include your own or public datasets
          return connection(
            filter({ $or: [{ id: { $in: datasetIds } }, { public: true }] }),
          )
        }
      })
  } else {
    // Anonymous request implies public datasets only
    const match = { public: true }
    // Anonymous requests can be cached
    const cachedConnection = cacheDatasetConnection(options)
    return cachedConnection(filter(match))
  }
}

// Files to skip in uploads
const filenameBlacklist = new RegExp(/.DS_Store|Icon\r/)
const pathBlacklist = new RegExp(/^.git|^.gitattributes|^.datalad|^.heudiconv/)
export const testBlacklist = (path, filename) =>
  filenameBlacklist.test(filename) || pathBlacklist.test(path)

/**
 * Add files to a dataset
 */
export const addFile = async (datasetId, path, file) => {
  try {
    const { filename, mimetype, createReadStream, capacitor } = await file
    await expireDraftFiles(datasetId)

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
          method: 'post',
          headers: { 'Content-Type': mimetype },
        },
        err => (err ? reject(err) : resolve(responseFile)),
      )
      // Attach error handler for incoming request and start feeding downstream
      stream
        .on('data', chunk => {
          responseFile.size += chunk.length
        })
        .on('error', err => {
          if (err.constructor.name === 'FileStreamDisconnectUploadError') {
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
    if (err.constructor.name === 'UploadPromiseDisconnectUploadError') {
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
  addFile(datasetId, '', {
    filename,
    mimetype,
    // Mock a stream so we can reuse addFile
    createReadStream: () => {
      const stream = new Readable()
      // eslint-disable-next-line @typescript-eslint/unbound-method
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
    .set('Cookie', generateDataladCookie(config)(user))
    .set('Accept', 'application/json')
    .then(res => {
      gitRef = res.body.ref
      return updateDatasetRevision(datasetId, gitRef).then(() => gitRef)
    })
}

/**
 * Delete an existing file in a dataset
 */
export const deleteFile = (datasetId, path, file, user) => {
  const url = fileUrl(datasetId, path, file.name)
  const filename = getFileName(path, file.name)
  return request
    .del(url)
    .set('Cookie', generateDataladCookie(config)(user))
    .set('Accept', 'application/json')
    .then(() => filename)
}

/**
 * Recursively delete a directory path within a dataset
 */
export const deletePath = (datasetId, path, user) => {
  const url = pathUrl(datasetId, path)
  return request
    .del(url)
    .query({ recursive: true })
    .set('Cookie', generateDataladCookie(config)(user))
    .set('Accept', 'application/json')
    .then(() => encodeFilePath(path))
}

/**
 * Update public state
 */
export const updatePublic = (datasetId, publicFlag) =>
  Dataset.updateOne(
    { id: datasetId },
    { public: publicFlag, publishDate: new Date() },
    { upsert: true },
  ).exec()

export const getDatasetAnalytics = (datasetId, tag) => {
  const datasetQuery = tag
    ? { datasetId: datasetId, tag: tag }
    : { datasetId: datasetId }
  return Analytics.aggregate([
    {
      $match: datasetQuery,
    },
    {
      $group: {
        _id: '$datasetId',
        tag: { $first: '$tag' },
        views: {
          $sum: '$views',
        },
        downloads: {
          $sum: '$downloads',
        },
      },
    },
    {
      $project: {
        _id: 0,
        datasetId: '$_id',
        tag: 1,
        views: 1,
        downloads: 1,
      },
    },
  ]).then(results => {
    results = results.length ? results[0] : {}
    return results
  })
}

export const getStars = datasetId => Star.find({ datasetId })

export const getUserStarred = (datasetId, userId) =>
  Star.count({ datasetId, userId }).exec()

export const getFollowers = datasetId => {
  return Subscription.find({
    datasetId: datasetId,
  }).exec()
}

export const getUserFollowed = (datasetId, userId) =>
  Subscription.findOne({
    datasetId,
    userId,
  }).exec()
