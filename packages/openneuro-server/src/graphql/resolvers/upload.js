import Upload from '../../models/upload.js'
import { checkDatasetWrite } from '../permissions.js'
import { generateUploadToken } from '../../libs/authentication/jwt.js'
import { finishUploadRequest } from '../../datalad/upload.js'
import { getDatasetEndpoint } from '../../libs/datalad-service.js'

/**
 * Track initial state for a new upload
 *
 * This allocates a token and stores the list of expected files and sizes allowing for final validation
 * @param {object} obj Parent object or null
 * @param {object} arguments Resolver arguments
 * @param {string} arguments.datasetId Accession number string
 * @param {string} arguments.uploadId Client provided value to identify this upload
 * @param {object} context Resolver context
 * @param {string} context.user User id
 * @param {object} context.userInfo Decoded userInfo from token
 */
export async function prepareUpload(
  obj,
  { datasetId, uploadId },
  { user, userInfo },
) {
  await checkDatasetWrite(datasetId, user, userInfo)
  const upload = await Upload.findOneAndUpdate(
    { datasetId, id: uploadId },
    { datasetId, id: uploadId },
    { new: true, upsert: true, setDefaultsOnInsert: true },
  )
  const token = generateUploadToken(userInfo, datasetId)
  const UploadMetadata = {
    ...upload.toObject(),
    token,
    endpoint: getDatasetEndpoint(datasetId),
  }
  return UploadMetadata
}

/**
 * Complete an upload by committing the files to the dataset and advancing the draft revision pointer
 *
 * Forwards this request to datalad-service
 * @param {object} obj Parent object or null
 * @param {object} arguments Resolver arguments
 * @param {string} arguments.id Upload id to finish (originally returned by prepareUpload)
 * @param {object} context Resolver context
 * @param {string} context.user User id
 * @param {object} context.userInfo Decoded userInfo from token
 */
export async function finishUpload(obj, { uploadId }, { user, userInfo }) {
  const upload = await Upload.findOne({ id: uploadId })
  const datasetId = upload.datasetId
  await checkDatasetWrite(datasetId, user, userInfo)
  await finishUploadRequest(
    datasetId,
    uploadId,
    generateUploadToken(userInfo, datasetId, 600),
  )
  upload.complete = true
  await upload.save()
  return upload.complete
}
