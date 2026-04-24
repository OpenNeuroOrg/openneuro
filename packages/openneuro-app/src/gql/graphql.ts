/* eslint-disable */
import type { TypedDocumentNode as DocumentNode } from "@graphql-typed-document-node/core"
export type Maybe<T> = T | null
export type InputMaybe<T> = T | null | undefined
export type Exact<T extends { [key: string]: unknown }> = {
  [K in keyof T]: T[K]
}
export type MakeOptional<T, K extends keyof T> =
  & Omit<T, K>
  & { [SubKey in K]?: Maybe<T[SubKey]> }
export type MakeMaybe<T, K extends keyof T> =
  & Omit<T, K>
  & { [SubKey in K]: Maybe<T[SubKey]> }
export type MakeEmpty<T extends { [key: string]: unknown }, K extends keyof T> =
  { [_ in K]?: never }
export type Incremental<T> =
  | T
  | {
    [P in keyof T]?: P extends " $fragmentName" | "__typename" ? T[P] : never
  }
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: { input: string; output: string }
  String: { input: string; output: string }
  Boolean: { input: boolean; output: boolean }
  Int: { input: number; output: number }
  Float: { input: number; output: number }
  /** The `BigInt` scalar type represents non-fractional signed whole numeric values. BigInt can represent values between -(2^53) + 1 and 2^53 - 1.  */
  BigInt: { input: number; output: number }
  /** A date string, such as 2007-12-03, compliant with the `full-date` format outlined in section 5.6 of the RFC 3339 profile of the ISO 8601 standard for representation of dates and times using the Gregorian calendar. */
  Date: { input: string; output: string }
  /** A date-time string at UTC, such as 2007-12-03T10:15:30Z, compliant with the `date-time` format outlined in section 5.6 of the RFC 3339 profile of the ISO 8601 standard for representation of dates and times using the Gregorian calendar. */
  DateTime: { input: string; output: string }
  /** The `JSON` scalar type represents JSON values as specified by [ECMA-404](http://www.ecma-international.org/publications/files/ECMA-ST/ECMA-404.pdf). */
  JSON: { input: unknown; output: unknown }
}

/** Analytics for a dataset */
export type Analytic = {
  __typename?: "Analytic"
  datasetId: Scalars["ID"]["output"]
  downloads?: Maybe<Scalars["Int"]["output"]>
  tag?: Maybe<Scalars["String"]["output"]>
  views?: Maybe<Scalars["Int"]["output"]>
}

export enum AnalyticTypes {
  Downloads = "downloads",
  Views = "views",
}

export type AnnexFsck = {
  __typename?: "AnnexFsck"
  command?: Maybe<Scalars["String"]["output"]>
  errorMessages?: Maybe<Array<Maybe<Scalars["String"]["output"]>>>
  file?: Maybe<Scalars["String"]["output"]>
  key?: Maybe<Scalars["String"]["output"]>
  note?: Maybe<Scalars["String"]["output"]>
  success?: Maybe<Scalars["Boolean"]["output"]>
}

export type AnnexFsckInput = {
  command?: InputMaybe<Scalars["String"]["input"]>
  dead?: InputMaybe<Array<Scalars["String"]["input"]>>
  errorMessages?: InputMaybe<Array<Scalars["String"]["input"]>>
  file?: InputMaybe<Scalars["String"]["input"]>
  input?: InputMaybe<Array<Scalars["String"]["input"]>>
  key?: InputMaybe<Scalars["String"]["input"]>
  missing?: InputMaybe<Array<Scalars["String"]["input"]>>
  note?: InputMaybe<Scalars["String"]["input"]>
  success?: InputMaybe<Scalars["Boolean"]["input"]>
  untrusted?: InputMaybe<Array<Scalars["String"]["input"]>>
}

export type Comment = {
  __typename?: "Comment"
  createDate: Scalars["DateTime"]["output"]
  id: Scalars["ID"]["output"]
  parent?: Maybe<Comment>
  replies?: Maybe<Array<Maybe<Comment>>>
  text: Scalars["String"]["output"]
  user?: Maybe<User>
}

/** Defines the Contributor type in contributors.ts */
export type Contributor = {
  __typename?: "Contributor"
  contributorType: Scalars["String"]["output"]
  familyName?: Maybe<Scalars["String"]["output"]>
  givenName?: Maybe<Scalars["String"]["output"]>
  name: Scalars["String"]["output"]
  orcid?: Maybe<Scalars["String"]["output"]>
  order?: Maybe<Scalars["Int"]["output"]>
}

export type ContributorInput = {
  contributorType?: InputMaybe<Scalars["String"]["input"]>
  familyName?: InputMaybe<Scalars["String"]["input"]>
  givenName?: InputMaybe<Scalars["String"]["input"]>
  name?: InputMaybe<Scalars["String"]["input"]>
  orcid?: InputMaybe<Scalars["String"]["input"]>
  order?: InputMaybe<Scalars["Int"]["input"]>
}

export type Dataset = {
  __typename?: "Dataset"
  analytics?: Maybe<Analytic>
  brainInitiative?: Maybe<Scalars["Boolean"]["output"]>
  comments?: Maybe<Array<Maybe<Comment>>>
  created: Scalars["DateTime"]["output"]
  derivatives?: Maybe<Array<Maybe<DatasetDerivatives>>>
  draft?: Maybe<Draft>
  events?: Maybe<Array<Maybe<DatasetEvent>>>
  followers?: Maybe<Array<Maybe<Follower>>>
  following?: Maybe<Scalars["Boolean"]["output"]>
  history?: Maybe<Array<Maybe<DatasetCommit>>>
  holdDeletion?: Maybe<Scalars["Boolean"]["output"]>
  id: Scalars["ID"]["output"]
  latestSnapshot: Snapshot
  metadata?: Maybe<Metadata>
  name?: Maybe<Scalars["String"]["output"]>
  onBrainlife?: Maybe<Scalars["Boolean"]["output"]>
  permissions?: Maybe<DatasetPermissions>
  public?: Maybe<Scalars["Boolean"]["output"]>
  publishDate?: Maybe<Scalars["DateTime"]["output"]>
  reviewers?: Maybe<Array<Maybe<DatasetReviewer>>>
  snapshots?: Maybe<Array<Maybe<Snapshot>>>
  starred?: Maybe<Scalars["Boolean"]["output"]>
  stars?: Maybe<Array<Maybe<Star>>>
  uploader?: Maybe<User>
  worker?: Maybe<Scalars["String"]["output"]>
}

export type DatasetCommit = {
  __typename?: "DatasetCommit"
  authorEmail?: Maybe<Scalars["String"]["output"]>
  authorName?: Maybe<Scalars["String"]["output"]>
  date?: Maybe<Scalars["DateTime"]["output"]>
  deletions?: Maybe<Scalars["Int"]["output"]>
  files?: Maybe<Array<Maybe<DiffFiles>>>
  filesChanged?: Maybe<Scalars["Int"]["output"]>
  id: Scalars["ID"]["output"]
  insertions?: Maybe<Scalars["Int"]["output"]>
  message?: Maybe<Scalars["String"]["output"]>
  references?: Maybe<Scalars["String"]["output"]>
}

export type DatasetConnection = {
  __typename?: "DatasetConnection"
  edges?: Maybe<Array<Maybe<DatasetEdge>>>
  pageInfo: PageInfo
}

export type DatasetDerivatives = {
  __typename?: "DatasetDerivatives"
  dataladUrl?: Maybe<Scalars["String"]["output"]>
  local?: Maybe<Scalars["Boolean"]["output"]>
  name?: Maybe<Scalars["String"]["output"]>
  s3Url?: Maybe<Scalars["String"]["output"]>
}

export type DatasetEdge = {
  __typename?: "DatasetEdge"
  cursor: Scalars["String"]["output"]
  id: Scalars["String"]["output"]
  node: Dataset
}

export type DatasetEvent = {
  __typename?: "DatasetEvent"
  datasetId?: Maybe<Scalars["ID"]["output"]>
  event?: Maybe<DatasetEventDescription>
  hasBeenRespondedTo?: Maybe<Scalars["Boolean"]["output"]>
  id?: Maybe<Scalars["ID"]["output"]>
  note?: Maybe<Scalars["String"]["output"]>
  notificationStatus?: Maybe<UserNotificationStatus>
  responseStatus?: Maybe<ResponseStatusType>
  success?: Maybe<Scalars["Boolean"]["output"]>
  timestamp?: Maybe<Scalars["DateTime"]["output"]>
  user?: Maybe<User>
}

export type DatasetEventDescription = {
  __typename?: "DatasetEventDescription"
  contributorData?: Maybe<Contributor>
  datasetId?: Maybe<Scalars["ID"]["output"]>
  level?: Maybe<Scalars["String"]["output"]>
  message?: Maybe<Scalars["String"]["output"]>
  public?: Maybe<Scalars["Boolean"]["output"]>
  reason?: Maybe<Scalars["String"]["output"]>
  ref?: Maybe<Scalars["String"]["output"]>
  requestId?: Maybe<Scalars["ID"]["output"]>
  resolutionStatus?: Maybe<ResponseStatusType>
  target?: Maybe<User>
  targetUserId?: Maybe<Scalars["ID"]["output"]>
  type?: Maybe<Scalars["String"]["output"]>
  version?: Maybe<Scalars["String"]["output"]>
}

/** File metadata and link to contents */
export type DatasetFile = {
  __typename?: "DatasetFile"
  annexed?: Maybe<Scalars["Boolean"]["output"]>
  directory?: Maybe<Scalars["Boolean"]["output"]>
  filename: Scalars["String"]["output"]
  id: Scalars["ID"]["output"]
  size?: Maybe<Scalars["BigInt"]["output"]>
  urls?: Maybe<Array<Maybe<Scalars["String"]["output"]>>>
}

export type DatasetFilter = {
  /** Return all datasets, ignores any other constraints but not sorts */
  all?: InputMaybe<Scalars["Boolean"]["input"]>
  /** Return only datasets with an invalid Draft */
  invalid?: InputMaybe<Scalars["Boolean"]["input"]>
  /** Limit to datasets available publicly */
  public?: InputMaybe<Scalars["Boolean"]["input"]>
  /** Return only datasets that are shared with the user */
  shared?: InputMaybe<Scalars["Boolean"]["input"]>
  /** Return only datasets starred by the query user */
  starred?: InputMaybe<Scalars["Boolean"]["input"]>
}

export type DatasetPermissions = {
  __typename?: "DatasetPermissions"
  id: Scalars["ID"]["output"]
  userPermissions?: Maybe<Array<Maybe<Permission>>>
}

/** Anonymous dataset reviewer */
export type DatasetReviewer = {
  __typename?: "DatasetReviewer"
  datasetId: Scalars["ID"]["output"]
  expiration?: Maybe<Scalars["DateTime"]["output"]>
  id: Scalars["ID"]["output"]
  url: Scalars["String"]["output"]
}

/** Search input for advanced dataset search */
export type DatasetSearchInput = {
  ageRange?: InputMaybe<Array<InputMaybe<Scalars["Int"]["input"]>>>
  authors?: InputMaybe<Array<Scalars["String"]["input"]>>
  bidsDatasetType?: InputMaybe<Scalars["String"]["input"]>
  bodyParts?: InputMaybe<Array<Scalars["String"]["input"]>>
  brainInitiative?: InputMaybe<Scalars["Boolean"]["input"]>
  dateRange?: InputMaybe<Scalars["String"]["input"]>
  diagnosis?: InputMaybe<Scalars["String"]["input"]>
  keywords?: InputMaybe<Array<Scalars["String"]["input"]>>
  modality?: InputMaybe<Scalars["String"]["input"]>
  /** Filter to only public datasets */
  publicOnly?: InputMaybe<Scalars["Boolean"]["input"]>
  scannerManufacturers?: InputMaybe<Array<Scalars["String"]["input"]>>
  scannerManufacturersModelNames?: InputMaybe<Array<Scalars["String"]["input"]>>
  sex?: InputMaybe<Scalars["String"]["input"]>
  sortBy?: InputMaybe<SearchSortOption>
  species?: InputMaybe<Scalars["String"]["input"]>
  studyDomains?: InputMaybe<Array<Scalars["String"]["input"]>>
  studyStructure?: InputMaybe<Scalars["String"]["input"]>
  subjectCountRange?: InputMaybe<Array<InputMaybe<Scalars["Int"]["input"]>>>
  tasks?: InputMaybe<Array<Scalars["String"]["input"]>>
  tracerNames?: InputMaybe<Array<Scalars["String"]["input"]>>
  tracerRadionuclides?: InputMaybe<Array<Scalars["String"]["input"]>>
  /** Filter datasets by a specific user's permissions */
  userId?: InputMaybe<Scalars["String"]["input"]>
}

export type DatasetSort = {
  created?: InputMaybe<SortOrdering>
  downloads?: InputMaybe<SortOrdering>
  name?: InputMaybe<SortOrdering>
  publishDate?: InputMaybe<SortOrdering>
  stars?: InputMaybe<SortOrdering>
  subscriptions?: InputMaybe<SortOrdering>
  uploader?: InputMaybe<SortOrdering>
  views?: InputMaybe<SortOrdering>
}

export type DatasetValidation = {
  __typename?: "DatasetValidation"
  codeMessages?: Maybe<Array<Maybe<ValidatorCodeMessage>>>
  datasetId?: Maybe<Scalars["String"]["output"]>
  errors?: Maybe<Scalars["Int"]["output"]>
  id?: Maybe<Scalars["String"]["output"]>
  issues?: Maybe<Array<Maybe<ValidatorIssue>>>
  warnings?: Maybe<Scalars["Int"]["output"]>
}

export type DeleteFile = {
  filename?: InputMaybe<Scalars["String"]["input"]>
  path: Scalars["String"]["input"]
}

/** Set on snapshots that have been deprecated */
export type DeprecatedSnapshot = {
  __typename?: "DeprecatedSnapshot"
  id: Scalars["ID"]["output"]
  reason?: Maybe<Scalars["String"]["output"]>
  timestamp?: Maybe<Scalars["Date"]["output"]>
  user?: Maybe<Scalars["String"]["output"]>
}

/** Contents of dataset_description.json */
export type Description = {
  __typename?: "Description"
  Acknowledgements?: Maybe<Scalars["String"]["output"]>
  Authors?: Maybe<Array<Maybe<Scalars["String"]["output"]>>>
  BIDSVersion: Scalars["String"]["output"]
  DatasetDOI?: Maybe<Scalars["String"]["output"]>
  DatasetType?: Maybe<Scalars["String"]["output"]>
  EthicsApprovals?: Maybe<Array<Maybe<Scalars["String"]["output"]>>>
  Funding?: Maybe<Array<Maybe<Scalars["String"]["output"]>>>
  HowToAcknowledge?: Maybe<Scalars["String"]["output"]>
  License?: Maybe<Scalars["String"]["output"]>
  Name: Scalars["String"]["output"]
  ReferencesAndLinks?: Maybe<Array<Maybe<Scalars["String"]["output"]>>>
  SeniorAuthor?: Maybe<Scalars["String"]["output"]>
  id: Scalars["ID"]["output"]
}

export type DiffFiles = {
  __typename?: "DiffFiles"
  binary?: Maybe<Scalars["Boolean"]["output"]>
  mode?: Maybe<Scalars["Int"]["output"]>
  new?: Maybe<Scalars["String"]["output"]>
  old?: Maybe<Scalars["String"]["output"]>
  status?: Maybe<Scalars["String"]["output"]>
}

export type Draft = {
  __typename?: "Draft"
  contributors?: Maybe<Array<Maybe<Contributor>>>
  dataset?: Maybe<Dataset>
  description?: Maybe<Description>
  fileCheck?: Maybe<FileCheck>
  files?: Maybe<Array<Maybe<DatasetFile>>>
  head?: Maybe<Scalars["String"]["output"]>
  id?: Maybe<Scalars["ID"]["output"]>
  issues?: Maybe<Array<Maybe<ValidationIssue>>>
  issuesStatus?: Maybe<ValidationIssueStatus>
  modified?: Maybe<Scalars["DateTime"]["output"]>
  readme?: Maybe<Scalars["String"]["output"]>
  size?: Maybe<Scalars["BigInt"]["output"]>
  summary?: Maybe<Summary>
  uploads?: Maybe<Array<Maybe<UploadMetadata>>>
  validation?: Maybe<DatasetValidation>
}

