import * as datalad from '../../datalad/snapshots.js'
import { updateChanges } from '../../datalad/changelog.js'
import { dataset, analytics } from './dataset.js'
import { checkDatasetWrite } from '../permissions.js'
import { readme } from './readme.js'
import { description } from './description.js'
import { summary } from './summary.js'
import { snapshotIssues } from './issues.js'
import SnapshotModel from '../../models/snapshot.js'

export const snapshots = obj => {
  return datalad.getSnapshots(obj.id)
}

export const snapshot = (obj, { datasetId, tag }, context) => {
  return datalad.getSnapshot(datasetId, tag).then(snapshot => ({
    ...snapshot,
    dataset: () => dataset(snapshot, { id: datasetId }, context),
    description: () => description(obj, { datasetId, tag }),
    readme: () => readme(obj, { datasetId, revision: tag }),
    summary: () => summary({ id: datasetId, revision: snapshot.hexsha }),
  }))
}

export const participantCount = async () => {
  const aggregateResult = await SnapshotModel.aggregate([
    { $sort: { created: -1 } },
    {
      $group: {
        _id: { datasetId: '$datasetId' },
        hexsha: { $last: '$hexsha' },
      },
    },
    {
      $lookup: {
        from: 'summaries',
        localField: 'hexsha',
        foreignField: 'id',
        as: 'summary',
      },
    },
    { $project: { subjects: { $size: '$summary.subjects' } } },
    { $group: { _id: null, participantCount: { $sum: '$subjects' } } },
  ]).exec()
  return Array.isArray(aggregateResult)
    ? aggregateResult[0].participantCount
    : aggregateResult
}

const sortSnapshots = (a, b) => new Date(b.created) - new Date(a.created)

export const latestSnapshot = (obj, _, context) => {
  return datalad.getSnapshots(obj.id).then(snapshots => {
    const sortedSnapshots = Array.prototype.sort.call(snapshots, sortSnapshots)
    return snapshot(
      obj,
      { datasetId: obj.id, tag: sortedSnapshots[0].tag },
      context,
    )
  })
}

/**
 * Tag the working tree for a dataset
 */
export const createSnapshot = (
  obj,
  { datasetId, tag, changes },
  { user, userInfo },
) => {
  return checkDatasetWrite(datasetId, user, userInfo).then(async () => {
    await updateChanges(datasetId, tag, changes)
    return datalad.createSnapshot(datasetId, tag, userInfo)
  })
}

/**
 * Remove a tag from a dataset
 */
export const deleteSnapshot = (obj, { datasetId, tag }, { user, userInfo }) => {
  return checkDatasetWrite(datasetId, user, userInfo).then(() => {
    return datalad.deleteSnapshot(datasetId, tag)
  })
}

/**
 * Update the file urls within a snapshot
 */
export const updateSnapshotFileUrls = (obj, { fileUrls }) => {
  const datasetId = fileUrls.datasetId
  const snapshotTag = fileUrls.tag
  const files = fileUrls.files
  return datalad.updateSnapshotFileUrls(datasetId, snapshotTag, files)
}

const Snapshot = {
  analytics: snapshot => analytics(snapshot),
  issues: snapshot => snapshotIssues(snapshot),
}

export default Snapshot
