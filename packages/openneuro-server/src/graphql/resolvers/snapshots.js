import * as datalad from '../../datalad/snapshots.js'
import { dataset, analytics, snapshotCreationComparison } from './dataset.js'
import { checkDatasetRead, checkDatasetWrite } from '../permissions.js'
import { readme } from './readme.js'
import { description } from './description.js'
import { summary } from './summary.js'
import { snapshotIssues } from './issues.js'
import { getFiles, filterFiles } from '../../datalad/files.js'
import DatasetModel from '../../models/dataset'
import { filterRemovedAnnexObjects } from '../utils/file.js'
import DeprecatedSnapshot from '../../models/deprecatedSnapshot'
import { checkDatasetAdmin } from '../permissions.js'
import SnapshotModel from '../../models/snapshot'
import User from '../../models/user'
import * as Sentry from '@sentry/node'
import { redis } from '../../libs/redis'
import CacheItem, { CacheType } from '../../cache/item'
import { normalizeDOI } from '../../libs/doi/normalize'

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
            .then(filterRemovedAnnexObjects(datasetId, context.userInfo)),
        deprecated: () => deprecated(snapshot),
        related: () => related(datasetId),
      }))
    },
  )
}

export const deprecated = snapshot => {
  return DeprecatedSnapshot.findOne({ id: snapshot.hexsha }).populate('user')
}

/**
 * Search dataset metadeta for related objects and return an array
 * @param {string} datasetId
 */
export const related = async datasetId => {
  const dataset = await DatasetModel.findOne({ id: datasetId }).lean().exec()
  return dataset.related
}

export const matchKnownObjects = desc => {
  if (desc?.ReferencesAndLinks) {
    const objects = []
    for (const item of desc.ReferencesAndLinks) {
      try {
        const rawDOI = normalizeDOI(item)
        // NIMH Data Archive (NDA) 10.15154
        if (rawDOI.startsWith('10.15154')) {
          objects.push({
            id: rawDOI,
            source: 'NDA',
            type: 'dataset',
          })
        } else {
          objects.push({ id: rawDOI })
        }
      } catch (err) {
        continue
      }
    }
    if (objects.length) {
      return objects
    } else {
      return null
    }
  } else {
    return null
  }
}

export const deprecateSnapshot = async (
  obj,
  { datasetId, tag, reason },
  { user, userInfo },
) => {
  try {
    await checkDatasetAdmin(datasetId, user, userInfo)
    const [snapshot, userDoc] = await Promise.all([
      SnapshotModel.findOne({ datasetId, tag }),
      User.findOne({ id: user }),
    ])
    const timestamp = new Date()
    await DeprecatedSnapshot.create({
      id: snapshot.hexsha,
      user: userDoc._id,
      reason,
      timestamp,
    })
    return {
      id: snapshot.hexsha,
      deprecated: {
        id: snapshot.hexsha,
        user: userDoc._id,
        reason,
        timestamp,
      },
    }
  } catch (err) {
    Sentry.captureException(err)
    throw err
  }
}

export const participantCount = (obj, { modality }) => {
  const cache = new CacheItem(
    redis,
    CacheType.participantCount,
    [modality || 'all'],
    3600,
  )
  return cache.get(async () => {
    const queryHasSubjects = {
      'summary.subjects': {
        $exists: true,
      },
    }
    const matchQuery = modality
      ? {
          $and: [
            queryHasSubjects,
            {
              'summary.modalities.0': modality,
            },
          ],
        }
      : queryHasSubjects
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
        $match: matchQuery,
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
    if (aggregateResult.length) return aggregateResult[0].participantCount
    else return 0
  })
}

/**
 * Select the most recent snapshot from an array of snapshots
 * @param {*} snapshots Array of snapshot objects from datalad.getSnapshots
 */
export const filterLatestSnapshot = snapshots => {
  if (snapshots.length) {
    const sortedSnapshots = Array.prototype.sort.call(
      snapshots,
      snapshotCreationComparison,
    )
    return sortedSnapshots[sortedSnapshots.length - 1].tag
  } else {
    return null
  }
}

export const latestSnapshot = async (obj, _, context) => {
  const snapshots = await datalad.getSnapshots(obj.id)
  const snapshotTag = filterLatestSnapshot(snapshots)
  if (snapshotTag) {
    return await snapshot(obj, { datasetId: obj.id, tag: snapshotTag }, context)
  } else {
    // In the case where there are no real snapshots, return HEAD as a snapshot
    return await snapshot(obj, { datasetId: obj.id, tag: 'HEAD' }, context)
  }
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