export type DraftFilesArgs = {
  recursive?: InputMaybe<Scalars["Boolean"]["input"]>
  tree?: InputMaybe<Scalars["String"]["input"]>
}

export type FileCheck = {
  __typename?: "FileCheck"
  annexFsck?: Maybe<Array<AnnexFsck>>
  datasetId: Scalars["String"]["output"]
  hexsha: Scalars["String"]["output"]
  refs: Array<Scalars["String"]["output"]>
  remote?: Maybe<Scalars["String"]["output"]>
}

/** An annexed file that has been flagged for removal. */
export type FlaggedFile = {
  __typename?: "FlaggedFile"
  annexKey?: Maybe<Scalars["String"]["output"]>
  createdAt?: Maybe<Scalars["DateTime"]["output"]>
  datasetId?: Maybe<Scalars["String"]["output"]>
  filepath?: Maybe<Scalars["String"]["output"]>
  flagged?: Maybe<Scalars["Boolean"]["output"]>
  flagger?: Maybe<User>
  removed?: Maybe<Scalars["Boolean"]["output"]>
  remover?: Maybe<User>
  snapshot?: Maybe<Scalars["String"]["output"]>
}

export type FollowDatasetResponse = {
  __typename?: "FollowDatasetResponse"
  following?: Maybe<Scalars["Boolean"]["output"]>
  newFollower?: Maybe<Follower>
}

/** Dataset Followers */
export type Follower = {
  __typename?: "Follower"
  datasetId?: Maybe<Scalars["String"]["output"]>
  userId?: Maybe<Scalars["String"]["output"]>
}

/** Dataset Metadata */
export type Metadata = {
  __typename?: "Metadata"
  adminUsers?: Maybe<Array<Maybe<Scalars["String"]["output"]>>>
  affirmedConsent?: Maybe<Scalars["Boolean"]["output"]>
  affirmedDefaced?: Maybe<Scalars["Boolean"]["output"]>
  ages?: Maybe<Array<Maybe<Scalars["Float"]["output"]>>>
  associatedPaperDOI?: Maybe<Scalars["String"]["output"]>
  dataProcessed?: Maybe<Scalars["Boolean"]["output"]>
  datasetId: Scalars["ID"]["output"]
  datasetName?: Maybe<Scalars["String"]["output"]>
  datasetUrl?: Maybe<Scalars["String"]["output"]>
  dxStatus?: Maybe<Scalars["String"]["output"]>
  firstSnapshotCreatedAt?: Maybe<Scalars["DateTime"]["output"]>
  grantFunderName?: Maybe<Scalars["String"]["output"]>
  grantIdentifier?: Maybe<Scalars["String"]["output"]>
  latestSnapshotCreatedAt?: Maybe<Scalars["DateTime"]["output"]>
  modalities?: Maybe<Array<Maybe<Scalars["String"]["output"]>>>
  openneuroPaperDOI?: Maybe<Scalars["String"]["output"]>
  seniorAuthor?: Maybe<Scalars["String"]["output"]>
  species?: Maybe<Scalars["String"]["output"]>
  studyDesign?: Maybe<Scalars["String"]["output"]>
  studyDomain?: Maybe<Scalars["String"]["output"]>
  studyLongitudinal?: Maybe<Scalars["String"]["output"]>
  tasksCompleted?: Maybe<Array<Maybe<Scalars["String"]["output"]>>>
  trialCount?: Maybe<Scalars["Int"]["output"]>
}

export type MetadataInput = {
  adminUsers?: InputMaybe<Array<Scalars["String"]["input"]>>
  affirmedConsent?: InputMaybe<Scalars["Boolean"]["input"]>
  affirmedDefaced?: InputMaybe<Scalars["Boolean"]["input"]>
  ages?: InputMaybe<Array<Scalars["Float"]["input"]>>
  associatedPaperDOI?: InputMaybe<Scalars["String"]["input"]>
  dataProcessed?: InputMaybe<Scalars["Boolean"]["input"]>
  datasetId: Scalars["ID"]["input"]
  datasetName?: InputMaybe<Scalars["String"]["input"]>
  datasetUrl?: InputMaybe<Scalars["String"]["input"]>
  dxStatus?: InputMaybe<Scalars["String"]["input"]>
  firstSnapshotCreatedAt?: InputMaybe<Scalars["DateTime"]["input"]>
  grantFunderName?: InputMaybe<Scalars["String"]["input"]>
  grantIdentifier?: InputMaybe<Scalars["String"]["input"]>
  latestSnapshotCreatedAt?: InputMaybe<Scalars["DateTime"]["input"]>
  modalities?: InputMaybe<Array<Scalars["String"]["input"]>>
  openneuroPaperDOI?: InputMaybe<Scalars["String"]["input"]>
  seniorAuthor?: InputMaybe<Scalars["String"]["input"]>
  species?: InputMaybe<Scalars["String"]["input"]>
  studyDesign?: InputMaybe<Scalars["String"]["input"]>
  studyDomain?: InputMaybe<Scalars["String"]["input"]>
  studyLongitudinal?: InputMaybe<Scalars["String"]["input"]>
  tasksCompleted?: InputMaybe<Array<Scalars["String"]["input"]>>
  trialCount?: InputMaybe<Scalars["Int"]["input"]>
}

export type Mutation = {
  __typename?: "Mutation"
  addComment?: Maybe<Scalars["ID"]["output"]>
  addMetadata?: Maybe<Metadata>
  cacheClear?: Maybe<Scalars["Boolean"]["output"]>
  createContributorCitationEvent?: Maybe<DatasetEvent>
  createContributorRequestEvent?: Maybe<DatasetEvent>
  createDataset?: Maybe<Dataset>
  createGitEvent?: Maybe<DatasetEvent>
  createRelation?: Maybe<Dataset>
  createReviewer?: Maybe<DatasetReviewer>
  createSnapshot?: Maybe<Snapshot>
  deleteComment?: Maybe<Array<Maybe<Scalars["String"]["output"]>>>
  deleteDataset?: Maybe<Scalars["Boolean"]["output"]>
  deleteFiles?: Maybe<Scalars["Boolean"]["output"]>
  deleteRelation?: Maybe<Dataset>
  deleteReviewer?: Maybe<DatasetReviewer>
  deleteSnapshot: Scalars["Boolean"]["output"]
  deprecateSnapshot?: Maybe<Snapshot>
  editComment?: Maybe<Scalars["Boolean"]["output"]>
  finishImportRemoteDataset?: Maybe<Scalars["Boolean"]["output"]>
  finishUpload?: Maybe<Scalars["Boolean"]["output"]>
  flagAnnexObject?: Maybe<Scalars["Boolean"]["output"]>
  followDataset?: Maybe<FollowDatasetResponse>
  fsckDataset?: Maybe<Scalars["Boolean"]["output"]>
  holdDeletion?: Maybe<Scalars["Boolean"]["output"]>
  importRemoteDataset?: Maybe<Scalars["ID"]["output"]>
  prepareRepoAccess?: Maybe<RepoMetadata>
  prepareUpload?: Maybe<UploadMetadata>
  processContributorCitation?: Maybe<DatasetEvent>
  processContributorRequest?: Maybe<DatasetEvent>
  publishDataset?: Maybe<Scalars["Boolean"]["output"]>
  reexportRemotes?: Maybe<Scalars["Boolean"]["output"]>
  removeAnnexObject?: Maybe<Scalars["Boolean"]["output"]>
  removePermissions?: Maybe<Scalars["Boolean"]["output"]>
  removeUser?: Maybe<Scalars["Boolean"]["output"]>
  resetDraft?: Maybe<Scalars["Boolean"]["output"]>
  revalidate?: Maybe<Scalars["Boolean"]["output"]>
  saveAdminNote?: Maybe<DatasetEvent>
  setAdmin?: Maybe<User>
  setBlocked?: Maybe<User>
  starDataset?: Maybe<StarDatasetResponse>
  subscribeToNewsletter?: Maybe<Scalars["Boolean"]["output"]>
  trackAnalytics?: Maybe<Scalars["Boolean"]["output"]>
  undoDeprecateSnapshot?: Maybe<Snapshot>
  updateContributors: UpdateContributorsPayload
  updateDescription?: Maybe<Description>
  updateDescriptionList?: Maybe<Description>
  updateEventStatus?: Maybe<UserNotificationStatus>
  updateFileCheck?: Maybe<FileCheck>
  updateOrcidPermissions?: Maybe<DatasetPermissions>
  updatePermissions?: Maybe<DatasetPermissions>
  updatePublic: Scalars["Boolean"]["output"]
  updateReadme?: Maybe<Scalars["Boolean"]["output"]>
  updateSummary?: Maybe<Summary>
  updateUser?: Maybe<User>
  updateValidation?: Maybe<Scalars["Boolean"]["output"]>
  updateWorkerTask?: Maybe<WorkerTask>
}

export type MutationAddCommentArgs = {
  comment: Scalars["String"]["input"]
  datasetId: Scalars["ID"]["input"]
  parentId?: InputMaybe<Scalars["ID"]["input"]>
}

export type MutationAddMetadataArgs = {
  datasetId: Scalars["ID"]["input"]
  metadata: MetadataInput
}

export type MutationCacheClearArgs = {
  datasetId: Scalars["ID"]["input"]
}

export type MutationCreateContributorCitationEventArgs = {
  contributorData: ContributorInput
  datasetId: Scalars["ID"]["input"]
  targetUserId: Scalars["ID"]["input"]
}

export type MutationCreateContributorRequestEventArgs = {
  datasetId: Scalars["ID"]["input"]
}

export type MutationCreateDatasetArgs = {
  affirmedConsent?: InputMaybe<Scalars["Boolean"]["input"]>
  affirmedDefaced?: InputMaybe<Scalars["Boolean"]["input"]>
}

export type MutationCreateGitEventArgs = {
  commit: Scalars["String"]["input"]
  datasetId: Scalars["ID"]["input"]
  reference: Scalars["String"]["input"]
}

export type MutationCreateRelationArgs = {
  datasetId: Scalars["ID"]["input"]
  description?: InputMaybe<Scalars["String"]["input"]>
  doi: Scalars["String"]["input"]
  kind: RelatedObjectKind
  relation: RelatedObjectRelation
}

export type MutationCreateReviewerArgs = {
  datasetId: Scalars["ID"]["input"]
}

export type MutationCreateSnapshotArgs = {
  changes?: InputMaybe<Array<Scalars["String"]["input"]>>
  datasetId: Scalars["ID"]["input"]
  tag: Scalars["String"]["input"]
}

export type MutationDeleteCommentArgs = {
  commentId: Scalars["ID"]["input"]
  deleteChildren?: InputMaybe<Scalars["Boolean"]["input"]>
}

export type MutationDeleteDatasetArgs = {
  id: Scalars["ID"]["input"]
  reason?: InputMaybe<Scalars["String"]["input"]>
  redirect?: InputMaybe<Scalars["String"]["input"]>
}

export type MutationDeleteFilesArgs = {
  datasetId: Scalars["ID"]["input"]
  files?: InputMaybe<Array<DeleteFile>>
}

export type MutationDeleteRelationArgs = {
  datasetId: Scalars["ID"]["input"]
  doi: Scalars["String"]["input"]
}

export type MutationDeleteReviewerArgs = {
  datasetId: Scalars["ID"]["input"]
  id: Scalars["ID"]["input"]
}

export type MutationDeleteSnapshotArgs = {
  datasetId: Scalars["ID"]["input"]
  tag: Scalars["String"]["input"]
}

export type MutationDeprecateSnapshotArgs = {
  datasetId: Scalars["ID"]["input"]
  reason: Scalars["String"]["input"]
  tag: Scalars["String"]["input"]
}

export type MutationEditCommentArgs = {
  comment: Scalars["String"]["input"]
  commentId: Scalars["ID"]["input"]
}

export type MutationFinishImportRemoteDatasetArgs = {
  id: Scalars["ID"]["input"]
  message?: InputMaybe<Scalars["String"]["input"]>
  success: Scalars["Boolean"]["input"]
}

export type MutationFinishUploadArgs = {
  uploadId: Scalars["ID"]["input"]
}

export type MutationFlagAnnexObjectArgs = {
  annexKey: Scalars["String"]["input"]
  datasetId: Scalars["ID"]["input"]
  filepath: Scalars["String"]["input"]
  snapshot: Scalars["String"]["input"]
}

export type MutationFollowDatasetArgs = {
  datasetId: Scalars["ID"]["input"]
}

export type MutationFsckDatasetArgs = {
  datasetId: Scalars["ID"]["input"]
}

export type MutationHoldDeletionArgs = {
  datasetId: Scalars["ID"]["input"]
  hold: Scalars["Boolean"]["input"]
}

export type MutationImportRemoteDatasetArgs = {
  datasetId: Scalars["ID"]["input"]
  url: Scalars["String"]["input"]
}

export type MutationPrepareRepoAccessArgs = {
  datasetId: Scalars["ID"]["input"]
}

export type MutationPrepareUploadArgs = {
  datasetId: Scalars["ID"]["input"]
  uploadId: Scalars["ID"]["input"]
}

export type MutationProcessContributorCitationArgs = {
  eventId: Scalars["ID"]["input"]
  status: ResponseStatusType
}

export type MutationProcessContributorRequestArgs = {
  datasetId: Scalars["ID"]["input"]
  reason?: InputMaybe<Scalars["String"]["input"]>
  requestId: Scalars["ID"]["input"]
  resolutionStatus: ResponseStatusType
  targetUserId: Scalars["ID"]["input"]
}

export type MutationPublishDatasetArgs = {
  datasetId: Scalars["ID"]["input"]
}

export type MutationReexportRemotesArgs = {
  datasetId: Scalars["ID"]["input"]
}

export type MutationRemoveAnnexObjectArgs = {
  annexKey: Scalars["String"]["input"]
  datasetId: Scalars["ID"]["input"]
  filename?: InputMaybe<Scalars["String"]["input"]>
  path?: InputMaybe<Scalars["String"]["input"]>
  snapshot: Scalars["String"]["input"]
}

export type MutationRemovePermissionsArgs = {
  datasetId: Scalars["ID"]["input"]
  userId: Scalars["String"]["input"]
}

export type MutationRemoveUserArgs = {
  id: Scalars["ID"]["input"]
}

export type MutationResetDraftArgs = {
  datasetId: Scalars["ID"]["input"]
  ref: Scalars["String"]["input"]
}

export type MutationRevalidateArgs = {
  datasetId: Scalars["ID"]["input"]
  ref: Scalars["String"]["input"]
}

export type MutationSaveAdminNoteArgs = {
  datasetId: Scalars["ID"]["input"]
  id?: InputMaybe<Scalars["ID"]["input"]>
  note: Scalars["String"]["input"]
}

export type MutationSetAdminArgs = {
  admin: Scalars["Boolean"]["input"]
  id: Scalars["ID"]["input"]
}

export type MutationSetBlockedArgs = {
  blocked: Scalars["Boolean"]["input"]
  id: Scalars["ID"]["input"]
}

export type MutationStarDatasetArgs = {
  datasetId: Scalars["ID"]["input"]
}

export type MutationSubscribeToNewsletterArgs = {
  email: Scalars["String"]["input"]
}

export type MutationTrackAnalyticsArgs = {
  datasetId: Scalars["ID"]["input"]
  tag?: InputMaybe<Scalars["String"]["input"]>
  type?: InputMaybe<AnalyticTypes>
}

export type MutationUndoDeprecateSnapshotArgs = {
  datasetId: Scalars["ID"]["input"]
  tag: Scalars["String"]["input"]
}

export type MutationUpdateContributorsArgs = {
  datasetId: Scalars["String"]["input"]
  newContributors: Array<ContributorInput>
}

export type MutationUpdateDescriptionArgs = {
  datasetId: Scalars["ID"]["input"]
  field: Scalars["String"]["input"]
  value: Scalars["String"]["input"]
}

export type MutationUpdateDescriptionListArgs = {
  datasetId: Scalars["ID"]["input"]
  field: Scalars["String"]["input"]
  value?: InputMaybe<Array<Scalars["String"]["input"]>>
}

