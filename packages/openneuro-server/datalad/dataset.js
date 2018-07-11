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
import { getAccessionNumber } from '../libs/dataset'
import { updateDatasetRevision, draftPartialKey } from './draft.js'
const c = mongo.collections
const uri = config.datalad.uri

/**
 * Create a new dataset
 *
 * Internally we setup metadata and access
 * then create a new DataLad repo
 *
 * @param {String} label - descriptive label for this dataset
 * @returns {Promise} - resolves to dataset id of the new dataset
 */
export const createDataset = (label, uploader, userInfo) => {
  return new Promise(async (resolve, reject) => {
    const datasetId = await getAccessionNumber()
    const dsObj = await createDatasetModel(datasetId, label, uploader)
    await giveUploaderPermission(datasetId, uploader)
    // If successful, create the repo
    const url = `${uri}/datasets/${datasetId}`
    if (dsObj) {
      const req = request
        .post(url)
        .set('Accept', 'application/json')
        .set('Cookie', generateDataladCookie(config)(userInfo))
      await req
      subscriptions
        .subscribe(datasetId, uploader)
        .then(() => resolve({ id: datasetId, label }))
        .catch(err => reject(err))
      // resolve({ id: datasetId, label })
    } else {
      reject(Error(`Failed to create ${datasetId} - "${label}"`))
    }
  })
}

/**
 * Insert Dataset document
 *
 * Exported for tests.
 */
export const createDatasetModel = (
  id,
  label,
  uploader,
  created = new Date(),
) => {
  const revision = null // Empty repo has no hash yet
  const datasetObj = {
    id,
    label,
    created,
    modified: created,
    uploader,
    revision,
  }
  return c.crn.datasets.insertOne(datasetObj)
}

export const giveUploaderPermission = (id, uploader) => {
  const datasetId = id
  const userId = uploader
  const level = 'admin'
  return c.crn.permissions.insertOne({ datasetId, userId, level })
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
 * Fetch all datasets
 *
 * TODO - Support cursor pagination
 */
export const getDatasets = () => {
  return c.crn.datasets.find().toArray()
}

/**
 * Convert to URL compatible path
 * @param {String} path
 */
export const encodeFilePath = path => {
  return path.replace(new RegExp('/', 'g'), ':')
}

/**
 * Convert to from URL compatible path fo filepath
 * @param {String} path
 */
export const decodeFilePath = path => {
  return path.replace(new RegExp(':', 'g'), '/')
}

/**
 * Generate file URL for DataLad service
 * @param {String} datasetId
 * @param {String} path - Relative path for the file
 * @param {String} filename
 */
const fileUrl = (datasetId, path, filename) => {
  // If path is provided, this is a subdirectory, otherwise a root level file.
  const filePath = path ? [path, filename].join('/') : filename
  const fileName = filename ? encodeFilePath(filePath) : encodeFilePath(path)
  const url = `http://${uri}/datasets/${datasetId}/files/${fileName}`
  return url
}

/**
 * Add files to a dataset
 */
export const addFile = (datasetId, path, file) => {
  // Cannot use superagent 'request' due to inability to post streams
  return new Promise((resolve, reject) =>
    file
      .then(({ filename, stream, mimetype }) => {
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
  ).then(data => {
    return redis.del(draftPartialKey(datasetId)).then(() => data)
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
  }).then(data => {
    return redis.del(draftPartialKey(datasetId)).then(() => data)
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

  // TODO: send request to backend to initiate uplaod to s3 bucket
  // const url = `${uri}/datasets/${datasetId}/updatePublic/${publicFlag}`
  // return request
  //   .post(url)
  //   .set('Accept', 'application/json')
  //   .then(({ body }) => body)
}
