import config from "../../config"
import { generateDataladCookie } from "../../libs/authentication/jwt"
import { getDatasetWorker } from "../../libs/datalad-service"
import Issue from "../../models/issue"
import { redlock } from "../../libs/redis"

/**
 * Save issues data returned by the datalad service
 *
 * Returns only a boolean if successful or not
 */
export const updateValidation = (obj, args) => {
  return Issue.updateOne(
    {
      id: args.validation.id,
      datasetId: args.validation.datasetId,
      validatorMetadata: args.validation.validatorMetadata,
    },
    args.validation,
    {
      upsert: true,
    },
  )
    .exec()
    .then(() => true)
}

export const validationUrl = (datasetId, ref) => {
  return `http://${
    getDatasetWorker(
      datasetId,
    )
  }/datasets/${datasetId}/validate/${ref}`
}

/**
 * Request revalidation for a given commit
 * @param {object} obj Parent resolver
 * @param {object} args
 * @param {string} args.datasetId Dataset accession number
 * @param {string} args.ref Git hexsha
 */
export const revalidate = async (obj, { datasetId, ref }, { userInfo }) => {
  try {
    // Lock for five minutes to avoid stacking up multiple validation requests
    await redlock.lock(`openneuro:revalidate-lock:${datasetId}:${ref}`, 300000)
    const response = await fetch(validationUrl(datasetId, ref), {
      method: "POST",
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
  } catch (err) {
    // Backend unavailable or lock failed
    if (err) {
      return false
    }
  }
}