export type MutationUpdateEventStatusArgs = {
  eventId: Scalars["ID"]["input"]
  status: NotificationStatusType
}

export type MutationUpdateFileCheckArgs = {
  annexFsck: Array<AnnexFsckInput>
  datasetId: Scalars["ID"]["input"]
  hexsha: Scalars["String"]["input"]
  refs: Array<Scalars["String"]["input"]>
  remote?: InputMaybe<Scalars["String"]["input"]>
}

export type MutationUpdateOrcidPermissionsArgs = {
  datasetId: Scalars["ID"]["input"]
  level: Scalars["String"]["input"]
  userOrcid: Scalars["String"]["input"]
}

export type MutationUpdatePermissionsArgs = {
  datasetId: Scalars["ID"]["input"]
  level: Scalars["String"]["input"]
  userEmail: Scalars["String"]["input"]
}

export type MutationUpdatePublicArgs = {
  datasetId: Scalars["ID"]["input"]
  publicFlag: Scalars["Boolean"]["input"]
}

export type MutationUpdateReadmeArgs = {
  datasetId: Scalars["ID"]["input"]
  value: Scalars["String"]["input"]
}

export type MutationUpdateSummaryArgs = {
  summary: SummaryInput
}

export type MutationUpdateUserArgs = {
  id: Scalars["ID"]["input"]
  institution?: InputMaybe<Scalars["String"]["input"]>
  links?: InputMaybe<Array<Scalars["String"]["input"]>>
  location?: InputMaybe<Scalars["String"]["input"]>
  orcidConsent?: InputMaybe<Scalars["Boolean"]["input"]>
}

export type MutationUpdateValidationArgs = {
  validation: ValidatorInput
}

export type MutationUpdateWorkerTaskArgs = {
  args?: InputMaybe<Scalars["JSON"]["input"]>
  error?: InputMaybe<Scalars["String"]["input"]>
  executionTime?: InputMaybe<Scalars["Int"]["input"]>
  finishedAt?: InputMaybe<Scalars["DateTime"]["input"]>
  id: Scalars["ID"]["input"]
  kwargs?: InputMaybe<Scalars["JSON"]["input"]>
  queuedAt?: InputMaybe<Scalars["DateTime"]["input"]>
  startedAt?: InputMaybe<Scalars["DateTime"]["input"]>
  taskName?: InputMaybe<Scalars["String"]["input"]>
  worker?: InputMaybe<Scalars["String"]["input"]>
}

export enum NotificationStatusType {
  Archived = "ARCHIVED",
  Saved = "SAVED",
  Unread = "UNREAD",
}

/** Information for pagination in a connection. */
export type PageInfo = {
  __typename?: "PageInfo"
  count?: Maybe<Scalars["Int"]["output"]>
  endCursor?: Maybe<Scalars["String"]["output"]>
  hasNextPage: Scalars["Boolean"]["output"]
  hasPreviousPage: Scalars["Boolean"]["output"]
  startCursor?: Maybe<Scalars["String"]["output"]>
}

export type Permission = {
  __typename?: "Permission"
  datasetId: Scalars["ID"]["output"]
  level: Scalars["String"]["output"]
  user?: Maybe<User>
  userId: Scalars["String"]["output"]
}

export type Query = {
  __typename?: "Query"
  advancedSearch?: Maybe<DatasetConnection>
  dataset?: Maybe<Dataset>
  datasets?: Maybe<DatasetConnection>
  flaggedFiles?: Maybe<Array<Maybe<FlaggedFile>>>
  orcidConsent?: Maybe<Scalars["Boolean"]["output"]>
  participantCount?: Maybe<Scalars["Int"]["output"]>
  publicMetadata?: Maybe<Array<Maybe<Metadata>>>
  search?: Maybe<DatasetConnection>
  snapshot?: Maybe<Snapshot>
  user?: Maybe<User>
  users: UserList
}

export type QueryAdvancedSearchArgs = {
  after?: InputMaybe<Scalars["String"]["input"]>
  allDatasets?: InputMaybe<Scalars["Boolean"]["input"]>
  datasetStatus?: InputMaybe<Scalars["String"]["input"]>
  datasetType?: InputMaybe<Scalars["String"]["input"]>
  first?: InputMaybe<Scalars["Int"]["input"]>
  query: DatasetSearchInput
}

export type QueryDatasetArgs = {
  id: Scalars["ID"]["input"]
}

export type QueryDatasetsArgs = {
  after?: InputMaybe<Scalars["String"]["input"]>
  before?: InputMaybe<Scalars["String"]["input"]>
  filterBy?: InputMaybe<DatasetFilter>
  first?: InputMaybe<Scalars["Int"]["input"]>
  modality?: InputMaybe<Scalars["String"]["input"]>
  myDatasets?: InputMaybe<Scalars["Boolean"]["input"]>
  orderBy?: InputMaybe<DatasetSort>
}

export type QueryFlaggedFilesArgs = {
  deleted?: InputMaybe<Scalars["Boolean"]["input"]>
  flagged?: InputMaybe<Scalars["Boolean"]["input"]>
}

export type QueryParticipantCountArgs = {
  modality?: InputMaybe<Scalars["String"]["input"]>
}

export type QuerySearchArgs = {
  after?: InputMaybe<Scalars["String"]["input"]>
  first?: InputMaybe<Scalars["Int"]["input"]>
  q: Scalars["String"]["input"]
}

export type QuerySnapshotArgs = {
  datasetId: Scalars["ID"]["input"]
  tag: Scalars["String"]["input"]
}

export type QueryUserArgs = {
  id: Scalars["ID"]["input"]
}

export type QueryUsersArgs = {
  isAdmin?: InputMaybe<Scalars["Boolean"]["input"]>
  isBlocked?: InputMaybe<Scalars["Boolean"]["input"]>
  limit?: InputMaybe<Scalars["Int"]["input"]>
  offset?: InputMaybe<Scalars["Int"]["input"]>
  orderBy?: InputMaybe<Array<UserSortInput>>
  search?: InputMaybe<Scalars["String"]["input"]>
}

/** DOI for an external object */
export type RelatedObject = {
  __typename?: "RelatedObject"
  description?: Maybe<Scalars["String"]["output"]>
  id: Scalars["ID"]["output"]
  kind: RelatedObjectKind
  relation: RelatedObjectRelation
}

/** RelatedObject kind of target object */
export enum RelatedObjectKind {
  Article = "Article",
  Dataset = "Dataset",
}

/** RelatedObject nature of relationship */
export enum RelatedObjectRelation {
  Derivative = "derivative",
  SameAs = "sameAs",
  Source = "source",
}

/** Info needed to access git repositories directly */
export type RepoMetadata = {
  __typename?: "RepoMetadata"
  endpoint?: Maybe<Scalars["Int"]["output"]>
  token?: Maybe<Scalars["String"]["output"]>
}

export enum ResponseStatusType {
  Accepted = "ACCEPTED",
  Denied = "DENIED",
  Pending = "PENDING",
}

/** Sort options for advanced dataset search */
export enum SearchSortOption {
  Activity = "activity",
  LastUpdated = "last_updated",
  NameAsc = "name_asc",
  NameDesc = "name_desc",
  Newest = "newest",
  Oldest = "oldest",
  Relevance = "relevance",
}

export enum Severity {
  Error = "error",
  Warning = "warning",
}

export type Snapshot = {
  __typename?: "Snapshot"
  analytics?: Maybe<Analytic>
  contributors?: Maybe<Array<Maybe<Contributor>>>
  created?: Maybe<Scalars["DateTime"]["output"]>
  dataset: Dataset
  deprecated?: Maybe<DeprecatedSnapshot>
  description?: Maybe<Description>
  files?: Maybe<Array<Maybe<DatasetFile>>>
  hexsha?: Maybe<Scalars["String"]["output"]>
  id: Scalars["ID"]["output"]
  issues?: Maybe<Array<Maybe<ValidationIssue>>>
  issuesStatus?: Maybe<ValidationIssueStatus>
  onBrainlife?: Maybe<Scalars["Boolean"]["output"]>
  readme?: Maybe<Scalars["String"]["output"]>
  related?: Maybe<Array<Maybe<RelatedObject>>>
  size?: Maybe<Scalars["BigInt"]["output"]>
  summary?: Maybe<Summary>
  tag: Scalars["String"]["output"]
  validation?: Maybe<DatasetValidation>
}

export type SnapshotFilesArgs = {
  recursive?: InputMaybe<Scalars["Boolean"]["input"]>
  tree?: InputMaybe<Scalars["String"]["input"]>
}

export enum SortOrdering {
  Ascending = "ascending",
  Descending = "descending",
}

/** Dataset Stars */
export type Star = {
  __typename?: "Star"
  datasetId?: Maybe<Scalars["String"]["output"]>
  userId?: Maybe<Scalars["String"]["output"]>
}

export type StarDatasetResponse = {
  __typename?: "StarDatasetResponse"
  newStar?: Maybe<Star>
  starred?: Maybe<Scalars["Boolean"]["output"]>
}

export type SubjectMetadata = {
  __typename?: "SubjectMetadata"
  age?: Maybe<Scalars["Float"]["output"]>
  group?: Maybe<Scalars["String"]["output"]>
  participantId: Scalars["String"]["output"]
  sex?: Maybe<Scalars["String"]["output"]>
}

export type SubjectMetadataInput = {
  age?: InputMaybe<Scalars["Float"]["input"]>
  group?: InputMaybe<Scalars["String"]["input"]>
  participantId: Scalars["String"]["input"]
  sex?: InputMaybe<Scalars["String"]["input"]>
}

/** Validator summary from bids-validator */
export type Summary = {
  __typename?: "Summary"
  dataProcessed?: Maybe<Scalars["Boolean"]["output"]>
  id: Scalars["ID"]["output"]
  modalities?: Maybe<Array<Maybe<Scalars["String"]["output"]>>>
  pet?: Maybe<SummaryPetFields>
  primaryModality?: Maybe<Scalars["String"]["output"]>
  schemaVersion?: Maybe<Scalars["String"]["output"]>
  secondaryModalities?: Maybe<Array<Maybe<Scalars["String"]["output"]>>>
  sessions?: Maybe<Array<Maybe<Scalars["String"]["output"]>>>
  size: Scalars["BigInt"]["output"]
  subjectMetadata?: Maybe<Array<Maybe<SubjectMetadata>>>
  subjects?: Maybe<Array<Maybe<Scalars["String"]["output"]>>>
  tasks?: Maybe<Array<Maybe<Scalars["String"]["output"]>>>
  totalFiles: Scalars["Int"]["output"]
  validatorMetadata?: Maybe<ValidatorMetadata>
}

export type SummaryInput = {
  dataProcessed?: InputMaybe<Scalars["Boolean"]["input"]>
  dataTypes?: InputMaybe<Array<Scalars["String"]["input"]>>
  datasetId: Scalars["ID"]["input"]
  id: Scalars["ID"]["input"]
  modalities?: InputMaybe<Array<Scalars["String"]["input"]>>
  pet?: InputMaybe<SummaryPetInput>
  schemaVersion?: InputMaybe<Scalars["String"]["input"]>
  secondaryModalities?: InputMaybe<Array<Scalars["String"]["input"]>>
  sessions?: InputMaybe<Array<Scalars["String"]["input"]>>
  size: Scalars["BigInt"]["input"]
  subjectMetadata?: InputMaybe<Array<SubjectMetadataInput>>
  subjects?: InputMaybe<Array<Scalars["String"]["input"]>>
  tasks?: InputMaybe<Array<Scalars["String"]["input"]>>
  totalFiles: Scalars["Int"]["input"]
  validatorMetadata?: InputMaybe<ValidatorMetadataInput>
}

export type SummaryPetFields = {
  __typename?: "SummaryPetFields"
  BodyPart?: Maybe<Array<Maybe<Scalars["String"]["output"]>>>
  ScannerManufacturer?: Maybe<Array<Maybe<Scalars["String"]["output"]>>>
  ScannerManufacturersModelName?: Maybe<
    Array<Maybe<Scalars["String"]["output"]>>
  >
  TracerName?: Maybe<Array<Maybe<Scalars["String"]["output"]>>>
  TracerRadionuclide?: Maybe<Array<Maybe<Scalars["String"]["output"]>>>
}

export type SummaryPetInput = {
  BodyPart?: InputMaybe<Array<Scalars["String"]["input"]>>
  ScannerManufacturer?: InputMaybe<Array<Scalars["String"]["input"]>>
  ScannerManufacturersModelName?: InputMaybe<Array<Scalars["String"]["input"]>>
  TracerName?: InputMaybe<Array<Scalars["String"]["input"]>>
  TracerRadionuclide?: InputMaybe<Array<Scalars["String"]["input"]>>
}

export type UpdateContributorsPayload = {
  __typename?: "UpdateContributorsPayload"
  dataset?: Maybe<Dataset>
  success: Scalars["Boolean"]["output"]
}

/** Client metadata needed to complete an upload */
export type UploadMetadata = {
  __typename?: "UploadMetadata"
  complete: Scalars["Boolean"]["output"]
  datasetId: Scalars["ID"]["output"]
  endpoint?: Maybe<Scalars["Int"]["output"]>
  estimatedSize?: Maybe<Scalars["BigInt"]["output"]>
  id: Scalars["ID"]["output"]
  token?: Maybe<Scalars["String"]["output"]>
}

/** OpenNeuro user records from all providers */
export type User = {
  __typename?: "User"
  admin?: Maybe<Scalars["Boolean"]["output"]>
  avatar?: Maybe<Scalars["String"]["output"]>
  blocked?: Maybe<Scalars["Boolean"]["output"]>
  created: Scalars["DateTime"]["output"]
  email?: Maybe<Scalars["String"]["output"]>
  github?: Maybe<Scalars["String"]["output"]>
  githubSynced?: Maybe<Scalars["Date"]["output"]>
  id?: Maybe<Scalars["ID"]["output"]>
  institution?: Maybe<Scalars["String"]["output"]>
  lastSeen?: Maybe<Scalars["DateTime"]["output"]>
  links?: Maybe<Array<Maybe<Scalars["String"]["output"]>>>
  location?: Maybe<Scalars["String"]["output"]>
  modified?: Maybe<Scalars["DateTime"]["output"]>
  name?: Maybe<Scalars["String"]["output"]>
  notifications?: Maybe<Array<DatasetEvent>>
  orcid?: Maybe<Scalars["String"]["output"]>
  orcidConsent?: Maybe<Scalars["Boolean"]["output"]>
  provider?: Maybe<UserProvider>
}

export type UserList = {
  __typename?: "UserList"
  totalCount: Scalars["Int"]["output"]
  users: Array<User>
}

/** User's notification status */
export type UserNotificationStatus = {
  __typename?: "UserNotificationStatus"
  status: NotificationStatusType
}

/** Which provider a user login comes from */
export enum UserProvider {
  Google = "google",
  Orcid = "orcid",
}

export type UserSortInput = {
  field: Scalars["String"]["input"]
  order?: InputMaybe<SortOrdering>
}

export type ValidationIssue = {
  __typename?: "ValidationIssue"
  additionalFileCount?: Maybe<Scalars["Int"]["output"]>
  code?: Maybe<Scalars["Int"]["output"]>
  files?: Maybe<Array<Maybe<ValidationIssueFile>>>
  helpUrl?: Maybe<Scalars["String"]["output"]>
  key: Scalars["String"]["output"]
  reason: Scalars["String"]["output"]
  severity: Severity
}

export type ValidationIssueFile = {
  __typename?: "ValidationIssueFile"
  character?: Maybe<Scalars["Int"]["output"]>
  code?: Maybe<Scalars["Int"]["output"]>
  evidence?: Maybe<Scalars["String"]["output"]>
  file?: Maybe<ValidationIssueFileDetail>
  helpUrl?: Maybe<Scalars["String"]["output"]>
  key: Scalars["String"]["output"]
  line?: Maybe<Scalars["Int"]["output"]>
  name?: Maybe<Scalars["String"]["output"]>
  path?: Maybe<Scalars["String"]["output"]>
  reason?: Maybe<Scalars["String"]["output"]>
  severity: Severity
}

export type ValidationIssueFileDetail = {
  __typename?: "ValidationIssueFileDetail"
  name?: Maybe<Scalars["String"]["output"]>
  path?: Maybe<Scalars["String"]["output"]>
  relativePath?: Maybe<Scalars["String"]["output"]>
}

