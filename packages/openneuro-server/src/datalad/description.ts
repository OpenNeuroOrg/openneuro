/**
 * Get description data from backend
 */
import config from "../config"
import request from "superagent"
import { redis } from "../libs/redis"
import { commitFiles } from "./dataset"
import { fileUrl } from "./files"
import { generateDataladCookie } from "../libs/authentication/jwt"
import { getDatasetWorker } from "../libs/datalad-service"
import CacheItem, { CacheType } from "../cache/item"
import { datasetOrSnapshot } from "../utils/datasetOrSnapshot"

/**
 * Checks if all elements in an array are strings.
 * @param arr The array to check.
 * @returns True if all elements are strings, false otherwise.
 */
const isArrayOfStrings = (arr: unknown): arr is string[] => {
  return Array.isArray(arr) && arr.every((item) => typeof item === "string")
}

/**
 * Find dataset_description.json id and fetch description object
 * @param {string} datasetId
 * @returns {Promise<Record<string, unknown>>} Promise resolving to dataset_description.json contents or defaults
 */
export const getDescriptionObject = async (datasetId, revision) => {
  const res = await fetch(
    fileUrl(datasetId, "", "dataset_description.json", revision),
  )
  const contentType = res.headers.get("content-type")
  if (res.status === 200 && contentType.includes("application/json")) {
    return await res.json()
  } else {
    throw new Error(
      `Backend request failed, dataset_description.json may not exist or may be non-JSON (type: ${contentType}, status: ${res.status})`,
    )
  }
}

export const descriptionCacheKey = (datasetId, revision) => {
  return `openneuro:dataset_description.json:${datasetId}:${revision}`
}

export const repairDescriptionTypes = (description) => {
  const newDescription = { ...description }

  // Define fields that should be arrays of strings
  const arrayStringFields = [
    "Authors",
    "ReferencesAndLinks",
    "Funding",
    "EthicsApprovals",
  ]

  // Repair array types - ensure they are arrays of strings
  for (const field of arrayStringFields) {
    if (Object.hasOwn(description, field)) {
      if (!isArrayOfStrings(description[field])) {
        // Check if the array is corrupted
        if (Array.isArray(description[field])) {
          newDescription[field] = description[field]
            .map((item) => {
              // If item is an object with a 'name' field (DataCite contributor), extract the name.
              if (typeof item === "object" && item !== null && item.name) {
                return String(item.name)
              }
              // Otherwise, attempt to stringify the item
              return String(item)
            })
            .filter((s) => typeof s === "string" && s.trim().length > 0)
        } else {
          // If it's not an array at all (original logic)
          newDescription[field] = []
        }
      }
      // If it is already a valid array of strings, no change is needed.
    }
    // If the field doesn't exist, we don't add it.
  }

  // Define fields that should be strings
  const stringFields = [
    "Name",
    "DatasetDOI",
    "Acknowledgements",
    "HowToAcknowledge",
    "DatasetType",
  ]

  // Repair string types - ensure they are strings
  for (const field of stringFields) {
    if (Object.hasOwn(description, field)) {
      if (typeof description[field] !== "string") {
        // Attempt to stringify non-string types, default to empty string or specific default
        if (field === "DatasetType") {
          newDescription[field] = "raw" // Specific default for DatasetType
        } else {
          try {
            // Use JSON.stringify for complex types, otherwise just convert
            const stringified = typeof description[field] === "object"
              ? JSON.stringify(description[field])
              : String(description[field])
            newDescription[field] = stringified || ""
          } catch (_err) {
            newDescription[field] = "" // Fallback to empty string on error
          }
        }
      }
      // If it's already a string, no change needed.
    }
    // If the field doesn't exist, we don't add it.
  }

  // Ensure BIDSVersion is present if missing (common default)
  if (!Object.hasOwn(newDescription, "BIDSVersion")) {
    newDescription.BIDSVersion = "1.8.0" // Or your desired default BIDS version
  }

  return newDescription
}

/**
 * Return the last author in dataset_description as the senior author if available
 */
export const appendSeniorAuthor = (description) => {
  try {
    const SeniorAuthor = description?.Authors[description.Authors.length - 1]
    return { ...description, SeniorAuthor }
  } catch (_err) {
    return description
  }
}

/**
 * Get a parsed dataset_description.json
 * @param {object} obj dataset or snapshot object
 */
export const description = async (obj) => {
  // Obtain datasetId from Dataset or Snapshot objects
  const { datasetId, revision } = datasetOrSnapshot(obj)
  // Default fallback if dataset_description.json is not valid or missing
  const defaultDescription = {
    Name: datasetId,
    BIDSVersion: "1.8.0",
  }
  const cache = new CacheItem(redis, CacheType.datasetDescription, [
    datasetId,
    revision.substring(0, 7),
  ])
  try {
    const datasetDescription = await cache.get(() => {
      return getDescriptionObject(datasetId, revision).then(
        (uncachedDescription) => ({ id: revision, ...uncachedDescription }),
      )
    })
    return appendSeniorAuthor(repairDescriptionTypes(datasetDescription))
  } catch (_err) {
    return defaultDescription
  }
}

export const setDescription = (datasetId, user, descriptionFieldUpdates) => {
  const url = `${getDatasetWorker(datasetId)}/datasets/${datasetId}/description`
  return request
    .post(url)
    .send({ description_fields: descriptionFieldUpdates })
    .set("Accept", "application/json")
    .set("Cookie", generateDataladCookie(config)(user))
    .then((res) => {
      const description = res.body
      return commitFiles(datasetId, user).then((gitRef) => ({
        id: gitRef,
        ...description,
      }))
    })
}
