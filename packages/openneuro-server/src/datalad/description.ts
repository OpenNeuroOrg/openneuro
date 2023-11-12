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
  // Array types
  if (
    description.hasOwnProperty("Authors") &&
    !Array.isArray(description.Authors)
  ) {
    newDescription.Authors = [description.Authors]
  }
  if (
    description.hasOwnProperty("ReferencesAndLinks") &&
    !Array.isArray(description.ReferencesAndLinks)
  ) {
    newDescription.ReferencesAndLinks = [description.ReferencesAndLinks]
  }
  if (
    description.hasOwnProperty("Funding") &&
    !Array.isArray(description.Funding)
  ) {
    newDescription.Funding = [description.Funding]
  }
  if (
    description.hasOwnProperty("EthicsApprovals") &&
    !Array.isArray(description.EthicsApprovals)
  ) {
    newDescription.EthicsApprovals = [description.EthicsApprovals]
  }
  // String types
  if (
    description.hasOwnProperty("Name") &&
    typeof description.Name !== "string"
  ) {
    newDescription.Name = JSON.stringify(description.Name) || ""
  }
  if (
    description.hasOwnProperty("DatasetDOI") &&
    typeof description.DatasetDOI !== "string"
  ) {
    newDescription.DatasetDOI = JSON.stringify(description.DatasetDOI) || ""
  }
  if (
    description.hasOwnProperty("Acknowledgements") &&
    typeof description.Acknowledgements !== "string"
  ) {
    newDescription.Acknowledgements =
      JSON.stringify(description.Acknowledgements) || ""
  }
  if (
    description.hasOwnProperty("HowToAcknowledge") &&
    typeof description.HowToAcknowledge !== "string"
  ) {
    newDescription.HowToAcknowledge =
      JSON.stringify(description.HowToAcknowledge) || ""
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
  } catch (err) {
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
  } catch (err) {
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