/** Legacy validator count of errors and warnings */
export type ValidationIssueStatus = {
  __typename?: "ValidationIssueStatus"
  errors?: Maybe<Scalars["Int"]["output"]>
  warnings?: Maybe<Scalars["Int"]["output"]>
}

export type ValidatorCodeMessage = {
  __typename?: "ValidatorCodeMessage"
  code: Scalars["String"]["output"]
  message: Scalars["String"]["output"]
}

export type ValidatorCodeMessageInput = {
  code: Scalars["String"]["input"]
  message: Scalars["String"]["input"]
}

export type ValidatorInput = {
  codeMessages: Array<ValidatorCodeMessageInput>
  datasetId: Scalars["ID"]["input"]
  id: Scalars["ID"]["input"]
  issues: Array<ValidatorIssueInput>
  validatorMetadata: ValidatorMetadataInput
}

/** BIDS Validator (schema) issues */
export type ValidatorIssue = {
  __typename?: "ValidatorIssue"
  affects?: Maybe<Scalars["String"]["output"]>
  code: Scalars["String"]["output"]
  issueMessage?: Maybe<Scalars["String"]["output"]>
  line?: Maybe<Scalars["Int"]["output"]>
  location?: Maybe<Scalars["String"]["output"]>
  rule?: Maybe<Scalars["String"]["output"]>
  severity?: Maybe<Severity>
  subCode?: Maybe<Scalars["String"]["output"]>
}

export type ValidatorIssueInput = {
  affects?: InputMaybe<Scalars["String"]["input"]>
  code: Scalars["String"]["input"]
  issueMessage?: InputMaybe<Scalars["String"]["input"]>
  line?: InputMaybe<Scalars["Int"]["input"]>
  location?: InputMaybe<Scalars["String"]["input"]>
  rule?: InputMaybe<Scalars["String"]["input"]>
  severity?: InputMaybe<Severity>
  subCode?: InputMaybe<Scalars["String"]["input"]>
}

/** BIDS Validator metadata */
export type ValidatorMetadata = {
  __typename?: "ValidatorMetadata"
  validator?: Maybe<Scalars["String"]["output"]>
  version?: Maybe<Scalars["String"]["output"]>
}

export type ValidatorMetadataInput = {
  validator?: InputMaybe<Scalars["String"]["input"]>
  version?: InputMaybe<Scalars["String"]["input"]>
}

export type WorkerTask = {
  __typename?: "WorkerTask"
  args?: Maybe<Scalars["JSON"]["output"]>
  error?: Maybe<Scalars["String"]["output"]>
  executionTime?: Maybe<Scalars["Int"]["output"]>
  finishedAt?: Maybe<Scalars["DateTime"]["output"]>
  id: Scalars["ID"]["output"]
  kwargs?: Maybe<Scalars["JSON"]["output"]>
  queuedAt?: Maybe<Scalars["DateTime"]["output"]>
  startedAt?: Maybe<Scalars["DateTime"]["output"]>
  taskName?: Maybe<Scalars["String"]["output"]>
  worker?: Maybe<Scalars["String"]["output"]>
}

export type UpdateContributorsMutationVariables = Exact<{
  datasetId: Scalars["String"]["input"]
  newContributors: Array<ContributorInput> | ContributorInput
}>

export type UpdateContributorsMutation = {
  __typename?: "Mutation"
  updateContributors: {
    __typename?: "UpdateContributorsPayload"
    success: boolean
    dataset?: {
      __typename?: "Dataset"
      id: string
      draft?: {
        __typename?: "Draft"
        id?: string | null
        modified?: string | null
        contributors?:
          | Array<
            {
              __typename?: "Contributor"
              name: string
              givenName?: string | null
              familyName?: string | null
              orcid?: string | null
              contributorType: string
              order?: number | null
            } | null
          >
          | null
        files?:
          | Array<
            {
              __typename?: "DatasetFile"
              id: string
              filename: string
              size?: number | null
              annexed?: boolean | null
              urls?: Array<string | null> | null
              directory?: boolean | null
            } | null
          >
          | null
      } | null
    } | null
  }
}

export type DatasetReviewersFragment = {
  __typename?: "Dataset"
  id: string
  reviewers?:
    | Array<
      | {
        __typename?: "DatasetReviewer"
        expiration?: string | null
        id: string
      }
      | null
    >
    | null
}

export type CreateReviewerMutationVariables = Exact<{
  datasetId: Scalars["ID"]["input"]
}>

export type CreateReviewerMutation = {
  __typename?: "Mutation"
  createReviewer?: {
    __typename?: "DatasetReviewer"
    id: string
    datasetId: string
    url: string
    expiration?: string | null
  } | null
}

export type GetDatasetRelationsQueryVariables = Exact<{
  datasetId: Scalars["ID"]["input"]
}>

export type GetDatasetRelationsQuery = {
  __typename?: "Query"
  dataset?: {
    __typename?: "Dataset"
    latestSnapshot: {
      __typename?: "Snapshot"
      tag: string
      related?:
        | Array<
          {
            __typename?: "RelatedObject"
            id: string
            kind: RelatedObjectKind
            relation: RelatedObjectRelation
            description?: string | null
          } | null
        >
        | null
    }
  } | null
}

export type CreateDatasetRelationMutationVariables = Exact<{
  datasetId: Scalars["ID"]["input"]
  doi: Scalars["String"]["input"]
  description: Scalars["String"]["input"]
  kind: RelatedObjectKind
  relation: RelatedObjectRelation
}>

export type CreateDatasetRelationMutation = {
  __typename?: "Mutation"
  createRelation?: { __typename?: "Dataset"; id: string } | null
}

export type DeleteDatasetRelationMutationVariables = Exact<{
  datasetId: Scalars["ID"]["input"]
  doi: Scalars["String"]["input"]
}>

export type DeleteDatasetRelationMutation = {
  __typename?: "Mutation"
  deleteRelation?: { __typename?: "Dataset"; id: string } | null
}

export type DeleteReviewerMutationVariables = Exact<{
  datasetId: Scalars["ID"]["input"]
  id: Scalars["ID"]["input"]
}>

export type DeleteReviewerMutation = {
  __typename?: "Mutation"
  deleteReviewer?: {
    __typename?: "DatasetReviewer"
    id: string
    datasetId: string
  } | null
}

export type DeprecateSnapshotMutationVariables = Exact<{
  datasetId: Scalars["ID"]["input"]
  tag: Scalars["String"]["input"]
  reason: Scalars["String"]["input"]
}>

export type DeprecateSnapshotMutation = {
  __typename?: "Mutation"
  deprecateSnapshot?: {
    __typename?: "Snapshot"
    id: string
    deprecated?:
      | { __typename?: "DeprecatedSnapshot"; reason?: string | null }
      | null
  } | null
}

export type FollowDatasetMutationVariables = Exact<{
  datasetId: Scalars["ID"]["input"]
}>

export type FollowDatasetMutation = {
  __typename?: "Mutation"
  followDataset?: {
    __typename?: "FollowDatasetResponse"
    following?: boolean | null
    newFollower?: { __typename?: "Follower"; userId?: string | null } | null
  } | null
}

export type UserFollowingFragment = {
  __typename?: "Dataset"
  id: string
  following?: boolean | null
}

export type DatasetFollowersFragment = {
  __typename?: "Dataset"
  id: string
  followers?:
    | Array<{ __typename?: "Follower"; userId?: string | null } | null>
    | null
}

export type FsckDatasetMutationVariables = Exact<{
  datasetId: Scalars["ID"]["input"]
}>

export type FsckDatasetMutation = {
  __typename?: "Mutation"
  fsckDataset?: boolean | null
}

export type GetHoldDeletionQueryVariables = Exact<{
  datasetId: Scalars["ID"]["input"]
}>

export type GetHoldDeletionQuery = {
  __typename?: "Query"
  dataset?: {
    __typename?: "Dataset"
    id: string
    holdDeletion?: boolean | null
  } | null
}

export type HoldDeletionMutationVariables = Exact<{
  datasetId: Scalars["ID"]["input"]
  hold: Scalars["Boolean"]["input"]
}>

export type HoldDeletionMutation = {
  __typename?: "Mutation"
  holdDeletion?: boolean | null
}

export type ImportRemoteDatasetMutationVariables = Exact<{
  datasetId: Scalars["ID"]["input"]
  url: Scalars["String"]["input"]
}>

export type ImportRemoteDatasetMutation = {
  __typename?: "Mutation"
  importRemoteDataset?: string | null
}

export type RemovePermissionsMutationVariables = Exact<{
  datasetId: Scalars["ID"]["input"]
  userId: Scalars["String"]["input"]
}>

export type RemovePermissionsMutation = {
  __typename?: "Mutation"
  removePermissions?: boolean | null
}

export type StarDatasetMutationVariables = Exact<{
  datasetId: Scalars["ID"]["input"]
}>

export type StarDatasetMutation = {
  __typename?: "Mutation"
  starDataset?: {
    __typename?: "StarDatasetResponse"
    starred?: boolean | null
    newStar?: { __typename?: "Star"; userId?: string | null } | null
  } | null
}

export type UserStarredFragment = {
  __typename?: "Dataset"
  id: string
  starred?: boolean | null
}

export type DatasetStarsFragment = {
  __typename?: "Dataset"
  id: string
  stars?: Array<{ __typename?: "Star"; userId?: string | null } | null> | null
}

export type UndoDeprecateSnapshotMutationVariables = Exact<{
  datasetId: Scalars["ID"]["input"]
  tag: Scalars["String"]["input"]
}>

export type UndoDeprecateSnapshotMutation = {
  __typename?: "Mutation"
  undoDeprecateSnapshot?: {
    __typename?: "Snapshot"
    id: string
    deprecated?:
      | { __typename?: "DeprecatedSnapshot"; reason?: string | null }
      | null
  } | null
}

export type UpdatePermissionsMutationVariables = Exact<{
  datasetId: Scalars["ID"]["input"]
  userEmail: Scalars["String"]["input"]
  level: Scalars["String"]["input"]
}>

export type UpdatePermissionsMutation = {
  __typename?: "Mutation"
  updatePermissions?: {
    __typename?: "DatasetPermissions"
    id: string
    userPermissions?:
      | Array<
        {
          __typename?: "Permission"
          datasetId: string
          userId: string
          level: string
          user?: {
            __typename?: "User"
            id?: string | null
            email?: string | null
            orcid?: string | null
            name?: string | null
          } | null
        } | null
      >
      | null
  } | null
}

export type UpdateOrcidPermissionsMutationVariables = Exact<{
  datasetId: Scalars["ID"]["input"]
  userOrcid: Scalars["String"]["input"]
  level: Scalars["String"]["input"]
}>

export type UpdateOrcidPermissionsMutation = {
  __typename?: "Mutation"
  updateOrcidPermissions?: {
    __typename?: "DatasetPermissions"
    id: string
    userPermissions?:
      | Array<
        {
          __typename?: "Permission"
          datasetId: string
          userId: string
          level: string
          user?: {
            __typename?: "User"
            id?: string | null
            email?: string | null
            orcid?: string | null
            name?: string | null
          } | null
        } | null
      >
      | null
  } | null
}

export type ParticipantCountQueryVariables = Exact<{
  modality?: InputMaybe<Scalars["String"]["input"]>
}>

export type ParticipantCountQuery = {
  __typename?: "Query"
  participantCount?: number | null
}

export type PublicDatasetCountQueryVariables = Exact<{
  modality?: InputMaybe<Scalars["String"]["input"]>
}>

export type PublicDatasetCountQuery = {
  __typename?: "Query"
  datasets?: {
    __typename?: "DatasetConnection"
    pageInfo: { __typename?: "PageInfo"; count?: number | null }
  } | null
}

export type AdvancedSearchQueryVariables = Exact<{
  query: DatasetSearchInput
  datasetType: Scalars["String"]["input"]
}>

export type AdvancedSearchQuery = {
  __typename?: "Query"
  advancedSearch?: {
    __typename?: "DatasetConnection"
    pageInfo: { __typename?: "PageInfo"; count?: number | null }
  } | null
}

export type SubscribeToNewsletterMutationVariables = Exact<{
  email: Scalars["String"]["input"]
}>

export type SubscribeToNewsletterMutation = {
  __typename?: "Mutation"
  subscribeToNewsletter?: boolean | null
}

export type Top_Viewed_DatasetsQueryVariables = Exact<{ [key: string]: never }>

export type Top_Viewed_DatasetsQuery = {
  __typename?: "Query"
  datasets?: {
    __typename?: "DatasetConnection"
    edges?:
      | Array<
        {
          __typename?: "DatasetEdge"
          node: {
            __typename?: "Dataset"
            id: string
            analytics?:
              | { __typename?: "Analytic"; views?: number | null }
              | null
            latestSnapshot: {
              __typename?: "Snapshot"
              tag: string
              summary?: {
                __typename?: "Summary"
                primaryModality?: string | null
              } | null
              description?: { __typename?: "Description"; Name: string } | null
            }
          }
        } | null
      >
      | null
  } | null
}

export type Recently_Published_DatasetsQueryVariables = Exact<
  { [key: string]: never }
>

export type Recently_Published_DatasetsQuery = {
  __typename?: "Query"
  datasets?: {
    __typename?: "DatasetConnection"
    edges?:
      | Array<
        {
          __typename?: "DatasetEdge"
          node: {
            __typename?: "Dataset"
            id: string
            publishDate?: string | null
            latestSnapshot: {
              __typename?: "Snapshot"
              tag: string
              summary?: {
                __typename?: "Summary"
                primaryModality?: string | null
              } | null
              description?: { __typename?: "Description"; Name: string } | null
            }
          }
        } | null
      >
      | null
  } | null
}

export type UserFieldsFragment = {
  __typename?: "User"
  id?: string | null
  name?: string | null
  admin?: boolean | null
  blocked?: boolean | null
  email?: string | null
  provider?: UserProvider | null
  lastSeen?: string | null
  created: string
  avatar?: string | null
  github?: string | null
  institution?: string | null
  location?: string | null
  modified?: string | null
  orcid?: string | null
}

export type GetUsersQueryVariables = Exact<{
  orderBy?: InputMaybe<Array<UserSortInput> | UserSortInput>
  isAdmin?: InputMaybe<Scalars["Boolean"]["input"]>
  isBlocked?: InputMaybe<Scalars["Boolean"]["input"]>
  search?: InputMaybe<Scalars["String"]["input"]>
  limit?: InputMaybe<Scalars["Int"]["input"]>
  offset?: InputMaybe<Scalars["Int"]["input"]>
}>

export type GetUsersQuery = {
  __typename?: "Query"
  users: {
    __typename?: "UserList"
    totalCount: number
    users: Array<
      {
        __typename?: "User"
        id?: string | null
        name?: string | null
        admin?: boolean | null
        blocked?: boolean | null
        email?: string | null
        provider?: UserProvider | null
        lastSeen?: string | null
        created: string
        avatar?: string | null
        github?: string | null
        institution?: string | null
        location?: string | null
        modified?: string | null
        orcid?: string | null
      }
    >
  }
}

export type SetAdminMutationVariables = Exact<{
  id: Scalars["ID"]["input"]
  admin: Scalars["Boolean"]["input"]
}>

export type SetAdminMutation = {
  __typename?: "Mutation"
  setAdmin?: {
    __typename?: "User"
    id?: string | null
    name?: string | null
    admin?: boolean | null
    blocked?: boolean | null
    email?: string | null
    provider?: UserProvider | null
    lastSeen?: string | null
    created: string
    avatar?: string | null
    github?: string | null
    institution?: string | null
    location?: string | null
    modified?: string | null
    orcid?: string | null
  } | null
}

export type SetBlockedMutationVariables = Exact<{
  id: Scalars["ID"]["input"]
  blocked: Scalars["Boolean"]["input"]
}>

export type SetBlockedMutation = {
  __typename?: "Mutation"
  setBlocked?: {
    __typename?: "User"
    id?: string | null
    name?: string | null
    admin?: boolean | null
    blocked?: boolean | null
    email?: string | null
    provider?: UserProvider | null
    lastSeen?: string | null
    created: string
    avatar?: string | null
    github?: string | null
    institution?: string | null
    location?: string | null
    modified?: string | null
    orcid?: string | null
  } | null
}

