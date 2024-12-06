import config from "../../config"
import { generateDataladCookie } from "../../libs/authentication/jwt"
import { getDatasetWorker } from "../../libs/datalad-service"
import Validation from "../../models/validation"
import { redlock } from "../../libs/redis"

/**
 * Issues resolver for schema validator
 */
export const validation = async (dataset, _, { userInfo }) => {
  return Validation.findOne({
    id: dataset.revision,
    datasetId: dataset.id,
  })
    .exec()
    .then((data) => {
      if (!data && userInfo) {
        // If no results were found, acquire a lock and run validation
        revalidate(
          null,
          { datasetId: dataset.id, ref: dataset.revision },
          { userInfo },
        )
      }
      return data
    })
}

/**
 * Snapshot issues resolver for schema validator
 */
export const snapshotValidation = async (snapshot) => {
  const datasetId = snapshot.id.split(":")[0]
  return Validation.findOne({
    id: snapshot.hexsha,
    datasetId,
  })
    .exec()
}

/**
 * Save issues data returned by the datalad service
 *
 * Returns only a boolean if successful or not
 */
export const updateValidation = (obj, args) => {
  return Validation.updateOne(
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
