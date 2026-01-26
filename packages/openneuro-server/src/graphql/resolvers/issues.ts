import Issue from "../../models/issue"
import { datasetType } from "./datasetType"
import { revalidate } from "./validation.js"

/**
 * Issues resolver
 */
export const issues = async (dataset, _, { userInfo }) => {
  return Issue.findOne({
    id: dataset.revision,
    datasetId: dataset.id,
    // Match if we have no validatorMetadata or the correct 'legacy' / 'schema' value if we do
    $or: [
      { "validatorMetadata.validator": await datasetType(dataset) },
      { validatorMetadata: { $exists: false } },
    ],
  })
    .exec()
    .then((data) => {
      if (!data && userInfo) {
        // If no results were found, request to run validation
        revalidate(
          null,
          { datasetId: dataset.id, ref: dataset.revision },
          { userInfo },
        )
      }
      return data ? data.issues : null
    })
}

/**
 * Snapshot issues resolver
 */
export const snapshotIssues = async (snapshot) => {
  const datasetId = snapshot.id.split(":")[0]
  return Issue.findOne({
    id: snapshot.hexsha,
    datasetId,
    // Match if we have no validatorMetadata or the correct 'legacy' / 'schema' value if we do
    $or: [
      { "validatorMetadata.validator": await datasetType(snapshot) },
      { validatorMetadata: { $exists: false } },
    ],
  })
    .exec()
    .then((data) => (data ? data.issues : null))
}

/**
 * Resolver implementation for legacy validator status summary
 */
export async function issuesStatus(datasetId, version) {
  const data = await Issue.findOne({
    id: version,
    datasetId,
  }).exec()
  if (data) {
    const warnings = data.issues.filter((issue) =>
      issue.severity === "warning"
    ).length
    const errors = data.issues.filter((issue) =>
      issue.severity === "error"
    ).length
    return {
      errors,
      warnings,
    }
  } else {
    return null
  }
}

/**
 * Draft specific issues status resolver
 */
export function issuesDraftStatus(dataset) {
  return issuesStatus(dataset.id, dataset.revision)
}

/**
 * Draft specific issues status resolver
 */
export function issuesSnapshotStatus(snapshot) {
  const datasetId = snapshot.id.split(":")[0]
  return issuesStatus(datasetId, snapshot.hexsha)
}