export const DatasetReviewersFragmentDoc = {
  "kind": "Document",
  "definitions": [{
    "kind": "FragmentDefinition",
    "name": { "kind": "Name", "value": "DatasetReviewers" },
    "typeCondition": {
      "kind": "NamedType",
      "name": { "kind": "Name", "value": "Dataset" },
    },
    "selectionSet": {
      "kind": "SelectionSet",
      "selections": [{
        "kind": "Field",
        "name": { "kind": "Name", "value": "id" },
      }, {
        "kind": "Field",
        "name": { "kind": "Name", "value": "reviewers" },
        "selectionSet": {
          "kind": "SelectionSet",
          "selections": [{
            "kind": "Field",
            "name": { "kind": "Name", "value": "expiration" },
          }, { "kind": "Field", "name": { "kind": "Name", "value": "id" } }],
        },
      }],
    },
  }],
} as unknown as DocumentNode<DatasetReviewersFragment, unknown>
export const UserFollowingFragmentDoc = {
  "kind": "Document",
  "definitions": [{
    "kind": "FragmentDefinition",
    "name": { "kind": "Name", "value": "UserFollowing" },
    "typeCondition": {
      "kind": "NamedType",
      "name": { "kind": "Name", "value": "Dataset" },
    },
    "selectionSet": {
      "kind": "SelectionSet",
      "selections": [{
        "kind": "Field",
        "name": { "kind": "Name", "value": "id" },
      }, { "kind": "Field", "name": { "kind": "Name", "value": "following" } }],
    },
  }],
} as unknown as DocumentNode<UserFollowingFragment, unknown>
export const DatasetFollowersFragmentDoc = {
  "kind": "Document",
  "definitions": [{
    "kind": "FragmentDefinition",
    "name": { "kind": "Name", "value": "DatasetFollowers" },
    "typeCondition": {
      "kind": "NamedType",
      "name": { "kind": "Name", "value": "Dataset" },
    },
    "selectionSet": {
      "kind": "SelectionSet",
      "selections": [{
        "kind": "Field",
        "name": { "kind": "Name", "value": "id" },
      }, {
        "kind": "Field",
        "name": { "kind": "Name", "value": "followers" },
        "selectionSet": {
          "kind": "SelectionSet",
          "selections": [{
            "kind": "Field",
            "name": { "kind": "Name", "value": "userId" },
          }],
        },
      }],
    },
  }],
} as unknown as DocumentNode<DatasetFollowersFragment, unknown>
export const UserStarredFragmentDoc = {
  "kind": "Document",
  "definitions": [{
    "kind": "FragmentDefinition",
    "name": { "kind": "Name", "value": "UserStarred" },
    "typeCondition": {
      "kind": "NamedType",
      "name": { "kind": "Name", "value": "Dataset" },
    },
    "selectionSet": {
      "kind": "SelectionSet",
      "selections": [{
        "kind": "Field",
        "name": { "kind": "Name", "value": "id" },
      }, { "kind": "Field", "name": { "kind": "Name", "value": "starred" } }],
    },
  }],
} as unknown as DocumentNode<UserStarredFragment, unknown>
export const DatasetStarsFragmentDoc = {
  "kind": "Document",
  "definitions": [{
    "kind": "FragmentDefinition",
    "name": { "kind": "Name", "value": "DatasetStars" },
    "typeCondition": {
      "kind": "NamedType",
      "name": { "kind": "Name", "value": "Dataset" },
    },
    "selectionSet": {
      "kind": "SelectionSet",
      "selections": [{
        "kind": "Field",
        "name": { "kind": "Name", "value": "id" },
      }, {
        "kind": "Field",
        "name": { "kind": "Name", "value": "stars" },
        "selectionSet": {
          "kind": "SelectionSet",
          "selections": [{
            "kind": "Field",
            "name": { "kind": "Name", "value": "userId" },
          }],
        },
      }],
    },
  }],
} as unknown as DocumentNode<DatasetStarsFragment, unknown>
export const UserFieldsFragmentDoc = {
  "kind": "Document",
  "definitions": [{
    "kind": "FragmentDefinition",
    "name": { "kind": "Name", "value": "userFields" },
    "typeCondition": {
      "kind": "NamedType",
      "name": { "kind": "Name", "value": "User" },
    },
    "selectionSet": {
      "kind": "SelectionSet",
      "selections": [
        { "kind": "Field", "name": { "kind": "Name", "value": "id" } },
        { "kind": "Field", "name": { "kind": "Name", "value": "name" } },
        { "kind": "Field", "name": { "kind": "Name", "value": "admin" } },
        { "kind": "Field", "name": { "kind": "Name", "value": "blocked" } },
        { "kind": "Field", "name": { "kind": "Name", "value": "email" } },
        { "kind": "Field", "name": { "kind": "Name", "value": "provider" } },
        { "kind": "Field", "name": { "kind": "Name", "value": "lastSeen" } },
        { "kind": "Field", "name": { "kind": "Name", "value": "created" } },
        { "kind": "Field", "name": { "kind": "Name", "value": "avatar" } },
        { "kind": "Field", "name": { "kind": "Name", "value": "github" } },
        { "kind": "Field", "name": { "kind": "Name", "value": "institution" } },
        { "kind": "Field", "name": { "kind": "Name", "value": "location" } },
        { "kind": "Field", "name": { "kind": "Name", "value": "modified" } },
        { "kind": "Field", "name": { "kind": "Name", "value": "orcid" } },
      ],
    },
  }],
} as unknown as DocumentNode<UserFieldsFragment, unknown>
export const UpdateContributorsDocument = {
  "kind": "Document",
  "definitions": [{
    "kind": "OperationDefinition",
    "operation": "mutation",
    "name": { "kind": "Name", "value": "UpdateContributors" },
    "variableDefinitions": [{
      "kind": "VariableDefinition",
      "variable": {
        "kind": "Variable",
        "name": { "kind": "Name", "value": "datasetId" },
      },
      "type": {
        "kind": "NonNullType",
        "type": {
          "kind": "NamedType",
          "name": { "kind": "Name", "value": "String" },
        },
      },
    }, {
      "kind": "VariableDefinition",
      "variable": {
        "kind": "Variable",
        "name": { "kind": "Name", "value": "newContributors" },
      },
      "type": {
        "kind": "NonNullType",
        "type": {
          "kind": "ListType",
          "type": {
            "kind": "NonNullType",
            "type": {
              "kind": "NamedType",
              "name": { "kind": "Name", "value": "ContributorInput" },
            },
          },
        },
      },
    }],
    "selectionSet": {
      "kind": "SelectionSet",
      "selections": [{
        "kind": "Field",
        "name": { "kind": "Name", "value": "updateContributors" },
        "arguments": [{
          "kind": "Argument",
          "name": { "kind": "Name", "value": "datasetId" },
          "value": {
            "kind": "Variable",
            "name": { "kind": "Name", "value": "datasetId" },
          },
        }, {
          "kind": "Argument",
          "name": { "kind": "Name", "value": "newContributors" },
          "value": {
            "kind": "Variable",
            "name": { "kind": "Name", "value": "newContributors" },
          },
        }],
        "selectionSet": {
          "kind": "SelectionSet",
          "selections": [{
            "kind": "Field",
            "name": { "kind": "Name", "value": "success" },
          }, {
            "kind": "Field",
            "name": { "kind": "Name", "value": "dataset" },
            "selectionSet": {
              "kind": "SelectionSet",
              "selections": [{
                "kind": "Field",
                "name": { "kind": "Name", "value": "id" },
              }, {
                "kind": "Field",
                "name": { "kind": "Name", "value": "draft" },
                "selectionSet": {
                  "kind": "SelectionSet",
                  "selections": [{
                    "kind": "Field",
                    "name": { "kind": "Name", "value": "id" },
                  }, {
                    "kind": "Field",
                    "name": { "kind": "Name", "value": "contributors" },
                    "selectionSet": {
                      "kind": "SelectionSet",
                      "selections": [{
                        "kind": "Field",
                        "name": { "kind": "Name", "value": "name" },
                      }, {
                        "kind": "Field",
                        "name": { "kind": "Name", "value": "givenName" },
                      }, {
                        "kind": "Field",
                        "name": { "kind": "Name", "value": "familyName" },
                      }, {
                        "kind": "Field",
                        "name": { "kind": "Name", "value": "orcid" },
                      }, {
                        "kind": "Field",
                        "name": { "kind": "Name", "value": "contributorType" },
                      }, {
                        "kind": "Field",
                        "name": { "kind": "Name", "value": "order" },
                      }],
                    },
                  }, {
                    "kind": "Field",
                    "name": { "kind": "Name", "value": "files" },
                    "selectionSet": {
                      "kind": "SelectionSet",
                      "selections": [{
                        "kind": "Field",
                        "name": { "kind": "Name", "value": "id" },
                      }, {
                        "kind": "Field",
                        "name": { "kind": "Name", "value": "filename" },
                      }, {
                        "kind": "Field",
                        "name": { "kind": "Name", "value": "size" },
                      }, {
                        "kind": "Field",
                        "name": { "kind": "Name", "value": "annexed" },
                      }, {
                        "kind": "Field",
                        "name": { "kind": "Name", "value": "urls" },
                      }, {
                        "kind": "Field",
                        "name": { "kind": "Name", "value": "directory" },
                      }],
                    },
                  }, {
                    "kind": "Field",
                    "name": { "kind": "Name", "value": "modified" },
                  }],
                },
              }],
            },
          }],
        },
      }],
    },
  }],
} as unknown as DocumentNode<
  UpdateContributorsMutation,
  UpdateContributorsMutationVariables
>
export const CreateReviewerDocument = {
  "kind": "Document",
  "definitions": [{
    "kind": "OperationDefinition",
    "operation": "mutation",
    "name": { "kind": "Name", "value": "createReviewer" },
    "variableDefinitions": [{
      "kind": "VariableDefinition",
      "variable": {
        "kind": "Variable",
        "name": { "kind": "Name", "value": "datasetId" },
      },
      "type": {
        "kind": "NonNullType",
        "type": {
          "kind": "NamedType",
          "name": { "kind": "Name", "value": "ID" },
        },
      },
    }],
    "selectionSet": {
      "kind": "SelectionSet",
      "selections": [{
        "kind": "Field",
        "name": { "kind": "Name", "value": "createReviewer" },
        "arguments": [{
          "kind": "Argument",
          "name": { "kind": "Name", "value": "datasetId" },
          "value": {
            "kind": "Variable",
            "name": { "kind": "Name", "value": "datasetId" },
          },
        }],
        "selectionSet": {
          "kind": "SelectionSet",
          "selections": [
            { "kind": "Field", "name": { "kind": "Name", "value": "id" } },
            {
              "kind": "Field",
              "name": { "kind": "Name", "value": "datasetId" },
            },
            { "kind": "Field", "name": { "kind": "Name", "value": "url" } },
            {
              "kind": "Field",
              "name": { "kind": "Name", "value": "expiration" },
            },
          ],
        },
      }],
    },
  }],
} as unknown as DocumentNode<
  CreateReviewerMutation,
  CreateReviewerMutationVariables
>
export const GetDatasetRelationsDocument = {
  "kind": "Document",
  "definitions": [{
    "kind": "OperationDefinition",
    "operation": "query",
    "name": { "kind": "Name", "value": "getDatasetRelations" },
    "variableDefinitions": [{
      "kind": "VariableDefinition",
      "variable": {
        "kind": "Variable",
        "name": { "kind": "Name", "value": "datasetId" },
      },
      "type": {
        "kind": "NonNullType",
        "type": {
          "kind": "NamedType",
          "name": { "kind": "Name", "value": "ID" },
        },
      },
    }],
    "selectionSet": {
      "kind": "SelectionSet",
      "selections": [{
        "kind": "Field",
        "name": { "kind": "Name", "value": "dataset" },
        "arguments": [{
          "kind": "Argument",
          "name": { "kind": "Name", "value": "id" },
          "value": {
            "kind": "Variable",
            "name": { "kind": "Name", "value": "datasetId" },
          },
        }],
        "selectionSet": {
          "kind": "SelectionSet",
          "selections": [{
            "kind": "Field",
            "name": { "kind": "Name", "value": "latestSnapshot" },
            "selectionSet": {
              "kind": "SelectionSet",
              "selections": [{
                "kind": "Field",
                "name": { "kind": "Name", "value": "tag" },
              }, {
                "kind": "Field",
                "name": { "kind": "Name", "value": "related" },
                "selectionSet": {
                  "kind": "SelectionSet",
                  "selections": [{
                    "kind": "Field",
                    "name": { "kind": "Name", "value": "id" },
                  }, {
                    "kind": "Field",
                    "name": { "kind": "Name", "value": "kind" },
                  }, {
                    "kind": "Field",
                    "name": { "kind": "Name", "value": "relation" },
                  }, {
                    "kind": "Field",
                    "name": { "kind": "Name", "value": "description" },
                  }],
                },
              }],
            },
          }],
        },
      }],
    },
  }],
} as unknown as DocumentNode<
  GetDatasetRelationsQuery,
  GetDatasetRelationsQueryVariables
>
export const CreateDatasetRelationDocument = {
  "kind": "Document",
  "definitions": [{
    "kind": "OperationDefinition",
    "operation": "mutation",
    "name": { "kind": "Name", "value": "createDatasetRelation" },
    "variableDefinitions": [{
      "kind": "VariableDefinition",
      "variable": {
        "kind": "Variable",
        "name": { "kind": "Name", "value": "datasetId" },
      },
      "type": {
        "kind": "NonNullType",
        "type": {
          "kind": "NamedType",
          "name": { "kind": "Name", "value": "ID" },
        },
      },
    }, {
      "kind": "VariableDefinition",
      "variable": {
        "kind": "Variable",
        "name": { "kind": "Name", "value": "doi" },
      },
      "type": {
        "kind": "NonNullType",
        "type": {
          "kind": "NamedType",
          "name": { "kind": "Name", "value": "String" },
        },
      },
    }, {
      "kind": "VariableDefinition",
      "variable": {
        "kind": "Variable",
        "name": { "kind": "Name", "value": "description" },
      },
      "type": {
        "kind": "NonNullType",
        "type": {
          "kind": "NamedType",
          "name": { "kind": "Name", "value": "String" },
        },
      },
    }, {
      "kind": "VariableDefinition",
      "variable": {
        "kind": "Variable",
        "name": { "kind": "Name", "value": "kind" },
      },
      "type": {
        "kind": "NonNullType",
        "type": {
          "kind": "NamedType",
          "name": { "kind": "Name", "value": "RelatedObjectKind" },
        },
      },
    }, {
      "kind": "VariableDefinition",
      "variable": {
        "kind": "Variable",
        "name": { "kind": "Name", "value": "relation" },
      },
      "type": {
        "kind": "NonNullType",
        "type": {
          "kind": "NamedType",
          "name": { "kind": "Name", "value": "RelatedObjectRelation" },
        },
      },
    }],
    "selectionSet": {
      "kind": "SelectionSet",
      "selections": [{
        "kind": "Field",
        "name": { "kind": "Name", "value": "createRelation" },
        "arguments": [{
          "kind": "Argument",
          "name": { "kind": "Name", "value": "datasetId" },
          "value": {
            "kind": "Variable",
            "name": { "kind": "Name", "value": "datasetId" },
          },
        }, {
          "kind": "Argument",
          "name": { "kind": "Name", "value": "doi" },
          "value": {
            "kind": "Variable",
            "name": { "kind": "Name", "value": "doi" },
          },
        }, {
          "kind": "Argument",
          "name": { "kind": "Name", "value": "description" },
          "value": {
            "kind": "Variable",
            "name": { "kind": "Name", "value": "description" },
          },
        }, {
          "kind": "Argument",
          "name": { "kind": "Name", "value": "kind" },
          "value": {
            "kind": "Variable",
            "name": { "kind": "Name", "value": "kind" },
          },
        }, {
          "kind": "Argument",
          "name": { "kind": "Name", "value": "relation" },
          "value": {
            "kind": "Variable",
            "name": { "kind": "Name", "value": "relation" },
          },
        }],
        "selectionSet": {
          "kind": "SelectionSet",
          "selections": [{
            "kind": "Field",
            "name": { "kind": "Name", "value": "id" },
          }],
        },
      }],
    },
  }],
} as unknown as DocumentNode<
  CreateDatasetRelationMutation,
  CreateDatasetRelationMutationVariables
