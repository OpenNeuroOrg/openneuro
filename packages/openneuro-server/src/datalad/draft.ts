/**
 * Manage serving a Draft object based on DataLad working trees
 */
import request from "superagent"
import Dataset from "../models/dataset"
import { getDatasetWorker } from "../libs/datalad-service"
import CacheItem, { CacheType } from "../cache/item"
import { redis } from "../libs/redis"

// Draft info resolver
type DraftInfo = {
  ref: string
  hexsha: string // Duplicate of ref for backwards compatibility
  tree: string
  message: string
  modified: Date
}

export const getDraftRevision = async (datasetId): Promise<string> => {
  const { hexsha } = await getDraftInfo(datasetId)
  return hexsha
}

export const getDraftInfo = async (datasetId) => {
  const cache = new CacheItem(redis, CacheType.draftRevision, [datasetId], 10)
  return cache.get(async (_doNotCache): Promise<DraftInfo> => {
    const draftUrl = `http://${
      getDatasetWorker(
        datasetId,
      )
    }/datasets/${datasetId}/draft`
    const response = await fetch(draftUrl)
    return await response.json()
  })
}

export const updateDatasetRevision = (datasetId) => {
  /**
   * Update the revision modified time in a draft on changes
   */
  return Dataset.updateOne({ id: datasetId }, { modified: new Date() }).exec()
}

/**
 * Run a git reset on the draft
 * @param {string} datasetId Accession number
 * @param {string} ref Git hexsha
 */
export const resetDraft = (datasetId, ref) => {
  const resetUrl = `${
    getDatasetWorker(
      datasetId,
    )
  }/datasets/${datasetId}/reset/${ref}`
  return request.post(resetUrl).set("Accept", "application/json")
}
