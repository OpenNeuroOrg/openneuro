import * as datalad from '../../datalad/snapshots.js'
import { dataset, analytics } from './dataset.js'
import { checkDatasetRead, checkDatasetWrite } from '../permissions.js'
import { readme } from './readme.js'
import { description } from './description.js'
import { summary } from './summary.js'
import { snapshotIssues } from './issues.js'
import { getFiles, filterFiles } from '../../datalad/files.js'
import DatasetModel from '../../models/dataset'
import { filterRemovedAnnexObjects } from '../utils/file.js'

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
          getFiles(datasetId, snapshot.hexsha)
            .then(filterFiles(prefix))
            .then(filterRemovedAnnexObjects(datasetId)),
      }))
    },
  )
}

export const participantCount = async () => {
  const aggregateResult = await DatasetModel.aggregate([
    {
      $match: {
        public: true,
      },
    },
    {
      $lookup: {
        from: 'snapshots',
        localField: 'id',
        foreignField: 'datasetId',
        as: 'snapshots',
      },
    },
    {
      $project: {
        id: '$id',
        hexsha: { $arrayElemAt: ['$snapshots.hexsha', -1] },
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
        'summary.subjects': {
          $exists: true,
        },
      },
    },
    {
      $group: {
        _id: null,
        participantCount: {
          $sum: { $size: { $arrayElemAt: ['$summary.subjects', 0] } },
        },
      },
    },
  ]).exec()
  return Array.isArray(aggregateResult)
    ? aggregateResult[0].participantCount
    : null
}

const sortSnapshots = (a, b) =>
  new Date(b.created).getTime() - new Date(a.created).getTime()

export const latestSnapshot = (obj, _, context) => {
  return datalad.getSnapshots(obj.id).then(snapshots => {
    if (snapshots.length) {
      const sortedSnapshots = Array.prototype.sort.call(
        snapshots,
        sortSnapshots,
      )
      return snapshot(
        obj,
        { datasetId: obj.id, tag: sortedSnapshots[0].tag },
        context,
      )
    } else {
      // In the case where there are no real snapshots, return HEAD as a snapshot
      return snapshot(obj, { datasetId: obj.id, tag: 'HEAD' }, context)
    }
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