>
export const DeleteDatasetRelationDocument = {
  "kind": "Document",
  "definitions": [{
    "kind": "OperationDefinition",
    "operation": "mutation",
    "name": { "kind": "Name", "value": "deleteDatasetRelation" },
    "variableDefinitions": [{
      "kind": "VariableDefinition",
      "variable": {
        "kind": "Variable",
        "name": { "kind": "Name", "value": "datasetId" },
      },
      "type": {
        "kind": "NonNullType",
        "type": {
          "kind": "NamedType",
          "name": { "kind": "Name", "value": "ID" },
        },
      },
    }, {
      "kind": "VariableDefinition",
      "variable": {
        "kind": "Variable",
        "name": { "kind": "Name", "value": "doi" },
      },
      "type": {
        "kind": "NonNullType",
        "type": {
          "kind": "NamedType",
          "name": { "kind": "Name", "value": "String" },
        },
      },
    }],
    "selectionSet": {
      "kind": "SelectionSet",
      "selections": [{
        "kind": "Field",
        "name": { "kind": "Name", "value": "deleteRelation" },
        "arguments": [{
          "kind": "Argument",
          "name": { "kind": "Name", "value": "datasetId" },
          "value": {
            "kind": "Variable",
            "name": { "kind": "Name", "value": "datasetId" },
          },
        }, {
          "kind": "Argument",
          "name": { "kind": "Name", "value": "doi" },
          "value": {
            "kind": "Variable",
            "name": { "kind": "Name", "value": "doi" },
          },
        }],
        "selectionSet": {
          "kind": "SelectionSet",
          "selections": [{
            "kind": "Field",
            "name": { "kind": "Name", "value": "id" },
          }],
        },
      }],
    },
  }],
} as unknown as DocumentNode<
  DeleteDatasetRelationMutation,
  DeleteDatasetRelationMutationVariables
>
export const DeleteReviewerDocument = {
  "kind": "Document",
  "definitions": [{
    "kind": "OperationDefinition",
    "operation": "mutation",
    "name": { "kind": "Name", "value": "deleteReviewer" },
    "variableDefinitions": [{
      "kind": "VariableDefinition",
      "variable": {
        "kind": "Variable",
        "name": { "kind": "Name", "value": "datasetId" },
      },
      "type": {
        "kind": "NonNullType",
        "type": {
          "kind": "NamedType",
          "name": { "kind": "Name", "value": "ID" },
        },
      },
    }, {
      "kind": "VariableDefinition",
      "variable": {
        "kind": "Variable",
        "name": { "kind": "Name", "value": "id" },
      },
      "type": {
        "kind": "NonNullType",
        "type": {
          "kind": "NamedType",
          "name": { "kind": "Name", "value": "ID" },
        },
      },
    }],
    "selectionSet": {
      "kind": "SelectionSet",
      "selections": [{
        "kind": "Field",
        "name": { "kind": "Name", "value": "deleteReviewer" },
        "arguments": [{
          "kind": "Argument",
          "name": { "kind": "Name", "value": "datasetId" },
          "value": {
            "kind": "Variable",
            "name": { "kind": "Name", "value": "datasetId" },
          },
        }, {
          "kind": "Argument",
          "name": { "kind": "Name", "value": "id" },
          "value": {
            "kind": "Variable",
            "name": { "kind": "Name", "value": "id" },
          },
        }],
        "selectionSet": {
          "kind": "SelectionSet",
          "selections": [{
            "kind": "Field",
            "name": { "kind": "Name", "value": "id" },
          }, {
            "kind": "Field",
            "name": { "kind": "Name", "value": "datasetId" },
          }],
        },
      }],
    },
  }],
} as unknown as DocumentNode<
  DeleteReviewerMutation,
  DeleteReviewerMutationVariables
>
export const DeprecateSnapshotDocument = {
  "kind": "Document",
  "definitions": [{
    "kind": "OperationDefinition",
    "operation": "mutation",
    "name": { "kind": "Name", "value": "deprecateSnapshot" },
    "variableDefinitions": [{
      "kind": "VariableDefinition",
      "variable": {
        "kind": "Variable",
        "name": { "kind": "Name", "value": "datasetId" },
      },
      "type": {
        "kind": "NonNullType",
        "type": {
          "kind": "NamedType",
          "name": { "kind": "Name", "value": "ID" },
        },
      },
    }, {
      "kind": "VariableDefinition",
      "variable": {
        "kind": "Variable",
        "name": { "kind": "Name", "value": "tag" },
      },
      "type": {
        "kind": "NonNullType",
        "type": {
          "kind": "NamedType",
          "name": { "kind": "Name", "value": "String" },
        },
      },
    }, {
      "kind": "VariableDefinition",
      "variable": {
        "kind": "Variable",
        "name": { "kind": "Name", "value": "reason" },
      },
      "type": {
        "kind": "NonNullType",
        "type": {
          "kind": "NamedType",
          "name": { "kind": "Name", "value": "String" },
        },
      },
    }],
    "selectionSet": {
      "kind": "SelectionSet",
      "selections": [{
        "kind": "Field",
        "name": { "kind": "Name", "value": "deprecateSnapshot" },
        "arguments": [{
          "kind": "Argument",
          "name": { "kind": "Name", "value": "datasetId" },
          "value": {
            "kind": "Variable",
            "name": { "kind": "Name", "value": "datasetId" },
          },
        }, {
          "kind": "Argument",
          "name": { "kind": "Name", "value": "tag" },
          "value": {
            "kind": "Variable",
            "name": { "kind": "Name", "value": "tag" },
          },
        }, {
          "kind": "Argument",
          "name": { "kind": "Name", "value": "reason" },
          "value": {
            "kind": "Variable",
            "name": { "kind": "Name", "value": "reason" },
          },
        }],
        "selectionSet": {
          "kind": "SelectionSet",
          "selections": [{
            "kind": "Field",
            "name": { "kind": "Name", "value": "id" },
          }, {
            "kind": "Field",
            "name": { "kind": "Name", "value": "deprecated" },
            "selectionSet": {
              "kind": "SelectionSet",
              "selections": [{
                "kind": "Field",
                "name": { "kind": "Name", "value": "reason" },
              }],
            },
          }],
        },
      }],
    },
  }],
} as unknown as DocumentNode<
  DeprecateSnapshotMutation,
  DeprecateSnapshotMutationVariables
>
export const FollowDatasetDocument = {
  "kind": "Document",
  "definitions": [{
    "kind": "OperationDefinition",
    "operation": "mutation",
    "name": { "kind": "Name", "value": "followDataset" },
    "variableDefinitions": [{
      "kind": "VariableDefinition",
      "variable": {
        "kind": "Variable",
        "name": { "kind": "Name", "value": "datasetId" },
      },
      "type": {
        "kind": "NonNullType",
        "type": {
          "kind": "NamedType",
          "name": { "kind": "Name", "value": "ID" },
        },
      },
    }],
    "selectionSet": {
      "kind": "SelectionSet",
      "selections": [{
        "kind": "Field",
        "name": { "kind": "Name", "value": "followDataset" },
        "arguments": [{
          "kind": "Argument",
          "name": { "kind": "Name", "value": "datasetId" },
          "value": {
            "kind": "Variable",
            "name": { "kind": "Name", "value": "datasetId" },
          },
        }],
        "selectionSet": {
          "kind": "SelectionSet",
          "selections": [{
            "kind": "Field",
            "name": { "kind": "Name", "value": "following" },
          }, {
            "kind": "Field",
            "name": { "kind": "Name", "value": "newFollower" },
            "selectionSet": {
              "kind": "SelectionSet",
              "selections": [{
                "kind": "Field",
                "name": { "kind": "Name", "value": "userId" },
              }],
            },
          }],
        },
      }],
    },
  }],
} as unknown as DocumentNode<
  FollowDatasetMutation,
  FollowDatasetMutationVariables
>
export const FsckDatasetDocument = {
  "kind": "Document",
  "definitions": [{
    "kind": "OperationDefinition",
    "operation": "mutation",
    "name": { "kind": "Name", "value": "fsckDataset" },
    "variableDefinitions": [{
      "kind": "VariableDefinition",
      "variable": {
        "kind": "Variable",
        "name": { "kind": "Name", "value": "datasetId" },
      },
      "type": {
        "kind": "NonNullType",
        "type": {
          "kind": "NamedType",
          "name": { "kind": "Name", "value": "ID" },
        },
      },
    }],
    "selectionSet": {
      "kind": "SelectionSet",
      "selections": [{
        "kind": "Field",
        "name": { "kind": "Name", "value": "fsckDataset" },
        "arguments": [{
          "kind": "Argument",
          "name": { "kind": "Name", "value": "datasetId" },
          "value": {
            "kind": "Variable",
            "name": { "kind": "Name", "value": "datasetId" },
          },
        }],
      }],
    },
  }],
} as unknown as DocumentNode<FsckDatasetMutation, FsckDatasetMutationVariables>
export const GetHoldDeletionDocument = {
  "kind": "Document",
  "definitions": [{
    "kind": "OperationDefinition",
    "operation": "query",
    "name": { "kind": "Name", "value": "getHoldDeletion" },
    "variableDefinitions": [{
      "kind": "VariableDefinition",
      "variable": {
        "kind": "Variable",
        "name": { "kind": "Name", "value": "datasetId" },
      },
      "type": {
        "kind": "NonNullType",
        "type": {
          "kind": "NamedType",
          "name": { "kind": "Name", "value": "ID" },
        },
      },
    }],
    "selectionSet": {
      "kind": "SelectionSet",
      "selections": [{
        "kind": "Field",
        "name": { "kind": "Name", "value": "dataset" },
        "arguments": [{
          "kind": "Argument",
          "name": { "kind": "Name", "value": "id" },
          "value": {
            "kind": "Variable",
            "name": { "kind": "Name", "value": "datasetId" },
          },
        }],
        "selectionSet": {
          "kind": "SelectionSet",
          "selections": [{
            "kind": "Field",
            "name": { "kind": "Name", "value": "id" },
          }, {
            "kind": "Field",
            "name": { "kind": "Name", "value": "holdDeletion" },
          }],
        },
      }],
    },
  }],
} as unknown as DocumentNode<
  GetHoldDeletionQuery,
  GetHoldDeletionQueryVariables
>
export const HoldDeletionDocument = {
  "kind": "Document",
  "definitions": [{
    "kind": "OperationDefinition",
    "operation": "mutation",
    "name": { "kind": "Name", "value": "holdDeletion" },
    "variableDefinitions": [{
      "kind": "VariableDefinition",
      "variable": {
        "kind": "Variable",
        "name": { "kind": "Name", "value": "datasetId" },
      },
      "type": {
        "kind": "NonNullType",
        "type": {
          "kind": "NamedType",
          "name": { "kind": "Name", "value": "ID" },
        },
      },
    }, {
      "kind": "VariableDefinition",
      "variable": {
        "kind": "Variable",
        "name": { "kind": "Name", "value": "hold" },
      },
      "type": {
        "kind": "NonNullType",
        "type": {
          "kind": "NamedType",
          "name": { "kind": "Name", "value": "Boolean" },
        },
      },
    }],
    "selectionSet": {
      "kind": "SelectionSet",
      "selections": [{
        "kind": "Field",
        "name": { "kind": "Name", "value": "holdDeletion" },
        "arguments": [{
          "kind": "Argument",
          "name": { "kind": "Name", "value": "datasetId" },
          "value": {
            "kind": "Variable",
            "name": { "kind": "Name", "value": "datasetId" },
          },
        }, {
          "kind": "Argument",
          "name": { "kind": "Name", "value": "hold" },
          "value": {
            "kind": "Variable",
            "name": { "kind": "Name", "value": "hold" },
          },
        }],
      }],
    },
  }],
} as unknown as DocumentNode<
  HoldDeletionMutation,
  HoldDeletionMutationVariables
>
export const ImportRemoteDatasetDocument = {
  "kind": "Document",
  "definitions": [{
    "kind": "OperationDefinition",
    "operation": "mutation",
    "name": { "kind": "Name", "value": "importRemoteDataset" },
    "variableDefinitions": [{
      "kind": "VariableDefinition",
      "variable": {
        "kind": "Variable",
        "name": { "kind": "Name", "value": "datasetId" },
      },
      "type": {
        "kind": "NonNullType",
        "type": {
          "kind": "NamedType",
          "name": { "kind": "Name", "value": "ID" },
        },
      },
    }, {
      "kind": "VariableDefinition",
      "variable": {
        "kind": "Variable",
        "name": { "kind": "Name", "value": "url" },
      },
      "type": {
        "kind": "NonNullType",
        "type": {
          "kind": "NamedType",
          "name": { "kind": "Name", "value": "String" },
        },
      },
    }],
    "selectionSet": {
      "kind": "SelectionSet",
      "selections": [{
        "kind": "Field",
        "name": { "kind": "Name", "value": "importRemoteDataset" },
        "arguments": [{
          "kind": "Argument",
          "name": { "kind": "Name", "value": "datasetId" },
          "value": {
            "kind": "Variable",
            "name": { "kind": "Name", "value": "datasetId" },
          },
        }, {
          "kind": "Argument",
          "name": { "kind": "Name", "value": "url" },
          "value": {
            "kind": "Variable",
            "name": { "kind": "Name", "value": "url" },
          },
        }],
      }],
    },
  }],
} as unknown as DocumentNode<
  ImportRemoteDatasetMutation,
  ImportRemoteDatasetMutationVariables
>
export const RemovePermissionsDocument = {
  "kind": "Document",
  "definitions": [{
    "kind": "OperationDefinition",
    "operation": "mutation",
    "name": { "kind": "Name", "value": "removePermissions" },
    "variableDefinitions": [{
      "kind": "VariableDefinition",
      "variable": {
        "kind": "Variable",
        "name": { "kind": "Name", "value": "datasetId" },
      },
      "type": {
        "kind": "NonNullType",
        "type": {
          "kind": "NamedType",
          "name": { "kind": "Name", "value": "ID" },
        },
      },
    }, {
      "kind": "VariableDefinition",
      "variable": {
        "kind": "Variable",
        "name": { "kind": "Name", "value": "userId" },
      },
      "type": {
        "kind": "NonNullType",
        "type": {
          "kind": "NamedType",
          "name": { "kind": "Name", "value": "String" },
        },
      },
    }],
    "selectionSet": {
      "kind": "SelectionSet",
      "selections": [{
        "kind": "Field",
        "name": { "kind": "Name", "value": "removePermissions" },
        "arguments": [{
          "kind": "Argument",
          "name": { "kind": "Name", "value": "datasetId" },
          "value": {
            "kind": "Variable",
            "name": { "kind": "Name", "value": "datasetId" },
          },
        }, {
          "kind": "Argument",
          "name": { "kind": "Name", "value": "userId" },
          "value": {
            "kind": "Variable",
            "name": { "kind": "Name", "value": "userId" },
          },
        }],
      }],
    },
  }],
} as unknown as DocumentNode<
  RemovePermissionsMutation,
  RemovePermissionsMutationVariables
