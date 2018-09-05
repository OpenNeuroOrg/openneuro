/**
 * Hexsha files cache
 */
export const commitFilesKey = (datasetId, revision) => {
  return `openneuro:draftFiles:${datasetId}:${revision}`
}
