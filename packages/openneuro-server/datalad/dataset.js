/**
 * Implementation of dataset models internal to OpenNeuro's database
 *
 * See resolvers for interaction with other data sources.
 */
import request from 'superagent'
import requestNode from 'request'
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
import { cursorTo } from 'readline'
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
export const getDataset = id => {
  return c.crn.datasets.findOne({ id })
}

/**
 * Delete dataset and associated documents
 */
export const deleteDataset = id => {
  let deleteURI = `${uri}/datasets/${id}`
  return new Promise((resolve, reject) => {
    request.del(deleteURI).then(() => {
      c.crn.datasets
        .deleteOne({ id })
        .then(() => resolve())
        .catch(err => reject(err))
    })
  })
}

/**
 * Takes an API sort request and converts it to MongoDB
 * @param {object} sortOptions {created: 'ascending'}
 * @returns {object} Mongo suitable sort arguments {created: 1}
 */
export const enumToMongoSort = sortOptions =>
  Object.keys(sortOptions).reduce((mongoSort, val) => {
    mongoSort[val] = sortOptions[val] === 'ascending' ? 1 : -1
    return mongoSort
  }, {})

/**
 * Encode a cursor offset in a mongodb collection
 * @param {string} id Object _id
 */
const apiCursor = id => {
  return Buffer.from(id.toString()).toString('hex')
}

const applyCursorToEdges = edges =>
  edges.map(edge => ({ cursor: apiCursor(edge._id), node: edge }))

/**
 * Dataset pagination wrapper
 * @param {object} query MongoDB query to apply pagination to
 * @param {number} limit The number of results
 */
export const datasetsConnection = (query, limit) => {
  // Wait for the limited query to finish
  return query()
    .limit(limit)
    .then(datasets => ({
      edges: applyCursorToEdges(datasets),
      pageInfo: {
        // True if there are no results before this
        hasPreviousPage: () => isFirst(query, datasets[0]),
        // First ordered object id in the limited set
        startCursor: apiCursor(datasets[0]._id),
        // True if there are no results after this
        hasNextPage: () => isLast(query, datasets.slice(-1).pop()),
        // Last ordered object id in the limited set
        endCursor: apiCursor(datasets.slice(-1).pop()._id),
      },
    }))
}

// Helper for public datasets
const getPublicDatasets = () => {
  return Dataset.find({ public: true })
}

// Check if this is the first element in the full query
const isFirst = (query, first) => {
  return query()
    .limit(1)
    .then(r => r._id === first._id)
}

// Check if this is the last element in the full query
const isLast = (query, last) => {
  return query()
    .limit(1)
    .then(r => r._id === last._id)
}

/**
 * Fetch all datasets
 */
export const getDatasets = options => {
  // Limit to options.first or 100 datasets
  const limit = Math.min(options.first, 100)
  if (options && 'public' in options && options.public) {
    // If only public datasets are requested, immediately return them
    return datasetsConnection(getPublicDatasets, limit)
  } else if (options && 'admin' in options && options.admin) {
    // Admins can see all datasets
    return datasetsConnection(() => Dataset.find(), limit)
  } else if (options && 'userId' in options) {
    return c.crn.permissions
      .find({ userId: options.userId })
      .toArray()
      .then(datasetsAllowed => {
        const datasetIds = datasetsAllowed.map(
          permission => permission.datasetId,
        )
        return datasetsConnection(
          () =>
            Dataset.find({
              $or: [{ id: { $in: datasetIds } }, { public: true }],
            }),
          limit,
        )
      })
  } else {
    // If no permissions, anonymous requests always get public datasets
    return datasetsConnection(getPublicDatasets, limit)
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
export const updatePublic = (datasetId, publicFlag) => {
  // update mongo
  return c.crn.datasets.updateOne(
    { id: datasetId },
    { $set: { public: publicFlag } },
    { upsert: true },
  )
}

export const getDatasetAnalytics = (datasetId, tag) => {
  return new Promise((resolve, reject) => {
    let datasetQuery = tag
      ? { datasetId: datasetId, tag: tag }
      : { datasetId: datasetId }
    c.crn.analytics
      .aggregate([
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
      ])
      .toArray((err, results) => {
        if (err) {
          return reject(err)
        }
        results = results.length ? results[0] : {}
        return resolve(results)
      })
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

export const getStars = datasetId => {
  return c.crn.stars
    .find({
      datasetId: datasetId,
    })
    .toArray()
}

export const getFollowers = datasetId => {
  return c.crn.subscriptions
    .find({
      datasetId: datasetId,
    })
    .toArray()
}