>
export const StarDatasetDocument = {
  "kind": "Document",
  "definitions": [{
    "kind": "OperationDefinition",
    "operation": "mutation",
    "name": { "kind": "Name", "value": "starDataset" },
    "variableDefinitions": [{
      "kind": "VariableDefinition",
      "variable": {
        "kind": "Variable",
        "name": { "kind": "Name", "value": "datasetId" },
      },
      "type": {
        "kind": "NonNullType",
        "type": {
          "kind": "NamedType",
          "name": { "kind": "Name", "value": "ID" },
        },
      },
    }],
    "selectionSet": {
      "kind": "SelectionSet",
      "selections": [{
        "kind": "Field",
        "name": { "kind": "Name", "value": "starDataset" },
        "arguments": [{
          "kind": "Argument",
          "name": { "kind": "Name", "value": "datasetId" },
          "value": {
            "kind": "Variable",
            "name": { "kind": "Name", "value": "datasetId" },
          },
        }],
        "selectionSet": {
          "kind": "SelectionSet",
          "selections": [{
            "kind": "Field",
            "name": { "kind": "Name", "value": "starred" },
          }, {
            "kind": "Field",
            "name": { "kind": "Name", "value": "newStar" },
            "selectionSet": {
              "kind": "SelectionSet",
              "selections": [{
                "kind": "Field",
                "name": { "kind": "Name", "value": "userId" },
              }],
            },
          }],
        },
      }],
    },
  }],
} as unknown as DocumentNode<StarDatasetMutation, StarDatasetMutationVariables>
export const UndoDeprecateSnapshotDocument = {
  "kind": "Document",
  "definitions": [{
    "kind": "OperationDefinition",
    "operation": "mutation",
    "name": { "kind": "Name", "value": "undoDeprecateSnapshot" },
    "variableDefinitions": [{
      "kind": "VariableDefinition",
      "variable": {
        "kind": "Variable",
        "name": { "kind": "Name", "value": "datasetId" },
      },
      "type": {
        "kind": "NonNullType",
        "type": {
          "kind": "NamedType",
          "name": { "kind": "Name", "value": "ID" },
        },
      },
    }, {
      "kind": "VariableDefinition",
      "variable": {
        "kind": "Variable",
        "name": { "kind": "Name", "value": "tag" },
      },
      "type": {
        "kind": "NonNullType",
        "type": {
          "kind": "NamedType",
          "name": { "kind": "Name", "value": "String" },
        },
      },
    }],
    "selectionSet": {
      "kind": "SelectionSet",
      "selections": [{
        "kind": "Field",
        "name": { "kind": "Name", "value": "undoDeprecateSnapshot" },
        "arguments": [{
          "kind": "Argument",
          "name": { "kind": "Name", "value": "datasetId" },
          "value": {
            "kind": "Variable",
            "name": { "kind": "Name", "value": "datasetId" },
          },
        }, {
          "kind": "Argument",
          "name": { "kind": "Name", "value": "tag" },
          "value": {
            "kind": "Variable",
            "name": { "kind": "Name", "value": "tag" },
          },
        }],
        "selectionSet": {
          "kind": "SelectionSet",
          "selections": [{
            "kind": "Field",
            "name": { "kind": "Name", "value": "id" },
          }, {
            "kind": "Field",
            "name": { "kind": "Name", "value": "deprecated" },
            "selectionSet": {
              "kind": "SelectionSet",
              "selections": [{
                "kind": "Field",
                "name": { "kind": "Name", "value": "reason" },
              }],
            },
          }],
        },
      }],
    },
  }],
} as unknown as DocumentNode<
  UndoDeprecateSnapshotMutation,
  UndoDeprecateSnapshotMutationVariables
>
export const UpdatePermissionsDocument = {
  "kind": "Document",
  "definitions": [{
    "kind": "OperationDefinition",
    "operation": "mutation",
    "name": { "kind": "Name", "value": "updatePermissions" },
    "variableDefinitions": [{
      "kind": "VariableDefinition",
      "variable": {
        "kind": "Variable",
        "name": { "kind": "Name", "value": "datasetId" },
      },
      "type": {
        "kind": "NonNullType",
        "type": {
          "kind": "NamedType",
          "name": { "kind": "Name", "value": "ID" },
        },
      },
    }, {
      "kind": "VariableDefinition",
      "variable": {
        "kind": "Variable",
        "name": { "kind": "Name", "value": "userEmail" },
      },
      "type": {
        "kind": "NonNullType",
        "type": {
          "kind": "NamedType",
          "name": { "kind": "Name", "value": "String" },
        },
      },
    }, {
      "kind": "VariableDefinition",
      "variable": {
        "kind": "Variable",
        "name": { "kind": "Name", "value": "level" },
      },
      "type": {
        "kind": "NonNullType",
        "type": {
          "kind": "NamedType",
          "name": { "kind": "Name", "value": "String" },
        },
      },
    }],
    "selectionSet": {
      "kind": "SelectionSet",
      "selections": [{
        "kind": "Field",
        "name": { "kind": "Name", "value": "updatePermissions" },
        "arguments": [{
          "kind": "Argument",
          "name": { "kind": "Name", "value": "datasetId" },
          "value": {
            "kind": "Variable",
            "name": { "kind": "Name", "value": "datasetId" },
          },
        }, {
          "kind": "Argument",
          "name": { "kind": "Name", "value": "userEmail" },
          "value": {
            "kind": "Variable",
            "name": { "kind": "Name", "value": "userEmail" },
          },
        }, {
          "kind": "Argument",
          "name": { "kind": "Name", "value": "level" },
          "value": {
            "kind": "Variable",
            "name": { "kind": "Name", "value": "level" },
          },
        }],
        "selectionSet": {
          "kind": "SelectionSet",
          "selections": [{
            "kind": "Field",
            "name": { "kind": "Name", "value": "id" },
          }, {
            "kind": "Field",
            "name": { "kind": "Name", "value": "userPermissions" },
            "selectionSet": {
              "kind": "SelectionSet",
              "selections": [{
                "kind": "Field",
                "name": { "kind": "Name", "value": "datasetId" },
              }, {
                "kind": "Field",
                "name": { "kind": "Name", "value": "userId" },
              }, {
                "kind": "Field",
                "name": { "kind": "Name", "value": "level" },
              }, {
                "kind": "Field",
                "name": { "kind": "Name", "value": "user" },
                "selectionSet": {
                  "kind": "SelectionSet",
                  "selections": [{
                    "kind": "Field",
                    "name": { "kind": "Name", "value": "id" },
                  }, {
                    "kind": "Field",
                    "name": { "kind": "Name", "value": "email" },
                  }, {
                    "kind": "Field",
                    "name": { "kind": "Name", "value": "orcid" },
                  }, {
                    "kind": "Field",
                    "name": { "kind": "Name", "value": "name" },
                  }],
                },
              }],
            },
          }],
        },
      }],
    },
  }],
} as unknown as DocumentNode<
  UpdatePermissionsMutation,
  UpdatePermissionsMutationVariables
>
export const UpdateOrcidPermissionsDocument = {
  "kind": "Document",
  "definitions": [{
    "kind": "OperationDefinition",
    "operation": "mutation",
    "name": { "kind": "Name", "value": "updateOrcidPermissions" },
    "variableDefinitions": [{
      "kind": "VariableDefinition",
      "variable": {
        "kind": "Variable",
        "name": { "kind": "Name", "value": "datasetId" },
      },
      "type": {
        "kind": "NonNullType",
        "type": {
          "kind": "NamedType",
          "name": { "kind": "Name", "value": "ID" },
        },
      },
    }, {
      "kind": "VariableDefinition",
      "variable": {
        "kind": "Variable",
        "name": { "kind": "Name", "value": "userOrcid" },
      },
      "type": {
        "kind": "NonNullType",
        "type": {
          "kind": "NamedType",
          "name": { "kind": "Name", "value": "String" },
        },
      },
    }, {
      "kind": "VariableDefinition",
      "variable": {
        "kind": "Variable",
        "name": { "kind": "Name", "value": "level" },
      },
      "type": {
        "kind": "NonNullType",
        "type": {
          "kind": "NamedType",
          "name": { "kind": "Name", "value": "String" },
        },
      },
    }],
    "selectionSet": {
      "kind": "SelectionSet",
      "selections": [{
        "kind": "Field",
        "name": { "kind": "Name", "value": "updateOrcidPermissions" },
        "arguments": [{
          "kind": "Argument",
          "name": { "kind": "Name", "value": "datasetId" },
          "value": {
            "kind": "Variable",
            "name": { "kind": "Name", "value": "datasetId" },
          },
        }, {
          "kind": "Argument",
          "name": { "kind": "Name", "value": "userOrcid" },
          "value": {
            "kind": "Variable",
            "name": { "kind": "Name", "value": "userOrcid" },
          },
        }, {
          "kind": "Argument",
          "name": { "kind": "Name", "value": "level" },
          "value": {
            "kind": "Variable",
            "name": { "kind": "Name", "value": "level" },
          },
        }],
        "selectionSet": {
          "kind": "SelectionSet",
          "selections": [{
            "kind": "Field",
            "name": { "kind": "Name", "value": "id" },
          }, {
            "kind": "Field",
            "name": { "kind": "Name", "value": "userPermissions" },
            "selectionSet": {
              "kind": "SelectionSet",
              "selections": [{
                "kind": "Field",
                "name": { "kind": "Name", "value": "datasetId" },
              }, {
                "kind": "Field",
                "name": { "kind": "Name", "value": "userId" },
              }, {
                "kind": "Field",
                "name": { "kind": "Name", "value": "level" },
              }, {
                "kind": "Field",
                "name": { "kind": "Name", "value": "user" },
                "selectionSet": {
                  "kind": "SelectionSet",
                  "selections": [{
                    "kind": "Field",
                    "name": { "kind": "Name", "value": "id" },
                  }, {
                    "kind": "Field",
                    "name": { "kind": "Name", "value": "email" },
                  }, {
                    "kind": "Field",
                    "name": { "kind": "Name", "value": "orcid" },
                  }, {
                    "kind": "Field",
                    "name": { "kind": "Name", "value": "name" },
                  }],
                },
              }],
            },
          }],
        },
      }],
    },
  }],
} as unknown as DocumentNode<
  UpdateOrcidPermissionsMutation,
  UpdateOrcidPermissionsMutationVariables
>
export const ParticipantCountDocument = {
  "kind": "Document",
  "definitions": [{
    "kind": "OperationDefinition",
    "operation": "query",
    "name": { "kind": "Name", "value": "participantCount" },
    "variableDefinitions": [{
      "kind": "VariableDefinition",
      "variable": {
        "kind": "Variable",
        "name": { "kind": "Name", "value": "modality" },
      },
      "type": {
        "kind": "NamedType",
        "name": { "kind": "Name", "value": "String" },
      },
    }],
    "selectionSet": {
      "kind": "SelectionSet",
      "selections": [{
        "kind": "Field",
        "name": { "kind": "Name", "value": "participantCount" },
        "arguments": [{
          "kind": "Argument",
          "name": { "kind": "Name", "value": "modality" },
          "value": {
            "kind": "Variable",
            "name": { "kind": "Name", "value": "modality" },
          },
        }],
      }],
    },
  }],
} as unknown as DocumentNode<
  ParticipantCountQuery,
  ParticipantCountQueryVariables
>
export const PublicDatasetCountDocument = {
  "kind": "Document",
  "definitions": [{
    "kind": "OperationDefinition",
    "operation": "query",
    "name": { "kind": "Name", "value": "publicDatasetCount" },
    "variableDefinitions": [{
      "kind": "VariableDefinition",
      "variable": {
        "kind": "Variable",
        "name": { "kind": "Name", "value": "modality" },
      },
      "type": {
        "kind": "NamedType",
        "name": { "kind": "Name", "value": "String" },
      },
    }],
    "selectionSet": {
      "kind": "SelectionSet",
      "selections": [{
        "kind": "Field",
        "name": { "kind": "Name", "value": "datasets" },
        "arguments": [{
          "kind": "Argument",
          "name": { "kind": "Name", "value": "filterBy" },
          "value": {
            "kind": "ObjectValue",
            "fields": [{
              "kind": "ObjectField",
              "name": { "kind": "Name", "value": "public" },
              "value": { "kind": "BooleanValue", "value": true },
            }],
          },
        }, {
          "kind": "Argument",
          "name": { "kind": "Name", "value": "modality" },
          "value": {
            "kind": "Variable",
            "name": { "kind": "Name", "value": "modality" },
          },
        }],
        "selectionSet": {
          "kind": "SelectionSet",
          "selections": [{
            "kind": "Field",
            "name": { "kind": "Name", "value": "pageInfo" },
            "selectionSet": {
              "kind": "SelectionSet",
              "selections": [{
                "kind": "Field",
                "name": { "kind": "Name", "value": "count" },
              }],
            },
          }],
        },
      }],
    },
  }],
} as unknown as DocumentNode<
  PublicDatasetCountQuery,
  PublicDatasetCountQueryVariables
>
export const AdvancedSearchDocument = {
  "kind": "Document",
  "definitions": [{
    "kind": "OperationDefinition",
    "operation": "query",
    "name": { "kind": "Name", "value": "AdvancedSearch" },
    "variableDefinitions": [{
      "kind": "VariableDefinition",
      "variable": {
        "kind": "Variable",
        "name": { "kind": "Name", "value": "query" },
      },
      "type": {
        "kind": "NonNullType",
        "type": {
          "kind": "NamedType",
          "name": { "kind": "Name", "value": "DatasetSearchInput" },
        },
      },
    }, {
      "kind": "VariableDefinition",
      "variable": {
        "kind": "Variable",
        "name": { "kind": "Name", "value": "datasetType" },
      },
      "type": {
        "kind": "NonNullType",
        "type": {
          "kind": "NamedType",
          "name": { "kind": "Name", "value": "String" },
        },
      },
    }],
    "selectionSet": {
      "kind": "SelectionSet",
      "selections": [{
        "kind": "Field",
        "name": { "kind": "Name", "value": "advancedSearch" },
        "arguments": [{
          "kind": "Argument",
          "name": { "kind": "Name", "value": "query" },
          "value": {
            "kind": "Variable",
            "name": { "kind": "Name", "value": "query" },
          },
        }, {
          "kind": "Argument",
          "name": { "kind": "Name", "value": "datasetType" },
          "value": {
            "kind": "Variable",
            "name": { "kind": "Name", "value": "datasetType" },
          },
        }],
        "selectionSet": {
          "kind": "SelectionSet",
          "selections": [{
            "kind": "Field",
            "name": { "kind": "Name", "value": "pageInfo" },
            "selectionSet": {
              "kind": "SelectionSet",
              "selections": [{
                "kind": "Field",
                "name": { "kind": "Name", "value": "count" },
              }],
            },
          }],
        },
      }],
    },
  }],
} as unknown as DocumentNode<AdvancedSearchQuery, AdvancedSearchQueryVariables>
export const SubscribeToNewsletterDocument = {
  "kind": "Document",
  "definitions": [{
    "kind": "OperationDefinition",
    "operation": "mutation",
    "name": { "kind": "Name", "value": "subscribeToNewsletter" },
    "variableDefinitions": [{
      "kind": "VariableDefinition",
      "variable": {
        "kind": "Variable",
        "name": { "kind": "Name", "value": "email" },
      },
      "type": {
        "kind": "NonNullType",
        "type": {
          "kind": "NamedType",
          "name": { "kind": "Name", "value": "String" },
        },
      },
    }],
    "selectionSet": {
      "kind": "SelectionSet",
      "selections": [{
        "kind": "Field",
        "name": { "kind": "Name", "value": "subscribeToNewsletter" },
        "arguments": [{
          "kind": "Argument",
          "name": { "kind": "Name", "value": "email" },
          "value": {
            "kind": "Variable",
            "name": { "kind": "Name", "value": "email" },
          },
        }],
      }],
    },
  }],
} as unknown as DocumentNode<
  SubscribeToNewsletterMutation,
  SubscribeToNewsletterMutationVariables
