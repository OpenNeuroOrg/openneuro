/**
 * Manage serving a Draft object based on DataLad working trees
 */
import request from "superagent"
import Dataset from "../models/dataset"
import { getDatasetWorker } from "../libs/datalad-service"

export const getDraftRevision = async (datasetId) => {
  const draftUrl = `http://${
    getDatasetWorker(
      datasetId,
    )
  }/datasets/${datasetId}/draft`
  const response = await fetch(draftUrl)
  const { hexsha } = await response.json()
  return hexsha
}

export const updateDatasetRevision = (datasetId, gitRef) => {
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
