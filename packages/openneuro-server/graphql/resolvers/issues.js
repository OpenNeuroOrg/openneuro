import mongo from '../../libs/mongo.js'

/**
 * Issues resolver
 */
export const issues = dataset => {
  return mongo.collections.crn.issues
    .findOne({
      id: dataset.revision,
      datasetId: dataset.id,
    })
    .then(data => (data ? data.issues : null))
}

/**
 * Snapshot issues resolver
 */
export const snapshotIssues = snapshot => {
  const datasetId = snapshot.id.split(':')[0]
  return mongo.collections.crn.issues
    .findOne({
      id: snapshot.hexsha,
      datasetId,
    })
    .then(data => (data ? data.issues : null))
}
