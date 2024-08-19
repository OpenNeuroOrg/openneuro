import * as datalad from "../../datalad/snapshots"
import { analytics, dataset, snapshotCreationComparison } from "./dataset.js"
import { onBrainlife } from "./brainlife"
import { checkDatasetRead, checkDatasetWrite } from "../permissions"
import { readme } from "./readme.js"
import { description } from "./description.js"
import { summary } from "./summary"
import { snapshotIssues } from "./issues.js"
import { getFiles } from "../../datalad/files"
import Summary from "../../models/summary"
import DatasetModel from "../../models/dataset"
import { filterRemovedAnnexObjects } from "../utils/file"
import DeprecatedSnapshot from "../../models/deprecatedSnapshot"
import { redis } from "../../libs/redis"
import CacheItem, { CacheType } from "../../cache/item"
import { normalizeDOI } from "../../libs/doi/normalize"
import { getDraftHead } from "../../datalad/dataset"
import { downloadFiles } from "../../datalad/snapshots"

export const snapshots = (obj) => {
  return datalad.getSnapshots(obj.id)
}

export const snapshot = (obj, { datasetId, tag }, context) => {
  return checkDatasetRead(datasetId, context.user, context.userInfo).then(
    () => {
      return datalad.getSnapshot(datasetId, tag).then((snapshot) => ({
        ...snapshot,
        dataset: () => dataset(snapshot, { id: datasetId }, context),
        description: () => description(snapshot),
        readme: () => readme(snapshot),
        summary: () => summary({ id: datasetId, revision: snapshot.hexsha }),
        files: ({ tree }) =>
          getFiles(datasetId, tree || snapshot.hexsha).then(
            filterRemovedAnnexObjects(datasetId, context.userInfo),
          ),
        size: () =>
          Summary.findOne({ datasetId: datasetId, id: snapshot.hexsha })
            .exec()
            .then((res) => res?.toObject()?.size),
        deprecated: () => deprecated({ datasetId, tag }),
        related: () => related(datasetId),
        onBrainlife: () => onBrainlife(snapshot),
        downloadFiles: () => downloadFiles(datasetId, tag),
      }))
    },
  )
}

export const deprecated = ({ datasetId, tag }) => {
  const id = `${datasetId}:${tag}`
  return DeprecatedSnapshot.findOne({ id }).lean().exec()
}

/**
 * Search dataset metadeta for related objects and return an array
 * @param {string} datasetId
 */
export const related = async (datasetId) => {
  const dataset = await DatasetModel.findOne({ id: datasetId }).lean().exec()
  return dataset.related
}

export const matchKnownObjects = (desc) => {
  if (desc?.ReferencesAndLinks) {
    const objects = []
    for (const item of desc.ReferencesAndLinks) {
      try {
        const rawDOI = normalizeDOI(item)
        // NIMH Data Archive (NDA) 10.15154
        if (rawDOI.startsWith("10.15154")) {
          objects.push({
            id: rawDOI,
            source: "NDA",
            type: "dataset",
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
  const id = `${datasetId}:${tag}`
  await checkDatasetWrite(datasetId, user, userInfo)
  const timestamp = new Date()
  await DeprecatedSnapshot.updateOne(
    { id },
    {
      id,
      user,
      reason,
      timestamp,
    },
    { upsert: true },
  )
  return {
    id,
    deprecated: {
      id,
      user,
      reason,
      timestamp,
    },
  }
}

export const undoDeprecateSnapshot = async (
  obj,
  { datasetId, tag },
  { user, userInfo },
) => {
  const id = `${datasetId}:${tag}`
  await checkDatasetWrite(datasetId, user, userInfo)
  await DeprecatedSnapshot.findOneAndDelete({ id })
  return {
    id,
    deprecated: null,
  }
}

export const participantCount = (obj, { modality }) => {
  const cache = new CacheItem(
    redis,
    CacheType.participantCount,
    [modality || "all"],
    3600,
  )
  return cache.get(async () => {
    const queryHasSubjects = {
      "summary.subjects": {
        $exists: true,
      },
    }
    const matchQuery = modality
      ? {
        $and: [
          queryHasSubjects,
          {
            "summary.modalities": modality,
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
          from: "snapshots",
          localField: "id",
          foreignField: "datasetId",
          as: "snapshots",
        },
      },
      {
        $project: {
          id: "$id",
          hexsha: { $arrayElemAt: ["$snapshots.hexsha", -1] },
        },
      },
      {
        $lookup: {
          from: "summaries",
          localField: "hexsha",
          foreignField: "id",
          as: "summary",
        },
      },
      {
        $match: matchQuery,
      },
      {
        $group: {
          _id: null,
          participantCount: {
            $sum: { $size: { $arrayElemAt: ["$summary.subjects", 0] } },
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
export const filterLatestSnapshot = (snapshots) => {
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
    // In the case where there are no real snapshots, return most recent commit as snapshot
    return await snapshot(
      obj,
      { datasetId: obj.id, tag: await getDraftHead(obj.id) },
      context,
    )
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
  analytics: (snapshot) => analytics(snapshot),
  issues: (snapshot) => snapshotIssues(snapshot),
}

export default Snapshot
