import fetch from 'node-fetch'
import config from '../../config'
import { generateDataladCookie } from '../../libs/authentication/jwt'
import { getDatasetWorker } from '../../libs/datalad-service'
import Issue from '../../models/issue'
import publishDraftUpdate from '../utils/publish-draft-update.js'

/**
 * Save issues data returned by the datalad service
 *
 * Returns only a boolean if successful or not
 */
export const updateValidation = (obj, args) => {
  return Issue.updateOne(
    { id: args.validation.id, datasetId: args.validation.datasetId },
    args.validation,
    {
      upsert: true,
    },
  )
    .exec()
    .then(() => {
      publishDraftUpdate(args.validation.datasetId, args.validation.id)
      return true
    })
}

export const validationUrl = (datasetId, ref) => {
  return `http://${getDatasetWorker(
    datasetId,
  )}/datasets/${datasetId}/validate/${ref}`
}

/**
 * Request revalidation for a given commit
 * @param {object} obj Parent resolver
 * @param {object} args
 * @param {string} args.datasetId Dataset accession number
 * @param {string} args.ref Git hexsha
 */
export const revalidate = async (obj, { datasetId, ref }, { userInfo }) => {
  const response = await fetch(validationUrl(datasetId, ref), {
    method: 'POST',
    body: JSON.stringify({}),
    headers: {
      cookie: generateDataladCookie(config)(userInfo),
    },
  })
  if (response.status === 200) {
    return true
  } else {
    return false
  }
}