>
export const Top_Viewed_DatasetsDocument = {
  "kind": "Document",
  "definitions": [{
    "kind": "OperationDefinition",
    "operation": "query",
    "name": { "kind": "Name", "value": "top_viewed_datasets" },
    "selectionSet": {
      "kind": "SelectionSet",
      "selections": [{
        "kind": "Field",
        "name": { "kind": "Name", "value": "datasets" },
        "arguments": [{
          "kind": "Argument",
          "name": { "kind": "Name", "value": "first" },
          "value": { "kind": "IntValue", "value": "12" },
        }, {
          "kind": "Argument",
          "name": { "kind": "Name", "value": "orderBy" },
          "value": {
            "kind": "ObjectValue",
            "fields": [{
              "kind": "ObjectField",
              "name": { "kind": "Name", "value": "views" },
              "value": { "kind": "EnumValue", "value": "descending" },
            }],
          },
        }, {
          "kind": "Argument",
          "name": { "kind": "Name", "value": "filterBy" },
          "value": {
            "kind": "ObjectValue",
            "fields": [{
              "kind": "ObjectField",
              "name": { "kind": "Name", "value": "public" },
              "value": { "kind": "BooleanValue", "value": true },
            }],
          },
        }],
        "selectionSet": {
          "kind": "SelectionSet",
          "selections": [{
            "kind": "Field",
            "name": { "kind": "Name", "value": "edges" },
            "selectionSet": {
              "kind": "SelectionSet",
              "selections": [{
                "kind": "Field",
                "name": { "kind": "Name", "value": "node" },
                "selectionSet": {
                  "kind": "SelectionSet",
                  "selections": [{
                    "kind": "Field",
                    "name": { "kind": "Name", "value": "id" },
                  }, {
                    "kind": "Field",
                    "name": { "kind": "Name", "value": "analytics" },
                    "selectionSet": {
                      "kind": "SelectionSet",
                      "selections": [{
                        "kind": "Field",
                        "name": { "kind": "Name", "value": "views" },
                      }],
                    },
                  }, {
                    "kind": "Field",
                    "name": { "kind": "Name", "value": "latestSnapshot" },
                    "selectionSet": {
                      "kind": "SelectionSet",
                      "selections": [{
                        "kind": "Field",
                        "name": { "kind": "Name", "value": "tag" },
                      }, {
                        "kind": "Field",
                        "name": { "kind": "Name", "value": "summary" },
                        "selectionSet": {
                          "kind": "SelectionSet",
                          "selections": [{
                            "kind": "Field",
                            "name": {
                              "kind": "Name",
                              "value": "primaryModality",
                            },
                          }],
                        },
                      }, {
                        "kind": "Field",
                        "name": { "kind": "Name", "value": "description" },
                        "selectionSet": {
                          "kind": "SelectionSet",
                          "selections": [{
                            "kind": "Field",
                            "name": { "kind": "Name", "value": "Name" },
                          }],
                        },
                      }],
                    },
                  }],
                },
              }],
            },
          }],
        },
      }],
    },
  }],
} as unknown as DocumentNode<
  Top_Viewed_DatasetsQuery,
  Top_Viewed_DatasetsQueryVariables
>
export const Recently_Published_DatasetsDocument = {
  "kind": "Document",
  "definitions": [{
    "kind": "OperationDefinition",
    "operation": "query",
    "name": { "kind": "Name", "value": "recently_published_datasets" },
    "selectionSet": {
      "kind": "SelectionSet",
      "selections": [{
        "kind": "Field",
        "name": { "kind": "Name", "value": "datasets" },
        "arguments": [{
          "kind": "Argument",
          "name": { "kind": "Name", "value": "first" },
          "value": { "kind": "IntValue", "value": "12" },
        }, {
          "kind": "Argument",
          "name": { "kind": "Name", "value": "orderBy" },
          "value": {
            "kind": "ObjectValue",
            "fields": [{
              "kind": "ObjectField",
              "name": { "kind": "Name", "value": "publishDate" },
              "value": { "kind": "EnumValue", "value": "descending" },
            }],
          },
        }, {
          "kind": "Argument",
          "name": { "kind": "Name", "value": "filterBy" },
          "value": {
            "kind": "ObjectValue",
            "fields": [{
              "kind": "ObjectField",
              "name": { "kind": "Name", "value": "public" },
              "value": { "kind": "BooleanValue", "value": true },
            }],
          },
        }],
        "selectionSet": {
          "kind": "SelectionSet",
          "selections": [{
            "kind": "Field",
            "name": { "kind": "Name", "value": "edges" },
            "selectionSet": {
              "kind": "SelectionSet",
              "selections": [{
                "kind": "Field",
                "name": { "kind": "Name", "value": "node" },
                "selectionSet": {
                  "kind": "SelectionSet",
                  "selections": [{
                    "kind": "Field",
                    "name": { "kind": "Name", "value": "id" },
                  }, {
                    "kind": "Field",
                    "name": { "kind": "Name", "value": "publishDate" },
                  }, {
                    "kind": "Field",
                    "name": { "kind": "Name", "value": "latestSnapshot" },
                    "selectionSet": {
                      "kind": "SelectionSet",
                      "selections": [{
                        "kind": "Field",
                        "name": { "kind": "Name", "value": "tag" },
                      }, {
                        "kind": "Field",
                        "name": { "kind": "Name", "value": "summary" },
                        "selectionSet": {
                          "kind": "SelectionSet",
                          "selections": [{
                            "kind": "Field",
                            "name": {
                              "kind": "Name",
                              "value": "primaryModality",
                            },
                          }],
                        },
                      }, {
                        "kind": "Field",
                        "name": { "kind": "Name", "value": "description" },
                        "selectionSet": {
                          "kind": "SelectionSet",
                          "selections": [{
                            "kind": "Field",
                            "name": { "kind": "Name", "value": "Name" },
                          }],
                        },
                      }],
                    },
                  }],
                },
              }],
            },
          }],
        },
      }],
    },
  }],
} as unknown as DocumentNode<
  Recently_Published_DatasetsQuery,
  Recently_Published_DatasetsQueryVariables
>
export const GetUsersDocument = {
  "kind": "Document",
  "definitions": [{
    "kind": "OperationDefinition",
    "operation": "query",
    "name": { "kind": "Name", "value": "GetUsers" },
    "variableDefinitions": [{
      "kind": "VariableDefinition",
      "variable": {
        "kind": "Variable",
        "name": { "kind": "Name", "value": "orderBy" },
      },
      "type": {
        "kind": "ListType",
        "type": {
          "kind": "NonNullType",
          "type": {
            "kind": "NamedType",
            "name": { "kind": "Name", "value": "UserSortInput" },
          },
        },
      },
    }, {
      "kind": "VariableDefinition",
      "variable": {
        "kind": "Variable",
        "name": { "kind": "Name", "value": "isAdmin" },
      },
      "type": {
        "kind": "NamedType",
        "name": { "kind": "Name", "value": "Boolean" },
      },
    }, {
      "kind": "VariableDefinition",
      "variable": {
        "kind": "Variable",
        "name": { "kind": "Name", "value": "isBlocked" },
      },
      "type": {
        "kind": "NamedType",
        "name": { "kind": "Name", "value": "Boolean" },
      },
    }, {
      "kind": "VariableDefinition",
      "variable": {
        "kind": "Variable",
        "name": { "kind": "Name", "value": "search" },
      },
      "type": {
        "kind": "NamedType",
        "name": { "kind": "Name", "value": "String" },
      },
    }, {
      "kind": "VariableDefinition",
      "variable": {
        "kind": "Variable",
        "name": { "kind": "Name", "value": "limit" },
      },
      "type": {
        "kind": "NamedType",
        "name": { "kind": "Name", "value": "Int" },
      },
    }, {
      "kind": "VariableDefinition",
      "variable": {
        "kind": "Variable",
        "name": { "kind": "Name", "value": "offset" },
      },
      "type": {
        "kind": "NamedType",
        "name": { "kind": "Name", "value": "Int" },
      },
    }],
    "selectionSet": {
      "kind": "SelectionSet",
      "selections": [{
        "kind": "Field",
        "name": { "kind": "Name", "value": "users" },
        "arguments": [{
          "kind": "Argument",
          "name": { "kind": "Name", "value": "orderBy" },
          "value": {
            "kind": "Variable",
            "name": { "kind": "Name", "value": "orderBy" },
          },
        }, {
          "kind": "Argument",
          "name": { "kind": "Name", "value": "isAdmin" },
          "value": {
            "kind": "Variable",
            "name": { "kind": "Name", "value": "isAdmin" },
          },
        }, {
          "kind": "Argument",
          "name": { "kind": "Name", "value": "isBlocked" },
          "value": {
            "kind": "Variable",
            "name": { "kind": "Name", "value": "isBlocked" },
          },
        }, {
          "kind": "Argument",
          "name": { "kind": "Name", "value": "search" },
          "value": {
            "kind": "Variable",
            "name": { "kind": "Name", "value": "search" },
          },
        }, {
          "kind": "Argument",
          "name": { "kind": "Name", "value": "limit" },
          "value": {
            "kind": "Variable",
            "name": { "kind": "Name", "value": "limit" },
          },
        }, {
          "kind": "Argument",
          "name": { "kind": "Name", "value": "offset" },
          "value": {
            "kind": "Variable",
            "name": { "kind": "Name", "value": "offset" },
          },
        }],
        "selectionSet": {
          "kind": "SelectionSet",
          "selections": [{
            "kind": "Field",
            "name": { "kind": "Name", "value": "users" },
            "selectionSet": {
              "kind": "SelectionSet",
              "selections": [{
                "kind": "FragmentSpread",
                "name": { "kind": "Name", "value": "userFields" },
              }],
            },
          }, {
            "kind": "Field",
            "name": { "kind": "Name", "value": "totalCount" },
          }],
        },
      }],
    },
  }, {
    "kind": "FragmentDefinition",
    "name": { "kind": "Name", "value": "userFields" },
    "typeCondition": {
      "kind": "NamedType",
      "name": { "kind": "Name", "value": "User" },
    },
    "selectionSet": {
      "kind": "SelectionSet",
      "selections": [
        { "kind": "Field", "name": { "kind": "Name", "value": "id" } },
        { "kind": "Field", "name": { "kind": "Name", "value": "name" } },
        { "kind": "Field", "name": { "kind": "Name", "value": "admin" } },
        { "kind": "Field", "name": { "kind": "Name", "value": "blocked" } },
        { "kind": "Field", "name": { "kind": "Name", "value": "email" } },
        { "kind": "Field", "name": { "kind": "Name", "value": "provider" } },
        { "kind": "Field", "name": { "kind": "Name", "value": "lastSeen" } },
        { "kind": "Field", "name": { "kind": "Name", "value": "created" } },
        { "kind": "Field", "name": { "kind": "Name", "value": "avatar" } },
        { "kind": "Field", "name": { "kind": "Name", "value": "github" } },
        { "kind": "Field", "name": { "kind": "Name", "value": "institution" } },
        { "kind": "Field", "name": { "kind": "Name", "value": "location" } },
        { "kind": "Field", "name": { "kind": "Name", "value": "modified" } },
        { "kind": "Field", "name": { "kind": "Name", "value": "orcid" } },
      ],
    },
  }],
} as unknown as DocumentNode<GetUsersQuery, GetUsersQueryVariables>
export const SetAdminDocument = {
  "kind": "Document",
  "definitions": [{
    "kind": "OperationDefinition",
    "operation": "mutation",
    "name": { "kind": "Name", "value": "SetAdmin" },
    "variableDefinitions": [{
      "kind": "VariableDefinition",
      "variable": {
        "kind": "Variable",
        "name": { "kind": "Name", "value": "id" },
      },
      "type": {
        "kind": "NonNullType",
        "type": {
          "kind": "NamedType",
          "name": { "kind": "Name", "value": "ID" },
        },
      },
    }, {
      "kind": "VariableDefinition",
      "variable": {
        "kind": "Variable",
        "name": { "kind": "Name", "value": "admin" },
      },
      "type": {
        "kind": "NonNullType",
        "type": {
          "kind": "NamedType",
          "name": { "kind": "Name", "value": "Boolean" },
        },
      },
    }],
    "selectionSet": {
      "kind": "SelectionSet",
      "selections": [{
        "kind": "Field",
        "name": { "kind": "Name", "value": "setAdmin" },
        "arguments": [{
          "kind": "Argument",
          "name": { "kind": "Name", "value": "id" },
          "value": {
            "kind": "Variable",
            "name": { "kind": "Name", "value": "id" },
          },
        }, {
          "kind": "Argument",
          "name": { "kind": "Name", "value": "admin" },
          "value": {
            "kind": "Variable",
            "name": { "kind": "Name", "value": "admin" },
          },
        }],
        "selectionSet": {
          "kind": "SelectionSet",
          "selections": [{
            "kind": "FragmentSpread",
            "name": { "kind": "Name", "value": "userFields" },
          }],
        },
      }],
    },
  }, {
    "kind": "FragmentDefinition",
    "name": { "kind": "Name", "value": "userFields" },
    "typeCondition": {
      "kind": "NamedType",
      "name": { "kind": "Name", "value": "User" },
    },
    "selectionSet": {
      "kind": "SelectionSet",
      "selections": [
        { "kind": "Field", "name": { "kind": "Name", "value": "id" } },
        { "kind": "Field", "name": { "kind": "Name", "value": "name" } },
        { "kind": "Field", "name": { "kind": "Name", "value": "admin" } },
        { "kind": "Field", "name": { "kind": "Name", "value": "blocked" } },
        { "kind": "Field", "name": { "kind": "Name", "value": "email" } },
        { "kind": "Field", "name": { "kind": "Name", "value": "provider" } },
        { "kind": "Field", "name": { "kind": "Name", "value": "lastSeen" } },
        { "kind": "Field", "name": { "kind": "Name", "value": "created" } },
        { "kind": "Field", "name": { "kind": "Name", "value": "avatar" } },
        { "kind": "Field", "name": { "kind": "Name", "value": "github" } },
        { "kind": "Field", "name": { "kind": "Name", "value": "institution" } },
        { "kind": "Field", "name": { "kind": "Name", "value": "location" } },
        { "kind": "Field", "name": { "kind": "Name", "value": "modified" } },
        { "kind": "Field", "name": { "kind": "Name", "value": "orcid" } },
      ],
    },
  }],
} as unknown as DocumentNode<SetAdminMutation, SetAdminMutationVariables>
export const SetBlockedDocument = {
  "kind": "Document",
  "definitions": [{
    "kind": "OperationDefinition",
    "operation": "mutation",
    "name": { "kind": "Name", "value": "SetBlocked" },
    "variableDefinitions": [{
      "kind": "VariableDefinition",
      "variable": {
        "kind": "Variable",
        "name": { "kind": "Name", "value": "id" },
      },
      "type": {
        "kind": "NonNullType",
        "type": {
          "kind": "NamedType",
          "name": { "kind": "Name", "value": "ID" },
        },
      },
    }, {
      "kind": "VariableDefinition",
      "variable": {
        "kind": "Variable",
        "name": { "kind": "Name", "value": "blocked" },
      },
      "type": {
        "kind": "NonNullType",
        "type": {
          "kind": "NamedType",
          "name": { "kind": "Name", "value": "Boolean" },
        },
      },
    }],
    "selectionSet": {
      "kind": "SelectionSet",
      "selections": [{
        "kind": "Field",
        "name": { "kind": "Name", "value": "setBlocked" },
        "arguments": [{
          "kind": "Argument",
          "name": { "kind": "Name", "value": "id" },
          "value": {
            "kind": "Variable",
            "name": { "kind": "Name", "value": "id" },
          },
        }, {
          "kind": "Argument",
          "name": { "kind": "Name", "value": "blocked" },
          "value": {
            "kind": "Variable",
            "name": { "kind": "Name", "value": "blocked" },
          },
        }],
        "selectionSet": {
          "kind": "SelectionSet",
          "selections": [{
            "kind": "FragmentSpread",
            "name": { "kind": "Name", "value": "userFields" },
          }],
        },
      }],
    },
  }, {
    "kind": "FragmentDefinition",
    "name": { "kind": "Name", "value": "userFields" },
    "typeCondition": {
      "kind": "NamedType",
      "name": { "kind": "Name", "value": "User" },
    },
    "selectionSet": {
      "kind": "SelectionSet",
      "selections": [
        { "kind": "Field", "name": { "kind": "Name", "value": "id" } },
        { "kind": "Field", "name": { "kind": "Name", "value": "name" } },
        { "kind": "Field", "name": { "kind": "Name", "value": "admin" } },
        { "kind": "Field", "name": { "kind": "Name", "value": "blocked" } },
        { "kind": "Field", "name": { "kind": "Name", "value": "email" } },
        { "kind": "Field", "name": { "kind": "Name", "value": "provider" } },
        { "kind": "Field", "name": { "kind": "Name", "value": "lastSeen" } },
        { "kind": "Field", "name": { "kind": "Name", "value": "created" } },
        { "kind": "Field", "name": { "kind": "Name", "value": "avatar" } },
        { "kind": "Field", "name": { "kind": "Name", "value": "github" } },
        { "kind": "Field", "name": { "kind": "Name", "value": "institution" } },
        { "kind": "Field", "name": { "kind": "Name", "value": "location" } },
        { "kind": "Field", "name": { "kind": "Name", "value": "modified" } },
        { "kind": "Field", "name": { "kind": "Name", "value": "orcid" } },
      ],
    },
  }],
} as unknown as DocumentNode<SetBlockedMutation, SetBlockedMutationVariables>
