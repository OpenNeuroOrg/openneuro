/**
 * Document the possible cache types
 *
 * Use short names here, particularly for keys with many values
 */
export enum CacheType {
  datasetsConnection = 'connection',
  datasetDescription = 'description',
  commitFiles = 'files',
  partial = 'partial',
  readme = 'readme',
  snapshot = 'snapshot',
  snapshotIndex = 'snapshotIndex',
}
