/**
 * Manage serving a Draft object based on DataLad working trees
 */
import Dataset from "../models/dataset"
import {
  assertWorkerResponse,
  discardWorkerResponse,
  getDatasetWorker,
} from "../libs/datalad-service"
import CacheItem, { CacheType } from "../cache/item"
import { getRedis } from "../libs/redis"

// Draft info resolver
type DraftInfo = {
  ref: string
  hexsha: string // Duplicate of ref for backwards compatibility
  tree: string
  message: string
  modified: string
}

export const getDraftRevision = async (datasetId): Promise<string> => {
  const { hexsha } = await getDraftInfo(datasetId)
  return hexsha
}

export const getDraftInfo = async (datasetId) => {
  const cache = new CacheItem(
    getRedis(),
    CacheType.draftRevision,
    [datasetId],
    10,
  )
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
export const resetDraft = async (datasetId, ref) => {
  const resetUrl = `http://${
    getDatasetWorker(
      datasetId,
    )
  }/datasets/${datasetId}/reset/${ref}`
  const response = await fetch(resetUrl, {
    method: "POST",
    headers: { Accept: "application/json" },
  })
  await assertWorkerResponse(
    response,
    `Failed to reset draft for dataset "${datasetId}"`,
  )
  await discardWorkerResponse(response)
}
