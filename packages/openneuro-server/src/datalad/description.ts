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
import yaml from "js-yaml" // <--- ADD THIS IMPORT for js-yaml

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
  // Added optional chaining for contentType here, as it might be null/undefined.
  // This is a small, safe TypeScript improvement that often resolves linting.
  if (res.status === 200 && contentType?.includes("application/json")) {
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
        // If it's not an array of strings (or not an array at all), replace with an empty array
        newDescription[field] = []
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

// --- NEW TEST FUNCTION TO READ AND LOG DATACITE.YML ---
const readAndLogDataciteYml = async (datasetId: string, revision: string) => {
  const dataciteUrl = fileUrl(datasetId, "", "datacite.yml", revision)
  try {
    const res = await fetch(dataciteUrl)
    if (res.status === 200) {
      const text = await res.text()
      try {
        const parsedYaml: Record<string, unknown> = yaml.load(text) as Record<
          string,
          unknown
        >
        console.log(
          `Found and successfully read datacite.yml for dataset ${datasetId} (revision: ${revision}):`,
          parsedYaml,
        )
      } catch (parseErr) {
        console.error(
          `Found datacite.yml for dataset ${datasetId} (revision: ${revision}), but failed to parse it as YAML:`,
          parseErr,
        )
      }
    } else if (res.status === 404) {
      console.log(
        `datacite.yml not found for dataset ${datasetId} (revision: ${revision}).`,
      )
    } else {
      console.warn(
        `Attempted to read datacite.yml for dataset ${datasetId} (revision: ${revision}) and received status ${res.status}.`,
      )
    }
  } catch (fetchErr) {
    console.error(
      `Error fetching datacite.yml for dataset ${datasetId} (revision: ${revision}):`,
      fetchErr,
    )
  }
}
// --- END NEW FUNCTION ---

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

  // --- CALL TEST FNC datacite.yml ---
  await readAndLogDataciteYml(datasetId, revision)
  // --- END CALL TEST FNC ---

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
