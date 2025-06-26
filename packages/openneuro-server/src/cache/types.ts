/**
 * Document the possible cache types
 *
 * Use short names here, particularly for keys with many values
 */
export enum CacheType {
  datasetsConnection = "connection",
  datasetDescription = "description",
  dataciteYml = "dataciteYml",
  commitFiles = "files",
  readme = "readme",
  snapshot = "snapshot",
  snapshotIndex = "snapshotIndex",
  participantCount = "participantCount",
  snapshotDownload = "download",
  draftRevision = "revision",
  brainInitiative = "brainInitiative",
  validation = "validation",
}
