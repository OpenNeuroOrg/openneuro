import { getDraftRevision } from "../datalad/draft"

export interface HasId {
  id: string
  revision: string
}

export interface HasSnapshotId {
  id: string
  tag: string
  hexsha?: string
}

export interface DatasetRevisionReference {
  datasetId: string
  revision: string
}

export type DatasetOrSnapshot = HasId | HasSnapshotId

/**
 * Helper for resolvers with dataset and snapshot parents
 * @param {object} obj A snapshot or dataset parent object
 */
export function datasetOrSnapshot(
  obj: DatasetOrSnapshot,
): DatasetRevisionReference {
  if ("tag" in obj) {
    return {
      datasetId: getDatasetFromSnapshotId(obj.id),
      revision: obj.hexsha || obj.tag,
    }
  } else {
    return { datasetId: obj.id, revision: obj.revision }
  }
}

/**
 * @param snapshotId 'ds000001:1.0.0' style snapshot ID
 * @returns {string} Dataset id portion 'ds000001'
 */
export function getDatasetFromSnapshotId(snapshotId: string): string {
  return snapshotId.split(":")[0]
}

/**
 * Resolve a dataset or snapshot to a dataset ID and a concrete draft hexsha (if revision is HEAD or missing)
 * @param {DatasetOrSnapshot} obj A snapshot or dataset parent object
 */
export async function resolveCommit(
  obj: DatasetOrSnapshot,
): Promise<DatasetRevisionReference> {
  let { datasetId, revision } = datasetOrSnapshot(obj)
  revision = await revision
  if (!revision || revision === "HEAD") {
    revision = await getDraftRevision(datasetId)
  }
  return { datasetId, revision }
}
