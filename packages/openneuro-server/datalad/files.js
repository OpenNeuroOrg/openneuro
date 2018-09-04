/**
 * Hexsha files cache
 */
export const commitFilesKey = (datasetId, revision) => {
  return `openneuro:commitFiles:${datasetId}:${revision}`
}
