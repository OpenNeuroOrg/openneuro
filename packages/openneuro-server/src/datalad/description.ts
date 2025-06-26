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
import yaml from "js-yaml"

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
export const getDatasetDescriptionJson = async (datasetId, revision) => {
  const res = await fetch(
    fileUrl(datasetId, "", "dataset_description.json", revision),
  )
  const contentType = res.headers.get("content-type")
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

// --- FUNCTION TO READ AND PARSE DATACITE.YML ---
/**
 * Attempts to read and parse datacite.yml.
 * @param {string} datasetId
 * @param {string} revision
 * @returns {Promise<Record<string, unknown> | null>}
 */
export const getDataciteYml = async (
  datasetId: string,
  revision: string,
): Promise<Record<string, unknown> | null> => {
  const dataciteUrl = fileUrl(datasetId, "", "datacite.yml", revision)
  try {
    const res = await fetch(dataciteUrl)
    // const contentType = res.headers.get("content-type") // is something in datalad setting content-type header to json??

    if (
      res.status ===
        200 /* && (contentType?.includes("application/yaml") || contentType?.includes("text/yaml")) */
    ) {
      const text = await res.text()
      try {
        const parsedYaml: Record<string, unknown> = yaml.load(text) as Record<
          string,
          unknown
        >
        return parsedYaml
      } catch (parseErr) {
        throw new Error(
          `Found datacite.yml for dataset ${datasetId} (revision: ${revision}), but failed to parse it as YAML:`,
          { cause: parseErr },
        )
      }
    } else if (res.status === 404) {
      throw new Error(
        `datacite.yml not found for dataset ${datasetId} (revision: ${revision}).`,
      )
    } else {
      throw new Error(
        `Attempted to read datacite.yml for dataset ${datasetId} (revision: ${revision}) and received status ${res.status}.`,
      )
    }
  } catch (fetchErr) {
    throw new Error(
      `Error fetching datacite.yml for dataset ${datasetId} (revision: ${revision}):`,
      { cause: fetchErr },
    )
  }
}
// --- END FUNCTION ---

/**
 * Get a parsed dataset_description.json or datacite.yml
 * @param {object} obj dataset or snapshot object
 */
export const description = async (obj) => {
  const { datasetId, revision } = datasetOrSnapshot(obj)
  const revisionSubString = revision.substring(0, 7)

  const defaultDescription = {
    Name: datasetId,
    BIDSVersion: "1.8.0",
  }

  let descriptionLoadedFromFile: Record<string, unknown> | null = null
  // --- Caching for datacite.yml ---
  const dataciteCache = new CacheItem(redis, CacheType.dataciteYml, [
    datasetId,
    revisionSubString,
  ])

  try {
    // Try to get description from datacite.yml first, using its cache
    const dataciteData = await dataciteCache.get(() => {
      return getDataciteYml(datasetId, revision)
    })

    if (dataciteData) {
      descriptionLoadedFromFile = { id: revision, ...dataciteData }
      console.log(
        `Loaded description from datacite.yml for ${datasetId}:${revision}`,
      )
    }
  } catch (error) {
    console.warn(
      `Could not load datacite.yml for ${datasetId}:${revision}, falling back to dataset_description.json. Error:`,
      error.message,
    )
  }

  // If datacite.yml wasn't found or had an error, try dataset_description.json
  if (!descriptionLoadedFromFile) {
    const descriptionJsonCache = new CacheItem(
      redis,
      CacheType.datasetDescription,
      [datasetId, revisionSubString],
    )
    try {
      // Use the cache for dataset_description.json
      const datasetDescriptionJson = await descriptionJsonCache.get(() => {
        return getDatasetDescriptionJson(datasetId, revision).then(
          (uncachedDescription) => ({ id: revision, ...uncachedDescription }),
        )
      })
      descriptionLoadedFromFile = datasetDescriptionJson
      console.log(
        `Loaded description from dataset_description.json for ${datasetId}:${revision}`,
      )
    } catch (error) {
      console.error(
        `Could not load dataset_description.json for ${datasetId}:${revision}. Error:`,
        error.message,
      )
      // If both fail, descriptionLoadedFromFile remains null, leading to defaultDescription
    }
  }

  if (descriptionLoadedFromFile) {
    return appendSeniorAuthor(repairDescriptionTypes(descriptionLoadedFromFile))
  } else {
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
