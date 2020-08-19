import * as datalad from '../../datalad/snapshots.js'
import { dataset, analytics } from './dataset.js'
import { checkDatasetRead, checkDatasetWrite } from '../permissions.js'
import { readme } from './readme.js'
import { description } from './description.js'
import { summary } from './summary.js'
import { snapshotIssues } from './issues.js'
import { getFiles, filterFiles } from '../../datalad/files.js'
import SnapshotModel from '../../models/snapshot.js'

export const snapshots = obj => {
  return datalad.getSnapshots(obj.id)
}

export const snapshot = (obj, { datasetId, tag }, context) => {
  return checkDatasetRead(datasetId, context.user, context.userInfo).then(
    () => {
      return datalad.getSnapshot(datasetId, tag).then(snapshot => ({
        ...snapshot,
        dataset: () => dataset(snapshot, { id: datasetId }, context),
        description: () => description(snapshot),
        readme: () => readme(snapshot),
        summary: () => summary({ id: datasetId, revision: snapshot.hexsha }),
        files: ({ prefix }) =>
          getFiles(datasetId, snapshot.hexsha).then(filterFiles(prefix)),
      }))
    },
  )
}

export const participantCount = async () => {
  const aggregateResult = await SnapshotModel.aggregate([
    {
      $lookup: {
        from: 'datasets',
        localField: 'datasetId',
        foreignField: 'id',
        as: 'dataset',
      },
    },
    {
      $match: {
        'dataset.public': true,
      },
    },
    {
      $sort: {
        created: 1,
      },
    },
    {
      $group: {
        _id: {
          datasetId: '$datasetId',
        },
        hexsha: {
          $last: '$hexsha',
        },
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
    {
      $match: {
        hexsha: {
          $ne: null,
        },
        'summary.subjects': {
          $exists: true,
        },
      },
    },
    {
      $project: {
        subjects: {
          $size: {
            $arrayElemAt: ['$summary.subjects', 0],
          },
        },
      },
    },
    {
      $group: {
        _id: null,
        participantCount: {
          $sum: '$subjects',
        },
      },
    },
  ]).exec()
  return Array.isArray(aggregateResult)
    ? aggregateResult[0].participantCount
    : null
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
    return datalad.createSnapshot(datasetId, tag, userInfo, {}, changes)
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

const Snapshot = {
  analytics: snapshot => analytics(snapshot),
  issues: snapshot => snapshotIssues(snapshot),
}

export default Snapshot
