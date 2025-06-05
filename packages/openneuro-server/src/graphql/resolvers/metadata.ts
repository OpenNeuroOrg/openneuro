import Snapshot from "../../models/snapshot"
import type { FlattenMaps } from "mongoose"
import DatasetModel from "../../models/dataset"
import MetadataModel from "../../models/metadata"
import type { MetadataDocument } from "../../models/metadata"
import { latestSnapshot } from "./snapshots"
import { permissions } from "./permissions"

/**
 * Summary resolver
 *
 * User modified fields are queried from the Metadata model and dynamic metadata is updated from the latest snapshot
 */
export const metadata = async (
  dataset,
  _,
  context,
): Promise<FlattenMaps<MetadataDocument>> => {
  const record = await MetadataModel.findOne({
    datasetId: dataset.id,
  }).lean()
  // Replace dynamic fields with latest available
  const snapshot = await latestSnapshot(dataset, null, context)
  const description = await snapshot.description()
  const summary = await snapshot.summary()
  // Find the users with admin access
  // TODO - This could be a user object that is resolved with the full type instead of just email
  // Email matches the existing records however and the user object would require other changes
  const adminUsers = []
  const { userPermissions } = await permissions(dataset, null, context)
  for (const user of userPermissions) {
    if (user.level === "admin") {
      const userObj = await user.user
      adminUsers.push(userObj.name)
    }
  }
  const firstSnapshot = await Snapshot.find({ datasetId: dataset.id }).sort({
    created: 1,
  })
  const firstSnapshotCreatedAt = firstSnapshot.length
    ? firstSnapshot[0].created
    : null
  return {
    ...record,
    datasetId: dataset.id,
    datasetName: description?.Name,
    tasksCompleted: summary?.tasks || [],
    seniorAuthor: description?.Authors
      ? description.Authors[description.Authors.length - 1]
      : null,
    adminUsers,
    firstSnapshotCreatedAt,
    latestSnapshotCreatedAt: snapshot.created,
    ages: summary?.subjectMetadata?.map((s) => s.age as number),
    modalities: summary?.modalities || [],
    dataProcessed: summary?.dataProcessed || null,
  }
}

/**
 * upserts metadata
 */
export const addMetadata = async (obj, { datasetId, metadata }) => {
  const result = await MetadataModel.findOneAndUpdate({ datasetId }, metadata, {
    new: true,
    upsert: true,
  })
  return result
}

/**
 * Resolve all public datasets and return metadata
 */
export async function publicMetadata(
  _obj,
): Promise<FlattenMaps<MetadataDocument>[]> {
  const datasets = await DatasetModel.find({
    public: true,
  }).lean()
  const dsMetadata: FlattenMaps<MetadataDocument>[] = []
  for (const ds of datasets) {
    dsMetadata.push(await metadata(ds, null, {}))
  }
  return dsMetadata
}
