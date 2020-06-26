import Issue from '../../models/issue'

/**
 * Issues resolver
 */
export const issues = dataset => {
  return Issue.findOne({
    id: dataset.revision,
    datasetId: dataset.id,
  })
    .exec()
    .then(data => (data ? data.issues : null))
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
