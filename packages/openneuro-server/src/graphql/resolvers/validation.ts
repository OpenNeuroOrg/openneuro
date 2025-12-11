import config from "../../config"
import { generateDataladCookie } from "../../libs/authentication/jwt"
import { getDatasetWorker } from "../../libs/datalad-service"
import Validation from "../../models/validation"
import { redis, redlock } from "../../libs/redis"
import CacheItem from "../../cache/item"
import { CacheType } from "../../cache/types"

/**
 * Issues resolver for schema validator
 */
export const validation = async (dataset, _, { userInfo }) => {
  const cache = new CacheItem(
    redis,
    CacheType.validation,
    [dataset.id, dataset.revision],
  )
  let validationObject
  const cacheResult = await cache.get((doNotCache) => {
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
        if (data) {
          // Return with errors and warning counts
          validationObject = data.toObject()
          return {
            id: validationObject.id,
            datasetId: validationObject.datasetId,
            errors: data.issues.filter((issue) =>
              issue.severity === "error"
            ).length,
            warnings: data.issues.filter((issue) =>
              issue.severity === "warning"
            ).length,
          }
        } else {
          doNotCache(true)
          return null
        }
      })
  })
  if (!cacheResult) return null
  // Return the cached result along with lazy-loaded issues and codeMessages
  const result = {
    ...cacheResult,
    issues: async () => {
      if (!validationObject) {
        validationObject = (await Validation.findOne({
          id: dataset.revision,
          datasetId: dataset.id,
        }, { issues: 1 }).exec()).toObject()
      }
      return validationObject.issues
    },
    codeMessages: async () => {
      if (!validationObject) {
        validationObject = (await Validation.findOne({
          id: dataset.revision,
          datasetId: dataset.id,
        }, { codeMessages: 1 }).exec()).toObject()
      }
      return validationObject.codeMessages
    },
  }
  return result
}

/**
 * Snapshot issues resolver for schema validator
 */
export const snapshotValidation = async (snapshot, _, context) => {
  const dataset = {
    id: snapshot.id.split(":")[0],
    revision: snapshot.hexsha,
  }
  return validation(dataset, _, context)
}

export function validationSeveritySort(a, b) {
  return a.severity.localeCompare(b.severity)
}

/**
 * Save issues data returned by the datalad service
 *
 * Returns only a boolean if successful or not
 */
export const updateValidation = (obj, args) => {
  // Limit to 50k issues with errors sorted first
  if (args.validation.issues.length > 50000) {
    args.validation.issues.sort(validationSeveritySort)
    args.validation.issues = args.validation.issues.slice(0, 50000)
  }
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
