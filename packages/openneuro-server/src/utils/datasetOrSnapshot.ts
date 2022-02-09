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
  if ('tag' in obj) {
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
  return snapshotId.split(':')[0]
}
