/**
 * Implementation of dataset models internal to OpenNeuro's database
 *
 * See resolvers for interaction with other data sources.
 */
import request from 'superagent'
import requestNode from 'request'
import objectHash from 'object-hash'
import config from '../config'
import mongo from '../libs/mongo'
import * as subscriptions from '../handlers/subscriptions.js'
import { generateDataladCookie } from '../libs/authentication/jwt'
import { redis } from '../libs/redis.js'
import { updateDatasetRevision, draftPartialKey } from './draft.js'
import { createSnapshot } from './snapshots.js'
import { fileUrl } from './files.js'
import { getAccessionNumber } from '../libs/dataset.js'
import Dataset from '../models/dataset.js'
import Permission from '../models/permission.js'
import Star from '../models/stars.js'
import Analytics from '../models/analytics.js'
import { datasetsConnection } from './pagination.js'
const c = mongo.collections
const uri = config.datalad.uri

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
export const createDataset = async (uploader, userInfo) => {
  // Obtain an accession number
  const datasetId = await getAccessionNumber()
  try {
    const ds = new Dataset({ id: datasetId, uploader })
    await request
      .post(`${uri}/datasets/${datasetId}`)
      .set('Accept', 'application/json')
      .set('Cookie', generateDataladCookie(config)(userInfo))
    // Write the new dataset to mongo after creation
    await ds.save()
    await giveUploaderPermission(datasetId, uploader)
    await subscriptions.subscribe(datasetId, uploader)
    return ds
  } catch (e) {
    // eslint-disable-next-line
    console.error(`Failed to create ${datasetId}`)
    throw e
  }
}

export const giveUploaderPermission = (datasetId, userId) => {
  const permission = new Permission({ datasetId, userId, level: 'admin' })
  return permission.save()
}

/**
 * Fetch dataset document and related fields
 */
export const getDataset = id => Dataset.findOne({ id }).exec()

/**
 * Delete dataset and associated documents
 */
export const deleteDataset = id =>
  request
    .del(`${uri}/datasets/${id}`)
    .then(() => Dataset.deleteOne({ id }).exec())

/**
 * For public datasets, cache combinations of sorts/limits/cursors to speed responses
 * @param {object} options getDatasets options object
 */
export const cacheDatasetConnection = options => connectionArguments => {
  const connection = datasetsConnection(options)
  const redisKey = `openneuro:datasetsConnection:${objectHash(options)}`
  const expirationTime = 60
  return redis.get(redisKey).then(data => {
    if (data) {
      return JSON.parse(data)
    } else {
      return connection(connectionArguments).then(connection => {
        redis.setex(redisKey, expirationTime, JSON.stringify(connection))
        return connection
      })
    }
  })
}

/**
 * Add any filter steps based on the filterBy options provided
 * @param {object} options GraphQL query parameters
 * @returns {(match: object) => array} Array of aggregate stages
 */
export const datasetsFilter = options => match => {
  const aggregates = [{ $match: match }]
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
    if ('incomplete' in filters && filters.incomplete) {
      filterMatch.revision = null
    }
    if ('userId' in options && 'shared' in filters && filters.shared) {
      filterMatch.uploader = { $ne: options.userId }
    }
    if ('invalid' in filters && filters.invalid) {
      // SELECT * FROM datasets JOIN issues ON datasets.revision = issues.id WHERE ...
      aggregates.push({
        $lookup: {
          from: 'issues',
          let: { revision: '$revision' },
          pipeline: [
            { $unwind: '$issues' },
            {
              $match: {
                $expr: {
                  $and: [
                    { $eq: ['$id', '$$revision'] }, // JOIN CONSTRAINT
                    { $eq: ['$issues.severity', 'error'] }, // WHERE severity = 'error'
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
    return c.crn.permissions
      .find({ userId: options.userId })
      .toArray()
      .then(datasetsAllowed => {
        const datasetIds = datasetsAllowed.map(
          permission => permission.datasetId,
        )
        // Match accessible datasets
        const match = { id: { $in: datasetIds } }
        return connection(filter(match))
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
const blacklist = ['.DS_Store', 'Icon\r', '.git', '.gitattributes', '.datalad']

/**
 * Add files to a dataset
 */
export const addFile = (datasetId, path, file) => {
  // Cannot use superagent 'request' due to inability to post streams
  return new Promise((resolve, reject) =>
    file
      .then(({ filename, stream, mimetype }) => {
        // Skip any blacklisted files
        if (blacklist.includes(filename)) {
          return resolve()
        }
        stream
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
          .pipe(
            requestNode(
              {
                url: fileUrl(datasetId, path, filename),
                method: 'post',
                headers: { 'Content-Type': mimetype },
              },
              err => (err ? reject(err) : resolve()),
            ),
          )
      })
      .catch(err => {
        if (err.constructor.name === 'UploadPromiseDisconnectUploadError') {
          // Catch client aborts silently
        } else {
          // Raise other errors
          throw err
        }
      }),
  ).finally(() => {
    return redis.del(draftPartialKey(datasetId))
  })
}

/**
 * Update an existing file in a dataset
 */
export const updateFile = (datasetId, path, file) => {
  // Cannot use superagent 'request' due to inability to post streams
  return new Promise(async (resolve, reject) => {
    const { filename, stream, mimetype } = await file
    stream
      .pipe(
        requestNode(
          {
            url: fileUrl(datasetId, path, filename),
            method: 'put',
            headers: { 'Content-Type': mimetype },
          },
          err => (err ? reject(err) : resolve()),
        ),
      )
      .on('error', err => reject(err))
  }).finally(() => {
    return redis.del(draftPartialKey(datasetId))
  })
}

/**
 * Commit a draft
 */
export const commitFiles = (datasetId, user) => {
  const url = `${uri}/datasets/${datasetId}/draft`
  const req = request
    .post(url)
    .set('Cookie', generateDataladCookie(config)(user))
    .set('Accept', 'application/json')
    .then(res => {
      return res.body.ref
    })
    .then(updateDatasetRevision(datasetId))
    .then(() =>
      // Check if this is the first data commit and no snapshots exist
      c.crn.snapshots.findOne({ datasetId }).then(snapshot => {
        if (!snapshot) {
          return createSnapshot(datasetId, '1.0.0', user)
        }
      }),
    )
  return req
}

/**
 * Delete an existing file in a dataset
 */
export const deleteFile = (datasetId, path, file) => {
  // Cannot use superagent 'request' due to inability to post streams
  let url = fileUrl(datasetId, path, file.name)
  return request.del(url)
}

/**
 * Update public state
 */
export const updatePublic = (datasetId, publicFlag) =>
  Dataset.updateOne(
    { id: datasetId },
    { $set: { public: publicFlag } },
    { upsert: true },
  ).exec()

export const getDatasetAnalytics = (datasetId, tag) => {
  let datasetQuery = tag
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

export const trackAnalytics = (datasetId, tag, type) => {
  return c.crn.analytics.updateOne(
    {
      datasetId: datasetId,
      tag: tag,
    },
    {
      $inc: {
        [type]: 1,
      },
    },
    {
      upsert: true,
    },
  )
}

export const getStars = datasetId => Star.find({ datasetId })

export const getFollowers = datasetId => {
  return c.crn.subscriptions
    .find({
      datasetId: datasetId,
    })
    .toArray()
}
