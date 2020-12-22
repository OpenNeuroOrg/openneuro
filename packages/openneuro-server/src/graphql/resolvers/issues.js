import Issue from '../../models/issue'
import { revalidate } from './validation.js'

/**
 * Issues resolver
 */
export const issues = (dataset, _, { userInfo }) => {
  return Issue.findOne({
    id: dataset.revision,
    datasetId: dataset.id,
  })
    .exec()
    .then(data => {
      if (!data && userInfo) {
        // If no results were found, acquire a lock and run validation
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
export const snapshotIssues = snapshot => {
  const datasetId = snapshot.id.split(':')[0]
  return Issue.findOne({
    id: snapshot.hexsha,
    datasetId,
  })
    .exec()
    .then(data => (data ? data.issues : null))
}
