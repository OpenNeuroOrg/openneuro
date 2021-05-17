import { gql } from '@apollo/client'
import * as Apollo from '@apollo/client'
export type Maybe<T> = T | null
export type Exact<T extends { [key: string]: unknown }> = {
  [K in keyof T]: T[K]
}
export type MakeOptional<T, K extends keyof T> = Omit<T, K> &
  { [SubKey in K]?: Maybe<T[SubKey]> }
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> &
  { [SubKey in K]: Maybe<T[SubKey]> }
const defaultOptions = {}
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: string
  String: string
  Boolean: boolean
  Int: number
  Float: number
  BigInt: any
  Date: any
  DateTime: any
  Time: any
}

export type Analytic = {
  __typename?: 'Analytic'
  datasetId: Scalars['ID']
  tag?: Maybe<Scalars['String']>
  views?: Maybe<Scalars['Int']>
  downloads?: Maybe<Scalars['Int']>
}

export enum AnalyticTypes {
  Downloads = 'downloads',
  Views = 'views',
}

export type Author = {
  __typename?: 'Author'
  ORCID?: Maybe<Scalars['String']>
  name?: Maybe<Scalars['String']>
}

export enum CacheControlScope {
  Public = 'PUBLIC',
  Private = 'PRIVATE',
}

export type Comment = {
  __typename?: 'Comment'
  id: Scalars['ID']
  text: Scalars['String']
  user?: Maybe<User>
  createDate: Scalars['DateTime']
  parent?: Maybe<Comment>
  replies?: Maybe<Array<Maybe<Comment>>>
}

export type Dataset = {
  __typename?: 'Dataset'
  id: Scalars['ID']
  created: Scalars['DateTime']
  uploader?: Maybe<User>
  public?: Maybe<Scalars['Boolean']>
  draft?: Maybe<Draft>
  snapshots?: Maybe<Array<Maybe<Snapshot>>>
  latestSnapshot: Snapshot
  permissions?: Maybe<DatasetPermissions>
  analytics?: Maybe<Analytic>
  stars?: Maybe<Array<Maybe<Star>>>
  followers?: Maybe<Array<Maybe<Follower>>>
  name?: Maybe<Scalars['String']>
  comments?: Maybe<Array<Maybe<Comment>>>
  following?: Maybe<Scalars['Boolean']>
  starred?: Maybe<Scalars['Boolean']>
  publishDate?: Maybe<Scalars['DateTime']>
  onBrainlife?: Maybe<Scalars['Boolean']>
  metadata?: Maybe<Metadata>
  history?: Maybe<Array<Maybe<DatasetCommit>>>
  worker?: Maybe<Scalars['String']>
}

export type DatasetChange = {
  __typename?: 'DatasetChange'
  datasetId: Scalars['String']
  created?: Maybe<Scalars['Boolean']>
  modified?: Maybe<Scalars['Boolean']>
  deleted?: Maybe<Scalars['Boolean']>
  timestamp?: Maybe<Scalars['DateTime']>
}

export type DatasetCommit = {
  __typename?: 'DatasetCommit'
  id: Scalars['ID']
  date?: Maybe<Scalars['DateTime']>
  authorName?: Maybe<Scalars['String']>
  authorEmail?: Maybe<Scalars['String']>
  message?: Maybe<Scalars['String']>
  references?: Maybe<Scalars['String']>
}

export type DatasetConnection = {
  __typename?: 'DatasetConnection'
  edges?: Maybe<Array<Maybe<DatasetEdge>>>
  pageInfo: PageInfo
}

export type DatasetEdge = {
  __typename?: 'DatasetEdge'
  node: Dataset
  cursor: Scalars['String']
}

export type DatasetFile = {
  __typename?: 'DatasetFile'
  id: Scalars['ID']
  key?: Maybe<Scalars['String']>
  filename: Scalars['String']
  size?: Maybe<Scalars['BigInt']>
  annexed?: Maybe<Scalars['Boolean']>
  urls?: Maybe<Array<Maybe<Scalars['String']>>>
  objectpath?: Maybe<Scalars['String']>
  directory?: Maybe<Scalars['Boolean']>
}

export type DatasetFilter = {
  /** Limit to datasets available publicly */
  public?: Maybe<Scalars['Boolean']>
  /** Return only datasets that are shared with the user */
  shared?: Maybe<Scalars['Boolean']>
  /** Return only datasets with an invalid Draft */
  invalid?: Maybe<Scalars['Boolean']>
  /** Return only datasets starred by the query user */
  starred?: Maybe<Scalars['Boolean']>
  /** Return all datasets, ignores any other constraints but not sorts */
  all?: Maybe<Scalars['Boolean']>
}

export type DatasetId = {
  __typename?: 'DatasetId'
  datasetId?: Maybe<Scalars['ID']>
}

export type DatasetPermissions = {
  __typename?: 'DatasetPermissions'
  id: Scalars['ID']
  userPermissions?: Maybe<Array<Maybe<Permission>>>
}

export type DatasetSort = {
  created?: Maybe<SortOrdering>
  name?: Maybe<SortOrdering>
  uploader?: Maybe<SortOrdering>
  stars?: Maybe<SortOrdering>
  downloads?: Maybe<SortOrdering>
  views?: Maybe<SortOrdering>
  subscriptions?: Maybe<SortOrdering>
  publishDate?: Maybe<SortOrdering>
}

export type DeleteFile = {
  path: Scalars['String']
  filename?: Maybe<Scalars['String']>
}

export type Description = {
  __typename?: 'Description'
  id: Scalars['ID']
  Name: Scalars['String']
  BIDSVersion: Scalars['String']
  License?: Maybe<Scalars['String']>
  Authors?: Maybe<Array<Maybe<Scalars['String']>>>
  Acknowledgements?: Maybe<Scalars['String']>
  HowToAcknowledge?: Maybe<Scalars['String']>
  Funding?: Maybe<Array<Maybe<Scalars['String']>>>
  ReferencesAndLinks?: Maybe<Array<Maybe<Scalars['String']>>>
  DatasetDOI?: Maybe<Scalars['String']>
  EthicsApprovals?: Maybe<Array<Maybe<Scalars['String']>>>
}

export type Draft = {
  __typename?: 'Draft'
  id?: Maybe<Scalars['ID']>
  dataset?: Maybe<Dataset>
  modified?: Maybe<Scalars['DateTime']>
  summary?: Maybe<Summary>
  issues?: Maybe<Array<Maybe<ValidationIssue>>>
  files?: Maybe<Array<Maybe<DatasetFile>>>
  description?: Maybe<Description>
  readme?: Maybe<Scalars['String']>
  uploads?: Maybe<Array<Maybe<UploadMetadata>>>
  head?: Maybe<Scalars['String']>
}

export type DraftFilesArgs = {
  untracked?: Maybe<Scalars['Boolean']>
  prefix?: Maybe<Scalars['String']>
}

export type FilesUpdate = {
  __typename?: 'FilesUpdate'
  datasetId?: Maybe<Scalars['String']>
  action?: Maybe<Scalars['String']>
  payload?: Maybe<Array<Maybe<DatasetFile>>>
}

export type FlaggedFile = {
  __typename?: 'FlaggedFile'
  datasetId?: Maybe<Scalars['String']>
  snapshot?: Maybe<Scalars['String']>
  filepath?: Maybe<Scalars['String']>
  annexKey?: Maybe<Scalars['String']>
  removed?: Maybe<Scalars['Boolean']>
  remover?: Maybe<User>
  flagged?: Maybe<Scalars['Boolean']>
  flagger?: Maybe<User>
  createdAt?: Maybe<Scalars['DateTime']>
}

export type Follower = {
  __typename?: 'Follower'
  userId?: Maybe<Scalars['String']>
  datasetId?: Maybe<Scalars['String']>
}

export type Metadata = {
  __typename?: 'Metadata'
  datasetId: Scalars['ID']
  datasetUrl?: Maybe<Scalars['String']>
  datasetName?: Maybe<Scalars['String']>
  firstSnapshotCreatedAt?: Maybe<Scalars['DateTime']>
  latestSnapshotCreatedAt?: Maybe<Scalars['DateTime']>
  dxStatus?: Maybe<Scalars['String']>
  tasksCompleted?: Maybe<Array<Maybe<Scalars['String']>>>
  trialCount?: Maybe<Scalars['Int']>
  studyDesign?: Maybe<Scalars['String']>
  studyDomain?: Maybe<Scalars['String']>
  studyLongitudinal?: Maybe<Scalars['String']>
  dataProcessed?: Maybe<Scalars['Boolean']>
  species?: Maybe<Scalars['String']>
  associatedPaperDOI?: Maybe<Scalars['String']>
  openneuroPaperDOI?: Maybe<Scalars['String']>
  seniorAuthor?: Maybe<Scalars['String']>
  adminUsers?: Maybe<Array<Maybe<Scalars['String']>>>
  ages?: Maybe<Array<Maybe<Scalars['Int']>>>
  modalities?: Maybe<Array<Maybe<Scalars['String']>>>
  grantFunderName?: Maybe<Scalars['String']>
  grantIdentifier?: Maybe<Scalars['String']>
  affirmedDefaced?: Maybe<Scalars['Boolean']>
  affirmedConsent?: Maybe<Scalars['Boolean']>
}

export type MetadataInput = {
  datasetId: Scalars['ID']
  datasetUrl?: Maybe<Scalars['String']>
  datasetName?: Maybe<Scalars['String']>
  firstSnapshotCreatedAt?: Maybe<Scalars['DateTime']>
  latestSnapshotCreatedAt?: Maybe<Scalars['DateTime']>
  dxStatus?: Maybe<Scalars['String']>
  tasksCompleted?: Maybe<Array<Maybe<Scalars['String']>>>
  trialCount?: Maybe<Scalars['Int']>
  studyDesign?: Maybe<Scalars['String']>
  studyDomain?: Maybe<Scalars['String']>
  studyLongitudinal?: Maybe<Scalars['String']>
  dataProcessed?: Maybe<Scalars['Boolean']>
  species?: Maybe<Scalars['String']>
  associatedPaperDOI?: Maybe<Scalars['String']>
  openneuroPaperDOI?: Maybe<Scalars['String']>
  seniorAuthor?: Maybe<Scalars['String']>
  adminUsers?: Maybe<Array<Maybe<Scalars['String']>>>
  ages?: Maybe<Array<Maybe<Scalars['Int']>>>
  modalities?: Maybe<Array<Maybe<Scalars['String']>>>
  grantFunderName?: Maybe<Scalars['String']>
  grantIdentifier?: Maybe<Scalars['String']>
  affirmedDefaced?: Maybe<Scalars['Boolean']>
  affirmedConsent?: Maybe<Scalars['Boolean']>
}

export type Mutation = {
  __typename?: 'Mutation'
  createDataset?: Maybe<Dataset>
  deleteDataset?: Maybe<Scalars['Boolean']>
  createSnapshot?: Maybe<Snapshot>
  deleteSnapshot: Scalars['Boolean']
  removeAnnexObject?: Maybe<Scalars['Boolean']>
  flagAnnexObject?: Maybe<Scalars['Boolean']>
  deleteFiles?: Maybe<Scalars['Boolean']>
  updatePublic: Scalars['Boolean']
  updateSummary?: Maybe<Summary>
  updateValidation?: Maybe<Scalars['Boolean']>
  updatePermissions?: Maybe<User>
  removePermissions?: Maybe<Scalars['Boolean']>
  removeUser?: Maybe<Scalars['Boolean']>
  setAdmin?: Maybe<User>
  setBlocked?: Maybe<User>
  trackAnalytics?: Maybe<Scalars['Boolean']>
  followDataset?: Maybe<Scalars['Boolean']>
  starDataset?: Maybe<Scalars['Boolean']>
  publishDataset?: Maybe<Scalars['Boolean']>
  updateDescription?: Maybe<Description>
  updateDescriptionList?: Maybe<Description>
  updateReadme?: Maybe<Scalars['Boolean']>
  addComment?: Maybe<Scalars['ID']>
  editComment?: Maybe<Scalars['Boolean']>
  deleteComment?: Maybe<Array<Maybe<Scalars['String']>>>
  subscribeToNewsletter?: Maybe<Scalars['Boolean']>
  addMetadata?: Maybe<Metadata>
  updateRef?: Maybe<Scalars['Boolean']>
  prepareUpload?: Maybe<UploadMetadata>
  finishUpload?: Maybe<Scalars['Boolean']>
  cacheClear?: Maybe<Scalars['Boolean']>
  revalidate?: Maybe<Scalars['Boolean']>
  prepareRepoAccess?: Maybe<RepoMetadata>
  reexportRemotes?: Maybe<Scalars['Boolean']>
  resetDraft?: Maybe<Scalars['Boolean']>
}

export type MutationCreateDatasetArgs = {
  affirmedDefaced?: Maybe<Scalars['Boolean']>
  affirmedConsent?: Maybe<Scalars['Boolean']>
}

export type MutationDeleteDatasetArgs = {
  id: Scalars['ID']
  reason?: Maybe<Scalars['String']>
  redirect?: Maybe<Scalars['String']>
}

export type MutationCreateSnapshotArgs = {
  datasetId: Scalars['ID']
  tag: Scalars['String']
  changes?: Maybe<Array<Scalars['String']>>
}

export type MutationDeleteSnapshotArgs = {
  datasetId: Scalars['ID']
  tag: Scalars['String']
}

export type MutationRemoveAnnexObjectArgs = {
  datasetId: Scalars['ID']
  snapshot: Scalars['String']
  annexKey: Scalars['String']
  path?: Maybe<Scalars['String']>
  filename?: Maybe<Scalars['String']>
}

export type MutationFlagAnnexObjectArgs = {
  datasetId: Scalars['ID']
  snapshot: Scalars['String']
  filepath: Scalars['String']
  annexKey: Scalars['String']
}

export type MutationDeleteFilesArgs = {
  datasetId: Scalars['ID']
  files?: Maybe<Array<Maybe<DeleteFile>>>
}

export type MutationUpdatePublicArgs = {
  datasetId: Scalars['ID']
  publicFlag: Scalars['Boolean']
}

export type MutationUpdateSummaryArgs = {
  summary: SummaryInput
}

export type MutationUpdateValidationArgs = {
  validation: ValidationInput
}

export type MutationUpdatePermissionsArgs = {
  datasetId: Scalars['ID']
  userEmail: Scalars['String']
  level?: Maybe<Scalars['String']>
}

export type MutationRemovePermissionsArgs = {
  datasetId: Scalars['ID']
  userId: Scalars['String']
}

export type MutationRemoveUserArgs = {
  id: Scalars['ID']
}

export type MutationSetAdminArgs = {
  id: Scalars['ID']
  admin: Scalars['Boolean']
}

export type MutationSetBlockedArgs = {
  id: Scalars['ID']
  blocked: Scalars['Boolean']
}

export type MutationTrackAnalyticsArgs = {
  datasetId: Scalars['ID']
  tag?: Maybe<Scalars['String']>
  type?: Maybe<AnalyticTypes>
}

export type MutationFollowDatasetArgs = {
  datasetId: Scalars['ID']
}

export type MutationStarDatasetArgs = {
  datasetId: Scalars['ID']
}

export type MutationPublishDatasetArgs = {
  datasetId: Scalars['ID']
}

export type MutationUpdateDescriptionArgs = {
  datasetId: Scalars['ID']
  field: Scalars['String']
  value: Scalars['String']
}

export type MutationUpdateDescriptionListArgs = {
  datasetId: Scalars['ID']
  field: Scalars['String']
  value?: Maybe<Array<Scalars['String']>>
}

export type MutationUpdateReadmeArgs = {
  datasetId: Scalars['ID']
  value: Scalars['String']
}

export type MutationAddCommentArgs = {
  datasetId: Scalars['ID']
  parentId?: Maybe<Scalars['ID']>
  comment: Scalars['String']
}

export type MutationEditCommentArgs = {
  commentId: Scalars['ID']
  comment: Scalars['String']
}

export type MutationDeleteCommentArgs = {
  commentId: Scalars['ID']
  deleteChildren?: Maybe<Scalars['Boolean']>
}

export type MutationSubscribeToNewsletterArgs = {
  email: Scalars['String']
}

export type MutationAddMetadataArgs = {
  datasetId: Scalars['ID']
  metadata: MetadataInput
}

export type MutationUpdateRefArgs = {
  datasetId: Scalars['ID']
  ref: Scalars['String']
}

export type MutationPrepareUploadArgs = {
  datasetId: Scalars['ID']
  uploadId: Scalars['ID']
}

export type MutationFinishUploadArgs = {
  uploadId: Scalars['ID']
}

export type MutationCacheClearArgs = {
  datasetId: Scalars['ID']
}

export type MutationRevalidateArgs = {
  datasetId: Scalars['ID']
  ref: Scalars['String']
}

export type MutationPrepareRepoAccessArgs = {
  datasetId: Scalars['ID']
}

export type MutationReexportRemotesArgs = {
  datasetId: Scalars['ID']
}

export type MutationResetDraftArgs = {
  datasetId: Scalars['ID']
  ref: Scalars['String']
}

export type PageInfo = {
  __typename?: 'PageInfo'
  hasNextPage: Scalars['Boolean']
  hasPreviousPage: Scalars['Boolean']
  startCursor?: Maybe<Scalars['String']>
  endCursor?: Maybe<Scalars['String']>
  count?: Maybe<Scalars['Int']>
}

export type Permission = {
  __typename?: 'Permission'
  datasetId: Scalars['ID']
  userId: Scalars['String']
  level: Scalars['String']
  user?: Maybe<User>
}

export type Query = {
  __typename?: 'Query'
  dataset?: Maybe<Dataset>
  datasets?: Maybe<DatasetConnection>
  searchDatasets?: Maybe<DatasetConnection>
  user?: Maybe<User>
  users?: Maybe<Array<Maybe<User>>>
  participantCount?: Maybe<Scalars['Int']>
  snapshot?: Maybe<Snapshot>
  datasetChanges?: Maybe<Array<Maybe<DatasetChange>>>
  flaggedFiles?: Maybe<Array<Maybe<FlaggedFile>>>
}

export type QueryDatasetArgs = {
  id: Scalars['ID']
}

export type QueryDatasetsArgs = {
  first?: Maybe<Scalars['Int']>
  after?: Maybe<Scalars['String']>
  before?: Maybe<Scalars['String']>
  orderBy?: Maybe<DatasetSort>
  filterBy?: Maybe<DatasetFilter>
  myDatasets?: Maybe<Scalars['Boolean']>
}

export type QuerySearchDatasetsArgs = {
  q: Scalars['String']
  after?: Maybe<Scalars['String']>
  first?: Maybe<Scalars['Int']>
}

export type QueryUserArgs = {
  id: Scalars['ID']
}

export type QuerySnapshotArgs = {
  datasetId: Scalars['ID']
  tag: Scalars['String']
}

export type QueryDatasetChangesArgs = {
  limit?: Maybe<Scalars['Int']>
}

export type QueryFlaggedFilesArgs = {
  flagged?: Maybe<Scalars['Boolean']>
  deleted?: Maybe<Scalars['Boolean']>
}

export type RepoMetadata = {
  __typename?: 'RepoMetadata'
  token?: Maybe<Scalars['String']>
  endpoint?: Maybe<Scalars['Int']>
}

export enum Severity {
  Error = 'error',
  Warning = 'warning',
}

export type Snapshot = {
  __typename?: 'Snapshot'
  id: Scalars['ID']
  tag: Scalars['String']
  dataset: Dataset
  created?: Maybe<Scalars['DateTime']>
  summary?: Maybe<Summary>
  issues?: Maybe<Array<Maybe<ValidationIssue>>>
  files?: Maybe<Array<Maybe<DatasetFile>>>
  description?: Maybe<Description>
  analytics?: Maybe<Analytic>
  readme?: Maybe<Scalars['String']>
  hexsha?: Maybe<Scalars['String']>
}

export type SnapshotFilesArgs = {
  prefix?: Maybe<Scalars['String']>
}

export enum SortOrdering {
  Ascending = 'ascending',
  Descending = 'descending',
}

export type Star = {
  __typename?: 'Star'
  userId?: Maybe<Scalars['String']>
  datasetId?: Maybe<Scalars['String']>
}

export type SubjectMetadata = {
  __typename?: 'SubjectMetadata'
  participantId: Scalars['String']
  age?: Maybe<Scalars['Int']>
  sex?: Maybe<Scalars['String']>
  group?: Maybe<Scalars['String']>
}

export type SubjectMetadataInput = {
  participantId: Scalars['String']
  age?: Maybe<Scalars['Int']>
  sex?: Maybe<Scalars['String']>
  group?: Maybe<Scalars['String']>
}

export type Subscription = {
  __typename?: 'Subscription'
  datasetDeleted: Scalars['ID']
  snapshotsUpdated?: Maybe<Dataset>
  draftUpdated?: Maybe<Dataset>
  permissionsUpdated?: Maybe<Dataset>
  filesUpdated?: Maybe<FilesUpdate>
  datasetChanged?: Maybe<DatasetChange>
}

export type SubscriptionDatasetDeletedArgs = {
  datasetIds?: Maybe<Array<Scalars['ID']>>
}

export type SubscriptionSnapshotsUpdatedArgs = {
  datasetId: Scalars['ID']
}

export type SubscriptionDraftUpdatedArgs = {
  datasetId: Scalars['ID']
}

export type SubscriptionPermissionsUpdatedArgs = {
  datasetIds?: Maybe<Array<Scalars['ID']>>
}

export type SubscriptionFilesUpdatedArgs = {
  datasetId: Scalars['ID']
}

export type Summary = {
  __typename?: 'Summary'
  id: Scalars['ID']
  modalities?: Maybe<Array<Maybe<Scalars['String']>>>
  sessions?: Maybe<Array<Maybe<Scalars['String']>>>
  subjects?: Maybe<Array<Maybe<Scalars['String']>>>
  subjectMetadata?: Maybe<Array<Maybe<SubjectMetadata>>>
  tasks?: Maybe<Array<Maybe<Scalars['String']>>>
  size: Scalars['BigInt']
  totalFiles: Scalars['Int']
  dataProcessed?: Maybe<Scalars['Boolean']>
}

export type SummaryInput = {
  id: Scalars['ID']
  datasetId: Scalars['ID']
  modalities?: Maybe<Array<Maybe<Scalars['String']>>>
  sessions?: Maybe<Array<Maybe<Scalars['String']>>>
  subjects?: Maybe<Array<Maybe<Scalars['String']>>>
  subjectMetadata?: Maybe<Array<Maybe<SubjectMetadataInput>>>
  tasks?: Maybe<Array<Maybe<Scalars['String']>>>
  size: Scalars['BigInt']
  totalFiles: Scalars['Int']
  dataProcessed?: Maybe<Scalars['Boolean']>
}

export type UploadFile = {
  filename: Scalars['String']
  size: Scalars['BigInt']
}

export type UploadMetadata = {
  __typename?: 'UploadMetadata'
  id: Scalars['ID']
  datasetId: Scalars['ID']
  complete: Scalars['Boolean']
  estimatedSize?: Maybe<Scalars['BigInt']>
  token?: Maybe<Scalars['String']>
  endpoint?: Maybe<Scalars['Int']>
}

export type User = {
  __typename?: 'User'
  id: Scalars['ID']
  provider?: Maybe<UserProvider>
  avatar?: Maybe<Scalars['String']>
  created: Scalars['DateTime']
  modified?: Maybe<Scalars['DateTime']>
  lastSeen?: Maybe<Scalars['DateTime']>
  email: Scalars['String']
  name: Scalars['String']
  admin?: Maybe<Scalars['Boolean']>
  blocked?: Maybe<Scalars['Boolean']>
}

export enum UserProvider {
  Google = 'google',
  Orcid = 'orcid',
  Globus = 'globus',
}

export type ValidationInput = {
  id: Scalars['ID']
  datasetId: Scalars['ID']
  issues: Array<Maybe<ValidationIssueInput>>
}

export type ValidationIssue = {
  __typename?: 'ValidationIssue'
  severity: Severity
  key: Scalars['String']
  code: Scalars['Int']
  reason: Scalars['String']
  files?: Maybe<Array<Maybe<ValidationIssueFile>>>
  additionalFileCount?: Maybe<Scalars['Int']>
  helpUrl?: Maybe<Scalars['String']>
}

export type ValidationIssueFile = {
  __typename?: 'ValidationIssueFile'
  key: Scalars['String']
  code: Scalars['Int']
  file?: Maybe<ValidationIssueFileDetail>
  evidence?: Maybe<Scalars['String']>
  line?: Maybe<Scalars['Int']>
  character?: Maybe<Scalars['Int']>
  severity: Severity
  reason?: Maybe<Scalars['String']>
  helpUrl?: Maybe<Scalars['String']>
}

export type ValidationIssueFileDetail = {
  __typename?: 'ValidationIssueFileDetail'
  name?: Maybe<Scalars['String']>
  path?: Maybe<Scalars['String']>
  relativePath?: Maybe<Scalars['String']>
}

export type ValidationIssueFileDetailInput = {
  name?: Maybe<Scalars['String']>
  path?: Maybe<Scalars['String']>
  relativePath?: Maybe<Scalars['String']>
  webkitRelativePath?: Maybe<Scalars['String']>
}

export type ValidationIssueFileInput = {
  key: Scalars['String']
  code: Scalars['Int']
  file?: Maybe<ValidationIssueFileDetailInput>
  evidence?: Maybe<Scalars['String']>
  line?: Maybe<Scalars['Int']>
  character?: Maybe<Scalars['Int']>
  severity: Severity
  reason?: Maybe<Scalars['String']>
  helpUrl?: Maybe<Scalars['String']>
}

export type ValidationIssueInput = {
  severity: Severity
  key: Scalars['String']
  code: Scalars['Int']
  reason: Scalars['String']
  files?: Maybe<Array<Maybe<ValidationIssueFileInput>>>
  additionalFileCount?: Maybe<Scalars['Int']>
  helpUrl?: Maybe<Scalars['String']>
}

export type ValidationUpdate = {
  __typename?: 'ValidationUpdate'
  id: Scalars['ID']
  datasetId: Scalars['ID']
  issues?: Maybe<Array<Maybe<ValidationIssue>>>
}

export type FlaggedFilesQueryVariables = Exact<{
  flagged?: Maybe<Scalars['Boolean']>
  deleted?: Maybe<Scalars['Boolean']>
}>

export type FlaggedFilesQuery = { __typename?: 'Query' } & {
  flaggedFiles?: Maybe<
    Array<
      Maybe<
        { __typename?: 'FlaggedFile' } & Pick<
          FlaggedFile,
          'datasetId' | 'snapshot' | 'filepath'
        > & {
            flagger?: Maybe<
              { __typename?: 'User' } & Pick<User, 'name' | 'email'>
            >
          }
      >
    >
  >
}

export type UserFieldsFragment = { __typename?: 'User' } & Pick<
  User,
  | 'id'
  | 'name'
  | 'email'
  | 'provider'
  | 'admin'
  | 'created'
  | 'lastSeen'
  | 'blocked'
>

export type SetAdminPermissionsMutationVariables = Exact<{
  id: Scalars['ID']
  admin: Scalars['Boolean']
}>

export type SetAdminPermissionsMutation = { __typename?: 'Mutation' } & {
  setAdmin?: Maybe<
    { __typename?: 'User' } & Pick<
      User,
      | 'id'
      | 'name'
      | 'email'
      | 'provider'
      | 'admin'
      | 'created'
      | 'lastSeen'
      | 'blocked'
    >
  >
}

export type SetBlockedMutationVariables = Exact<{
  id: Scalars['ID']
  blocked: Scalars['Boolean']
}>

export type SetBlockedMutation = { __typename?: 'Mutation' } & {
  setBlocked?: Maybe<
    { __typename?: 'User' } & Pick<
      User,
      | 'id'
      | 'name'
      | 'email'
      | 'provider'
      | 'admin'
      | 'created'
      | 'lastSeen'
      | 'blocked'
    >
  >
}

export type Unnamed_1_QueryVariables = Exact<{ [key: string]: never }>

export type Unnamed_1_Query = { __typename?: 'Query' } & {
  users?: Maybe<Array<Maybe<{ __typename?: 'User' } & UserFieldsFragment>>>
}

export type DatasetCommentsFragment = { __typename?: 'Dataset' } & Pick<
  Dataset,
  'id'
> & {
    comments?: Maybe<
      Array<
        Maybe<
          { __typename?: 'Comment' } & Pick<
            Comment,
            'id' | 'text' | 'createDate'
          > & {
              user?: Maybe<{ __typename?: 'User' } & Pick<User, 'email'>>
              parent?: Maybe<{ __typename?: 'Comment' } & Pick<Comment, 'id'>>
              replies?: Maybe<
                Array<Maybe<{ __typename?: 'Comment' } & Pick<Comment, 'id'>>>
              >
            }
        >
      >
    >
  }

export type DatasetDraftFragment = { __typename?: 'Dataset' } & Pick<
  Dataset,
  'id'
> & {
    draft?: Maybe<
      { __typename?: 'Draft' } & Pick<
        Draft,
        'id' | 'modified' | 'readme' | 'head'
      > & {
          description?: Maybe<
            { __typename?: 'Description' } & Pick<
              Description,
              | 'Name'
              | 'Authors'
              | 'DatasetDOI'
              | 'License'
              | 'Acknowledgements'
              | 'HowToAcknowledge'
              | 'Funding'
              | 'ReferencesAndLinks'
              | 'EthicsApprovals'
            >
          >
          summary?: Maybe<
            { __typename?: 'Summary' } & Pick<
              Summary,
              | 'modalities'
              | 'sessions'
              | 'subjects'
              | 'tasks'
              | 'size'
              | 'totalFiles'
              | 'dataProcessed'
            > & {
                subjectMetadata?: Maybe<
                  Array<
                    Maybe<
                      { __typename?: 'SubjectMetadata' } & Pick<
                        SubjectMetadata,
                        'participantId' | 'age' | 'sex' | 'group'
                      >
                    >
                  >
                >
              }
          >
        }
    >
  }

export type DatasetDraftFilesFragment = { __typename?: 'Dataset' } & Pick<
  Dataset,
  'id'
> & {
    draft?: Maybe<
      { __typename?: 'Draft' } & Pick<Draft, 'id'> & {
          files?: Maybe<
            Array<
              Maybe<
                { __typename?: 'DatasetFile' } & Pick<
                  DatasetFile,
                  'id' | 'key' | 'filename' | 'size' | 'directory' | 'annexed'
                >
              >
            >
          >
        }
    >
  }

export type DatasetPermissionsFragment = { __typename?: 'Dataset' } & Pick<
  Dataset,
  'id'
> & {
    permissions?: Maybe<
      { __typename?: 'DatasetPermissions' } & Pick<DatasetPermissions, 'id'> & {
          userPermissions?: Maybe<
            Array<
              Maybe<
                { __typename?: 'Permission' } & Pick<Permission, 'level'> & {
                    user?: Maybe<
                      { __typename?: 'User' } & Pick<User, 'id' | 'email'>
                    >
                  }
              >
            >
          >
        }
    >
  }

export type DatasetSnapshotsFragment = { __typename?: 'Dataset' } & Pick<
  Dataset,
  'id'
> & {
    snapshots?: Maybe<
      Array<
        Maybe<
          { __typename?: 'Snapshot' } & Pick<
            Snapshot,
            'id' | 'tag' | 'created' | 'hexsha'
          >
        >
      >
    >
  }

export type DatasetIssuesFragment = { __typename?: 'Dataset' } & Pick<
  Dataset,
  'id'
> & {
    draft?: Maybe<
      { __typename?: 'Draft' } & Pick<Draft, 'id'> & {
          issues?: Maybe<
            Array<
              Maybe<
                { __typename?: 'ValidationIssue' } & Pick<
                  ValidationIssue,
                  'severity' | 'code' | 'reason' | 'additionalFileCount'
                > & {
                    files?: Maybe<
                      Array<
                        Maybe<
                          { __typename?: 'ValidationIssueFile' } & Pick<
                            ValidationIssueFile,
                            'evidence' | 'line' | 'character' | 'reason'
                          > & {
                              file?: Maybe<
                                {
                                  __typename?: 'ValidationIssueFileDetail'
                                } & Pick<
                                  ValidationIssueFileDetail,
                                  'name' | 'path' | 'relativePath'
                                >
                              >
                            }
                        >
                      >
                    >
                  }
              >
            >
          >
        }
    >
  }

export type SnapshotIssuesFragment = { __typename?: 'Snapshot' } & Pick<
  Snapshot,
  'id'
> & {
    issues?: Maybe<
      Array<
        Maybe<
          { __typename?: 'ValidationIssue' } & Pick<
            ValidationIssue,
            'severity' | 'code' | 'reason' | 'additionalFileCount'
          > & {
              files?: Maybe<
                Array<
                  Maybe<
                    { __typename?: 'ValidationIssueFile' } & Pick<
                      ValidationIssueFile,
                      'evidence' | 'line' | 'character' | 'reason'
                    > & {
                        file?: Maybe<
                          { __typename?: 'ValidationIssueFileDetail' } & Pick<
                            ValidationIssueFileDetail,
                            'name' | 'path' | 'relativePath'
                          >
                        >
                      }
                  >
                >
              >
            }
        >
      >
    >
  }

export type SnapshotFieldsFragment = { __typename?: 'Snapshot' } & Pick<
  Snapshot,
  'id' | 'tag' | 'created' | 'readme' | 'hexsha'
> & {
    description?: Maybe<
      { __typename?: 'Description' } & Pick<
        Description,
        | 'Name'
        | 'Authors'
        | 'DatasetDOI'
        | 'License'
        | 'Acknowledgements'
        | 'HowToAcknowledge'
        | 'Funding'
        | 'ReferencesAndLinks'
        | 'EthicsApprovals'
      >
    >
    files?: Maybe<
      Array<
        Maybe<
          { __typename?: 'DatasetFile' } & Pick<
            DatasetFile,
            'id' | 'key' | 'filename' | 'size' | 'directory' | 'annexed'
          >
        >
      >
    >
    summary?: Maybe<
      { __typename?: 'Summary' } & Pick<
        Summary,
        | 'modalities'
        | 'sessions'
        | 'subjects'
        | 'tasks'
        | 'size'
        | 'totalFiles'
        | 'dataProcessed'
      > & {
          subjectMetadata?: Maybe<
            Array<
              Maybe<
                { __typename?: 'SubjectMetadata' } & Pick<
                  SubjectMetadata,
                  'participantId' | 'age' | 'sex' | 'group'
                >
              >
            >
          >
        }
    >
    analytics?: Maybe<
      { __typename?: 'Analytic' } & Pick<Analytic, 'downloads' | 'views'>
    >
  } & SnapshotIssuesFragment

export type DatasetMetadataFragment = { __typename?: 'Dataset' } & Pick<
  Dataset,
  'id'
> & {
    metadata?: Maybe<
      { __typename?: 'Metadata' } & Pick<
        Metadata,
        | 'datasetId'
        | 'datasetUrl'
        | 'datasetName'
        | 'firstSnapshotCreatedAt'
        | 'latestSnapshotCreatedAt'
        | 'dxStatus'
        | 'tasksCompleted'
        | 'trialCount'
        | 'grantFunderName'
        | 'grantIdentifier'
        | 'studyDesign'
        | 'studyDomain'
        | 'studyLongitudinal'
        | 'dataProcessed'
        | 'species'
        | 'associatedPaperDOI'
        | 'openneuroPaperDOI'
        | 'seniorAuthor'
        | 'adminUsers'
        | 'ages'
        | 'modalities'
        | 'affirmedDefaced'
        | 'affirmedConsent'
      >
    >
  }

export type GetDatasetPageQueryVariables = Exact<{
  datasetId: Scalars['ID']
}>

export type GetDatasetPageQuery = { __typename?: 'Query' } & {
  dataset?: Maybe<
    { __typename?: 'Dataset' } & Pick<
      Dataset,
      'id' | 'created' | 'public' | 'following' | 'starred' | 'onBrainlife'
    > & {
        uploader?: Maybe<
          { __typename?: 'User' } & Pick<User, 'id' | 'name' | 'email'>
        >
        analytics?: Maybe<
          { __typename?: 'Analytic' } & Pick<Analytic, 'downloads' | 'views'>
        >
      } & DatasetDraftFragment &
      DatasetPermissionsFragment &
      DatasetSnapshotsFragment &
      DatasetIssuesFragment &
      DatasetMetadataFragment &
      DatasetCommentsFragment
  >
}

export type GetDraftPageQueryVariables = Exact<{
  datasetId: Scalars['ID']
}>

export type GetDraftPageQuery = { __typename?: 'Query' } & {
  dataset?: Maybe<
    { __typename?: 'Dataset' } & Pick<
      Dataset,
      | 'id'
      | 'created'
      | 'public'
      | 'following'
      | 'starred'
      | 'worker'
      | 'onBrainlife'
    > & {
        uploader?: Maybe<
          { __typename?: 'User' } & Pick<User, 'id' | 'name' | 'email'>
        >
        analytics?: Maybe<
          { __typename?: 'Analytic' } & Pick<Analytic, 'downloads' | 'views'>
        >
      } & DatasetDraftFragment &
      DatasetDraftFilesFragment &
      DatasetPermissionsFragment &
      DatasetSnapshotsFragment &
      DatasetIssuesFragment &
      DatasetMetadataFragment &
      DatasetCommentsFragment
  >
}

export type GetHistoryQueryVariables = Exact<{
  datasetId: Scalars['ID']
}>

export type GetHistoryQuery = { __typename?: 'Query' } & {
  dataset?: Maybe<
    { __typename?: 'Dataset' } & Pick<Dataset, 'id' | 'worker'> & {
        history?: Maybe<
          Array<
            Maybe<
              { __typename?: 'DatasetCommit' } & Pick<
                DatasetCommit,
                | 'id'
                | 'authorName'
                | 'authorEmail'
                | 'date'
                | 'references'
                | 'message'
              >
            >
          >
        >
      }
  >
}

export type CacheClearMutationVariables = Exact<{
  datasetId: Scalars['ID']
}>

export type CacheClearMutation = { __typename?: 'Mutation' } & Pick<
  Mutation,
  'cacheClear'
>

export type AddCommentMutationVariables = Exact<{
  datasetId: Scalars['ID']
  parentId?: Maybe<Scalars['ID']>
  comment: Scalars['String']
}>

export type AddCommentMutation = { __typename?: 'Mutation' } & Pick<
  Mutation,
  'addComment'
>

export type EditCommentMutationVariables = Exact<{
  commentId: Scalars['ID']
  comment: Scalars['String']
}>

export type EditCommentMutation = { __typename?: 'Mutation' } & Pick<
  Mutation,
  'editComment'
>

export type DeleteCommentMutationVariables = Exact<{
  commentId: Scalars['ID']
  deleteChildren?: Maybe<Scalars['Boolean']>
}>

export type DeleteCommentMutation = { __typename?: 'Mutation' } & Pick<
  Mutation,
  'deleteComment'
>

export type DeleteDatasetMutationVariables = Exact<{
  id: Scalars['ID']
  reason?: Maybe<Scalars['String']>
  redirect?: Maybe<Scalars['String']>
}>

export type DeleteDatasetMutation = { __typename?: 'Mutation' } & Pick<
  Mutation,
  'deleteDataset'
>

export type UpdateDescriptionMutationVariables = Exact<{
  datasetId: Scalars['ID']
  field: Scalars['String']
  value: Scalars['String']
}>

export type UpdateDescriptionMutation = { __typename?: 'Mutation' } & {
  updateDescription?: Maybe<
    { __typename?: 'Description' } & Pick<
      Description,
      | 'id'
      | 'Name'
      | 'BIDSVersion'
      | 'License'
      | 'Authors'
      | 'Acknowledgements'
      | 'HowToAcknowledge'
      | 'Funding'
      | 'ReferencesAndLinks'
      | 'DatasetDOI'
      | 'EthicsApprovals'
    >
  >
}

export type UpdateDescriptionListMutationVariables = Exact<{
  datasetId: Scalars['ID']
  field: Scalars['String']
  value?: Maybe<Array<Scalars['String']> | Scalars['String']>
}>

export type UpdateDescriptionListMutation = { __typename?: 'Mutation' } & {
  updateDescriptionList?: Maybe<
    { __typename?: 'Description' } & Pick<
      Description,
      | 'id'
      | 'Name'
      | 'BIDSVersion'
      | 'License'
      | 'Authors'
      | 'Acknowledgements'
      | 'HowToAcknowledge'
      | 'Funding'
      | 'ReferencesAndLinks'
      | 'DatasetDOI'
      | 'EthicsApprovals'
    >
  >
}

export type FlagAnnexObjectMutationVariables = Exact<{
  datasetId: Scalars['ID']
  snapshot: Scalars['String']
  filepath: Scalars['String']
  annexKey: Scalars['String']
}>

export type FlagAnnexObjectMutation = { __typename?: 'Mutation' } & Pick<
  Mutation,
  'flagAnnexObject'
>

export type FollowDatasetMutationVariables = Exact<{
  datasetId: Scalars['ID']
}>

export type FollowDatasetMutation = { __typename?: 'Mutation' } & Pick<
  Mutation,
  'followDataset'
>

export type UserFollowingFragment = { __typename?: 'Dataset' } & Pick<
  Dataset,
  'id' | 'following'
>

export type PublishDatasetMutationVariables = Exact<{
  datasetId: Scalars['ID']
}>

export type PublishDatasetMutation = { __typename?: 'Mutation' } & Pick<
  Mutation,
  'publishDataset'
>

export type DatasetPublishedFragment = { __typename?: 'Dataset' } & Pick<
  Dataset,
  'id' | 'public'
>

export type UpdateReadmeMutationVariables = Exact<{
  datasetId: Scalars['ID']
  value: Scalars['String']
}>

export type UpdateReadmeMutation = { __typename?: 'Mutation' } & Pick<
  Mutation,
  'updateReadme'
>

export type RemoveAnnexObjectMutationVariables = Exact<{
  datasetId: Scalars['ID']
  snapshot: Scalars['String']
  annexKey: Scalars['String']
  path?: Maybe<Scalars['String']>
  filename?: Maybe<Scalars['String']>
}>

export type RemoveAnnexObjectMutation = { __typename?: 'Mutation' } & Pick<
  Mutation,
  'removeAnnexObject'
>

export type RemovePermissionsMutationVariables = Exact<{
  datasetId: Scalars['ID']
  userId: Scalars['String']
}>

export type RemovePermissionsMutation = { __typename?: 'Mutation' } & Pick<
  Mutation,
  'removePermissions'
>

export type RevalidateMutationVariables = Exact<{
  datasetId: Scalars['ID']
  ref: Scalars['String']
}>

export type RevalidateMutation = { __typename?: 'Mutation' } & Pick<
  Mutation,
  'revalidate'
>

export type StarDatasetMutationVariables = Exact<{
  datasetId: Scalars['ID']
}>

export type StarDatasetMutation = { __typename?: 'Mutation' } & Pick<
  Mutation,
  'starDataset'
>

export type UserStarredFragment = { __typename?: 'Dataset' } & Pick<
  Dataset,
  'id' | 'starred'
>

export type AddMetadataMutationVariables = Exact<{
  datasetId: Scalars['ID']
  metadata: MetadataInput
}>

export type AddMetadataMutation = { __typename?: 'Mutation' } & {
  addMetadata?: Maybe<
    { __typename?: 'Metadata' } & Pick<
      Metadata,
      | 'datasetId'
      | 'datasetUrl'
      | 'datasetName'
      | 'firstSnapshotCreatedAt'
      | 'latestSnapshotCreatedAt'
      | 'dxStatus'
      | 'tasksCompleted'
      | 'grantFunderName'
      | 'grantIdentifier'
      | 'trialCount'
      | 'studyDesign'
      | 'studyDomain'
      | 'studyLongitudinal'
      | 'dataProcessed'
      | 'species'
      | 'associatedPaperDOI'
      | 'openneuroPaperDOI'
      | 'seniorAuthor'
      | 'adminUsers'
      | 'ages'
      | 'modalities'
      | 'affirmedDefaced'
      | 'affirmedConsent'
    >
  >
}

export type SubscribeToNewsletterMutationVariables = Exact<{
  email: Scalars['String']
}>

export type SubscribeToNewsletterMutation = { __typename?: 'Mutation' } & Pick<
  Mutation,
  'subscribeToNewsletter'
>

export type ResetDraftMutationVariables = Exact<{
  datasetId: Scalars['ID']
  ref: Scalars['String']
}>

export type ResetDraftMutation = { __typename?: 'Mutation' } & Pick<
  Mutation,
  'resetDraft'
>

export type ReexportRemotesMutationVariables = Exact<{
  datasetId: Scalars['ID']
}>

export type ReexportRemotesMutation = { __typename?: 'Mutation' } & Pick<
  Mutation,
  'reexportRemotes'
>

export type SnapshotQueryVariables = Exact<{
  datasetId: Scalars['ID']
  tag: Scalars['String']
}>

export type SnapshotQuery = { __typename?: 'Query' } & {
  snapshot?: Maybe<
    { __typename?: 'Snapshot' } & Pick<Snapshot, 'id'> & SnapshotFieldsFragment
  >
}

export type FilesUpdatedSubscriptionVariables = Exact<{
  datasetId: Scalars['ID']
}>

export type FilesUpdatedSubscription = { __typename?: 'Subscription' } & {
  filesUpdated?: Maybe<
    { __typename?: 'FilesUpdate' } & Pick<FilesUpdate, 'action'> & {
        payload?: Maybe<
          Array<
            Maybe<
              { __typename?: 'DatasetFile' } & Pick<
                DatasetFile,
                'id' | 'filename' | 'size' | 'directory'
              >
            >
          >
        >
      }
  >
}

export type DatasetDeletedSubscriptionVariables = Exact<{
  datasetIds?: Maybe<Array<Scalars['ID']> | Scalars['ID']>
}>

export type DatasetDeletedSubscription = { __typename?: 'Subscription' } & Pick<
  Subscription,
  'datasetDeleted'
>

export type DraftUpdatedSubscriptionVariables = Exact<{
  datasetId: Scalars['ID']
}>

export type DraftUpdatedSubscription = { __typename?: 'Subscription' } & {
  draftUpdated?: Maybe<
    { __typename?: 'Dataset' } & Pick<Dataset, 'id'> &
      DatasetDraftFragment &
      DatasetIssuesFragment
  >
}

export type PermissionsUpdatedSubscriptionVariables = Exact<{
  datasetIds?: Maybe<Array<Scalars['ID']> | Scalars['ID']>
}>

export type PermissionsUpdatedSubscription = { __typename?: 'Subscription' } & {
  permissionsUpdated?: Maybe<
    { __typename?: 'Dataset' } & Pick<Dataset, 'id'> &
      DatasetPermissionsFragment
  >
}

export type SnapshotsUpdatedSubscriptionVariables = Exact<{
  datasetId: Scalars['ID']
}>

export type SnapshotsUpdatedSubscription = { __typename?: 'Subscription' } & {
  snapshotsUpdated?: Maybe<
    { __typename?: 'Dataset' } & Pick<Dataset, 'id'> & DatasetSnapshotsFragment
  >
}

export type GetDraftFileTreeQueryVariables = Exact<{
  datasetId: Scalars['ID']
  filePrefix: Scalars['String']
}>

export type GetDraftFileTreeQuery = { __typename?: 'Query' } & {
  dataset?: Maybe<
    { __typename?: 'Dataset' } & {
      draft?: Maybe<
        { __typename?: 'Draft' } & {
          files?: Maybe<
            Array<
              Maybe<
                { __typename?: 'DatasetFile' } & Pick<
                  DatasetFile,
                  'id' | 'key' | 'filename' | 'size' | 'directory' | 'annexed'
                >
              >
            >
          >
        }
      >
    }
  >
}

export type GetSnapshotFileTreeQueryVariables = Exact<{
  datasetId: Scalars['ID']
  snapshotTag: Scalars['String']
  filePrefix: Scalars['String']
}>

export type GetSnapshotFileTreeQuery = { __typename?: 'Query' } & {
  snapshot?: Maybe<
    { __typename?: 'Snapshot' } & {
      files?: Maybe<
        Array<
          Maybe<
            { __typename?: 'DatasetFile' } & Pick<
              DatasetFile,
              'id' | 'key' | 'filename' | 'size' | 'directory' | 'annexed'
            >
          >
        >
      >
    }
  >
}

export type PublicDatasetCountQueryVariables = Exact<{ [key: string]: never }>

export type PublicDatasetCountQuery = { __typename?: 'Query' } & {
  datasets?: Maybe<
    { __typename?: 'DatasetConnection' } & {
      pageInfo: { __typename?: 'PageInfo' } & Pick<PageInfo, 'count'>
    }
  >
}

export type Top_Viewed_DatasetsQueryVariables = Exact<{ [key: string]: never }>

export type Top_Viewed_DatasetsQuery = { __typename?: 'Query' } & {
  datasets?: Maybe<
    { __typename?: 'DatasetConnection' } & {
      edges?: Maybe<
        Array<
          Maybe<
            { __typename?: 'DatasetEdge' } & {
              node: { __typename?: 'Dataset' } & Pick<Dataset, 'id'> & {
                  analytics?: Maybe<
                    { __typename?: 'Analytic' } & Pick<Analytic, 'views'>
                  >
                  latestSnapshot: { __typename?: 'Snapshot' } & Pick<
                    Snapshot,
                    'tag'
                  > & {
                      description?: Maybe<
                        { __typename?: 'Description' } & Pick<
                          Description,
                          'Name'
                        >
                      >
                    }
                }
            }
          >
        >
      >
    }
  >
}

export type Recently_Published_DatasetsQueryVariables = Exact<{
  [key: string]: never
}>

export type Recently_Published_DatasetsQuery = { __typename?: 'Query' } & {
  datasets?: Maybe<
    { __typename?: 'DatasetConnection' } & {
      edges?: Maybe<
        Array<
          Maybe<
            { __typename?: 'DatasetEdge' } & {
              node: { __typename?: 'Dataset' } & Pick<
                Dataset,
                'id' | 'publishDate'
              > & {
                  latestSnapshot: { __typename?: 'Snapshot' } & Pick<
                    Snapshot,
                    'tag'
                  > & {
                      description?: Maybe<
                        { __typename?: 'Description' } & Pick<
                          Description,
                          'Name'
                        >
                      >
                    }
                }
            }
          >
        >
      >
    }
  >
}

export type ParticipantCountQueryVariables = Exact<{ [key: string]: never }>

export type ParticipantCountQuery = { __typename?: 'Query' } & Pick<
  Query,
  'participantCount'
>

export type PrepareRepoAccessMutationVariables = Exact<{
  datasetId: Scalars['ID']
}>

export type PrepareRepoAccessMutation = { __typename?: 'Mutation' } & {
  prepareRepoAccess?: Maybe<
    { __typename?: 'RepoMetadata' } & Pick<RepoMetadata, 'token' | 'endpoint'>
  >
}

export type DatasetQueryVariables = Exact<{
  id: Scalars['ID']
}>

export type DatasetQuery = { __typename?: 'Query' } & {
  dataset?: Maybe<
    { __typename?: 'Dataset' } & Pick<Dataset, 'id'> & {
        snapshots?: Maybe<
          Array<
            Maybe<
              { __typename?: 'Snapshot' } & Pick<
                Snapshot,
                'id' | 'tag' | 'created'
              > & {
                  description?: Maybe<
                    { __typename?: 'Description' } & Pick<Description, 'Name'>
                  >
                }
            >
          >
        >
      }
  >
}

export type GetDatasetQueryVariables = Exact<{
  id: Scalars['ID']
}>

export type GetDatasetQuery = { __typename?: 'Query' } & {
  dataset?: Maybe<
    { __typename?: 'Dataset' } & Pick<Dataset, 'id' | 'created' | 'public'> & {
        _id: Dataset['id']
      } & {
        uploader?: Maybe<
          { __typename?: 'User' } & Pick<User, 'id' | 'name' | 'email'>
        >
        draft?: Maybe<
          { __typename?: 'Draft' } & Pick<Draft, 'id' | 'modified'> & {
              description?: Maybe<
                { __typename?: 'Description' } & Pick<Description, 'Name'>
              >
              files?: Maybe<
                Array<
                  Maybe<
                    { __typename?: 'DatasetFile' } & Pick<
                      DatasetFile,
                      'id' | 'filename' | 'size' | 'objectpath'
                    >
                  >
                >
              >
              summary?: Maybe<
                { __typename?: 'Summary' } & Pick<
                  Summary,
                  | 'modalities'
                  | 'sessions'
                  | 'subjects'
                  | 'tasks'
                  | 'size'
                  | 'totalFiles'
                  | 'dataProcessed'
                > & {
                    subjectMetadata?: Maybe<
                      Array<
                        Maybe<
                          { __typename?: 'SubjectMetadata' } & Pick<
                            SubjectMetadata,
                            'participantId' | 'age' | 'sex' | 'group'
                          >
                        >
                      >
                    >
                  }
              >
              issues?: Maybe<
                Array<
                  Maybe<
                    { __typename?: 'ValidationIssue' } & Pick<
                      ValidationIssue,
                      'key' | 'severity'
                    >
                  >
                >
              >
            }
        >
        snapshots?: Maybe<
          Array<
            Maybe<
              { __typename?: 'Snapshot' } & Pick<
                Snapshot,
                'id' | 'tag' | 'created'
              > & { _id: Snapshot['id']; snapshot_version: Snapshot['tag'] }
            >
          >
        >
        permissions?: Maybe<
          { __typename?: 'DatasetPermissions' } & Pick<
            DatasetPermissions,
            'id'
          > & {
              userPermissions?: Maybe<
                Array<
                  Maybe<
                    { __typename?: 'Permission' } & Pick<
                      Permission,
                      'userId' | 'level'
                    > & {
                        _id: Permission['userId']
                        access: Permission['level']
                      } & {
                        user?: Maybe<
                          { __typename?: 'User' } & Pick<
                            User,
                            'id' | 'name' | 'email' | 'provider'
                          >
                        >
                      }
                  >
                >
              >
            }
        >
      }
  >
}

export type GetDraftFilesQueryVariables = Exact<{
  id: Scalars['ID']
}>

export type GetDraftFilesQuery = { __typename?: 'Query' } & {
  dataset?: Maybe<
    { __typename?: 'Dataset' } & Pick<Dataset, 'id'> & {
        draft?: Maybe<
          { __typename?: 'Draft' } & Pick<Draft, 'id'> & {
              files?: Maybe<
                Array<
                  Maybe<
                    { __typename?: 'DatasetFile' } & Pick<
                      DatasetFile,
                      'filename' | 'size'
                    >
                  >
                >
              >
            }
        >
        metadata?: Maybe<
          { __typename?: 'Metadata' } & Pick<
            Metadata,
            'affirmedDefaced' | 'affirmedConsent'
          >
        >
      }
  >
}

export type GetDatasetsQueryVariables = Exact<{
  cursor?: Maybe<Scalars['String']>
  orderBy?: Maybe<DatasetSort>
  filterBy?: Maybe<DatasetFilter>
  myDatasets?: Maybe<Scalars['Boolean']>
}>

export type GetDatasetsQuery = { __typename?: 'Query' } & {
  datasets?: Maybe<
    { __typename?: 'DatasetConnection' } & {
      edges?: Maybe<
        Array<
          Maybe<
            { __typename?: 'DatasetEdge' } & {
              node: { __typename?: 'Dataset' } & Pick<
                Dataset,
                'id' | 'created' | 'public'
              > & {
                  uploader?: Maybe<
                    { __typename?: 'User' } & Pick<User, 'id' | 'name'>
                  >
                  permissions?: Maybe<
                    { __typename?: 'DatasetPermissions' } & Pick<
                      DatasetPermissions,
                      'id'
                    > & {
                        userPermissions?: Maybe<
                          Array<
                            Maybe<
                              { __typename?: 'Permission' } & Pick<
                                Permission,
                                'userId' | 'level'
                              > & { access: Permission['level'] } & {
                                  user?: Maybe<
                                    { __typename?: 'User' } & Pick<
                                      User,
                                      'id' | 'name' | 'email' | 'provider'
                                    >
                                  >
                                }
                            >
                          >
                        >
                      }
                  >
                  draft?: Maybe<
                    { __typename?: 'Draft' } & Pick<Draft, 'id'> & {
                        summary?: Maybe<
                          { __typename?: 'Summary' } & Pick<
                            Summary,
                            | 'modalities'
                            | 'sessions'
                            | 'subjects'
                            | 'tasks'
                            | 'size'
                            | 'totalFiles'
                            | 'dataProcessed'
                          > & {
                              subjectMetadata?: Maybe<
                                Array<
                                  Maybe<
                                    { __typename?: 'SubjectMetadata' } & Pick<
                                      SubjectMetadata,
                                      'participantId' | 'age' | 'sex' | 'group'
                                    >
                                  >
                                >
                              >
                            }
                        >
                        issues?: Maybe<
                          Array<
                            Maybe<
                              { __typename?: 'ValidationIssue' } & Pick<
                                ValidationIssue,
                                'severity'
                              >
                            >
                          >
                        >
                        description?: Maybe<
                          { __typename?: 'Description' } & Pick<
                            Description,
                            'Name'
                          >
                        >
                      }
                  >
                  analytics?: Maybe<
                    { __typename?: 'Analytic' } & Pick<
                      Analytic,
                      'views' | 'downloads'
                    >
                  >
                  stars?: Maybe<
                    Array<
                      Maybe<
                        { __typename?: 'Star' } & Pick<
                          Star,
                          'userId' | 'datasetId'
                        >
                      >
                    >
                  >
                  followers?: Maybe<
                    Array<
                      Maybe<
                        { __typename?: 'Follower' } & Pick<
                          Follower,
                          'userId' | 'datasetId'
                        >
                      >
                    >
                  >
                  snapshots?: Maybe<
                    Array<
                      Maybe<
                        { __typename?: 'Snapshot' } & Pick<
                          Snapshot,
                          'id' | 'created' | 'tag'
                        >
                      >
                    >
                  >
                }
            }
          >
        >
      >
      pageInfo: { __typename?: 'PageInfo' } & Pick<
        PageInfo,
        | 'startCursor'
        | 'endCursor'
        | 'hasPreviousPage'
        | 'hasNextPage'
        | 'count'
      >
    }
  >
}

export type SearchDatasetsQueryVariables = Exact<{
  q: Scalars['String']
  cursor?: Maybe<Scalars['String']>
}>

export type SearchDatasetsQuery = { __typename?: 'Query' } & {
  searchDatasets?: Maybe<
    { __typename?: 'DatasetConnection' } & {
      edges?: Maybe<
        Array<
          Maybe<
            { __typename?: 'DatasetEdge' } & {
              node: { __typename?: 'Dataset' } & Pick<
                Dataset,
                'id' | 'created' | 'public'
              > & {
                  uploader?: Maybe<
                    { __typename?: 'User' } & Pick<User, 'id' | 'name'>
                  >
                  permissions?: Maybe<
                    { __typename?: 'DatasetPermissions' } & Pick<
                      DatasetPermissions,
                      'id'
                    > & {
                        userPermissions?: Maybe<
                          Array<
                            Maybe<
                              { __typename?: 'Permission' } & Pick<
                                Permission,
                                'userId' | 'level'
                              > & { access: Permission['level'] } & {
                                  user?: Maybe<
                                    { __typename?: 'User' } & Pick<
                                      User,
                                      'id' | 'name' | 'email' | 'provider'
                                    >
                                  >
                                }
                            >
                          >
                        >
                      }
                  >
                  draft?: Maybe<
                    { __typename?: 'Draft' } & Pick<Draft, 'id'> & {
                        summary?: Maybe<
                          { __typename?: 'Summary' } & Pick<
                            Summary,
                            | 'modalities'
                            | 'sessions'
                            | 'subjects'
                            | 'tasks'
                            | 'size'
                            | 'totalFiles'
                            | 'dataProcessed'
                          > & {
                              subjectMetadata?: Maybe<
                                Array<
                                  Maybe<
                                    { __typename?: 'SubjectMetadata' } & Pick<
                                      SubjectMetadata,
                                      'participantId' | 'age' | 'sex' | 'group'
                                    >
                                  >
                                >
                              >
                            }
                        >
                        issues?: Maybe<
                          Array<
                            Maybe<
                              { __typename?: 'ValidationIssue' } & Pick<
                                ValidationIssue,
                                'severity'
                              >
                            >
                          >
                        >
                        description?: Maybe<
                          { __typename?: 'Description' } & Pick<
                            Description,
                            'Name'
                          >
                        >
                      }
                  >
                  analytics?: Maybe<
                    { __typename?: 'Analytic' } & Pick<
                      Analytic,
                      'views' | 'downloads'
                    >
                  >
                  stars?: Maybe<
                    Array<
                      Maybe<
                        { __typename?: 'Star' } & Pick<
                          Star,
                          'userId' | 'datasetId'
                        >
                      >
                    >
                  >
                  followers?: Maybe<
                    Array<
                      Maybe<
                        { __typename?: 'Follower' } & Pick<
                          Follower,
                          'userId' | 'datasetId'
                        >
                      >
                    >
                  >
                  snapshots?: Maybe<
                    Array<
                      Maybe<
                        { __typename?: 'Snapshot' } & Pick<
                          Snapshot,
                          'id' | 'created' | 'tag'
                        >
                      >
                    >
                  >
                }
            }
          >
        >
      >
      pageInfo: { __typename?: 'PageInfo' } & Pick<
        PageInfo,
        | 'startCursor'
        | 'endCursor'
        | 'hasPreviousPage'
        | 'hasNextPage'
        | 'count'
      >
    }
  >
}

export type GetDatasetIssuesQueryVariables = Exact<{
  datasetId: Scalars['ID']
}>

export type GetDatasetIssuesQuery = { __typename?: 'Query' } & {
  dataset?: Maybe<
    { __typename?: 'Dataset' } & Pick<Dataset, 'id'> & {
        draft?: Maybe<
          { __typename?: 'Draft' } & Pick<Draft, 'id'> & {
              issues?: Maybe<
                Array<
                  Maybe<
                    { __typename?: 'ValidationIssue' } & Pick<
                      ValidationIssue,
                      'severity' | 'code' | 'reason' | 'additionalFileCount'
                    > & {
                        files?: Maybe<
                          Array<
                            Maybe<
                              { __typename?: 'ValidationIssueFile' } & Pick<
                                ValidationIssueFile,
                                'evidence' | 'line' | 'character' | 'reason'
                              > & {
                                  file?: Maybe<
                                    {
                                      __typename?: 'ValidationIssueFileDetail'
                                    } & Pick<
                                      ValidationIssueFileDetail,
                                      'name' | 'path' | 'relativePath'
                                    >
                                  >
                                }
                            >
                          >
                        >
                      }
                  >
                >
              >
            }
        >
      }
  >
}

export type CreateDatasetMutationVariables = Exact<{
  affirmedDefaced?: Maybe<Scalars['Boolean']>
  affirmedConsent?: Maybe<Scalars['Boolean']>
}>

export type CreateDatasetMutation = { __typename?: 'Mutation' } & {
  createDataset?: Maybe<
    { __typename?: 'Dataset' } & Pick<Dataset, 'id' | 'worker'>
  >
}

export type DeleteSnapshotMutationVariables = Exact<{
  datasetId: Scalars['ID']
  tag: Scalars['String']
}>

export type DeleteSnapshotMutation = { __typename?: 'Mutation' } & Pick<
  Mutation,
  'deleteSnapshot'
>

export type UpdatePublicMutationVariables = Exact<{
  id: Scalars['ID']
  publicFlag: Scalars['Boolean']
}>

export type UpdatePublicMutation = { __typename?: 'Mutation' } & Pick<
  Mutation,
  'updatePublic'
>

export type UpdatePermissionsMutationVariables = Exact<{
  datasetId: Scalars['ID']
  userEmail: Scalars['String']
  level?: Maybe<Scalars['String']>
}>

export type UpdatePermissionsMutation = { __typename?: 'Mutation' } & {
  updatePermissions?: Maybe<
    { __typename?: 'User' } & Pick<User, 'id' | 'email'>
  >
}

export type TrackAnalyticsMutationVariables = Exact<{
  datasetId: Scalars['ID']
  tag?: Maybe<Scalars['String']>
  type: AnalyticTypes
}>

export type TrackAnalyticsMutation = { __typename?: 'Mutation' } & Pick<
  Mutation,
  'trackAnalytics'
>

export type DownloadDatasetQueryVariables = Exact<{
  datasetId: Scalars['ID']
}>

export type DownloadDatasetQuery = { __typename?: 'Query' } & {
  dataset?: Maybe<
    { __typename?: 'Dataset' } & Pick<Dataset, 'id'> & {
        draft?: Maybe<
          { __typename?: 'Draft' } & Pick<Draft, 'id'> & {
              files?: Maybe<
                Array<
                  Maybe<
                    { __typename?: 'DatasetFile' } & Pick<
                      DatasetFile,
                      'id' | 'filename' | 'size' | 'urls'
                    >
                  >
                >
              >
            }
        >
      }
  >
}

export type DownloadSnapshotQueryVariables = Exact<{
  datasetId: Scalars['ID']
  tag: Scalars['String']
}>

export type DownloadSnapshotQuery = { __typename?: 'Query' } & {
  snapshot?: Maybe<
    { __typename?: 'Snapshot' } & Pick<Snapshot, 'id'> & {
        files?: Maybe<
          Array<
            Maybe<
              { __typename?: 'DatasetFile' } & Pick<
                DatasetFile,
                'id' | 'filename' | 'size' | 'urls'
              >
            >
          >
        >
      }
  >
}

export type DeleteFilesMutationVariables = Exact<{
  datasetId: Scalars['ID']
  files: Array<Maybe<DeleteFile>> | Maybe<DeleteFile>
}>

export type DeleteFilesMutation = { __typename?: 'Mutation' } & Pick<
  Mutation,
  'deleteFiles'
>

export type CreateSnapshotMutationVariables = Exact<{
  datasetId: Scalars['ID']
  tag: Scalars['String']
  changes?: Maybe<Array<Scalars['String']> | Scalars['String']>
}>

export type CreateSnapshotMutation = { __typename?: 'Mutation' } & {
  createSnapshot?: Maybe<
    { __typename?: 'Snapshot' } & Pick<Snapshot, 'id' | 'tag'>
  >
}

export type GetSnapshotQueryVariables = Exact<{
  datasetId: Scalars['ID']
  tag: Scalars['String']
}>

export type GetSnapshotQuery = { __typename?: 'Query' } & {
  snapshot?: Maybe<
    { __typename?: 'Snapshot' } & Pick<Snapshot, 'id' | 'tag' | 'created'> & {
        _id: Snapshot['id']
      } & {
        description?: Maybe<
          { __typename?: 'Description' } & Pick<Description, 'Name'>
        >
        summary?: Maybe<
          { __typename?: 'Summary' } & Pick<Summary, 'size' | 'totalFiles'>
        >
        files?: Maybe<
          Array<
            Maybe<
              { __typename?: 'DatasetFile' } & Pick<
                DatasetFile,
                'id' | 'filename' | 'size'
              > & { _id: DatasetFile['id']; name: DatasetFile['filename'] }
            >
          >
        >
        analytics?: Maybe<
          { __typename?: 'Analytic' } & Pick<Analytic, 'views' | 'downloads'>
        >
      }
  >
}

export type PrepareUploadMutationVariables = Exact<{
  datasetId: Scalars['ID']
  uploadId: Scalars['ID']
}>

export type PrepareUploadMutation = { __typename?: 'Mutation' } & {
  prepareUpload?: Maybe<
    { __typename?: 'UploadMetadata' } & Pick<
      UploadMetadata,
      'id' | 'datasetId' | 'token' | 'endpoint'
    >
  >
}

export type FinishUploadMutationVariables = Exact<{
  uploadId: Scalars['ID']
}>

export type FinishUploadMutation = { __typename?: 'Mutation' } & Pick<
  Mutation,
  'finishUpload'
>

export type GetUsersQueryVariables = Exact<{ [key: string]: never }>

export type GetUsersQuery = { __typename?: 'Query' } & {
  users?: Maybe<
    Array<
      Maybe<
        { __typename?: 'User' } & Pick<
          User,
          | 'id'
          | 'name'
          | 'email'
          | 'provider'
          | 'admin'
          | 'created'
          | 'lastSeen'
        > & { _id: User['id'] }
      >
    >
  >
}

export type RemoveUserMutationVariables = Exact<{
  id: Scalars['ID']
}>

export type RemoveUserMutation = { __typename?: 'Mutation' } & Pick<
  Mutation,
  'removeUser'
>

export type SetAdminMutationVariables = Exact<{
  id: Scalars['ID']
  admin: Scalars['Boolean']
}>

export type SetAdminMutation = { __typename?: 'Mutation' } & {
  setAdmin?: Maybe<{ __typename?: 'User' } & Pick<User, 'id'>>
}

export type GetIndexQueryVariables = Exact<{
  cursor?: Maybe<Scalars['String']>
  orderBy?: Maybe<DatasetSort>
  filterBy?: Maybe<DatasetFilter>
}>

export type GetIndexQuery = { __typename?: 'Query' } & {
  datasets?: Maybe<
    { __typename?: 'DatasetConnection' } & {
      edges?: Maybe<
        Array<
          Maybe<
            { __typename?: 'DatasetEdge' } & {
              node: { __typename?: 'Dataset' } & Pick<
                Dataset,
                'id' | 'created'
              > & {
                  metadata?: Maybe<
                    { __typename?: 'Metadata' } & Pick<
                      Metadata,
                      | 'dxStatus'
                      | 'trialCount'
                      | 'studyDesign'
                      | 'studyDomain'
                      | 'studyLongitudinal'
                      | 'dataProcessed'
                      | 'species'
                      | 'associatedPaperDOI'
                      | 'openneuroPaperDOI'
                      | 'seniorAuthor'
                      | 'grantFunderName'
                      | 'grantIdentifier'
                    >
                  >
                  latestSnapshot: { __typename?: 'Snapshot' } & Pick<
                    Snapshot,
                    'id' | 'tag' | 'readme'
                  > & {
                      description?: Maybe<
                        { __typename?: 'Description' } & Pick<
                          Description,
                          'Name' | 'Authors'
                        >
                      >
                      summary?: Maybe<
                        { __typename?: 'Summary' } & Pick<
                          Summary,
                          'tasks' | 'modalities'
                        > & {
                            subjectMetadata?: Maybe<
                              Array<
                                Maybe<
                                  { __typename?: 'SubjectMetadata' } & Pick<
                                    SubjectMetadata,
                                    'participantId' | 'group' | 'sex' | 'age'
                                  >
                                >
                              >
                            >
                          }
                      >
                    }
                }
            }
          >
        >
      >
      pageInfo: { __typename?: 'PageInfo' } & Pick<
        PageInfo,
        'endCursor' | 'hasNextPage' | 'count'
      >
    }
  >
}

export const UserFieldsFragmentDoc = gql`
  fragment userFields on User {
    id
    name
    email
    provider
    admin
    created
    lastSeen
    blocked
  }
`
export const DatasetCommentsFragmentDoc = gql`
  fragment DatasetComments on Dataset {
    id
    comments {
      id
      text
      createDate
      user {
        email
      }
      parent {
        id
      }
      replies {
        id
      }
    }
  }
`
export const DatasetDraftFragmentDoc = gql`
  fragment DatasetDraft on Dataset {
    id
    draft {
      id
      modified
      readme
      head
      description {
        Name
        Authors
        DatasetDOI
        License
        Acknowledgements
        HowToAcknowledge
        Funding
        ReferencesAndLinks
        EthicsApprovals
      }
      summary {
        modalities
        sessions
        subjects
        subjectMetadata {
          participantId
          age
          sex
          group
        }
        tasks
        size
        totalFiles
        dataProcessed
      }
    }
  }
`
export const DatasetDraftFilesFragmentDoc = gql`
  fragment DatasetDraftFiles on Dataset {
    id
    draft {
      id
      files {
        id
        key
        filename
        size
        directory
        annexed
      }
    }
  }
`
export const DatasetPermissionsFragmentDoc = gql`
  fragment DatasetPermissions on Dataset {
    id
    permissions {
      id
      userPermissions {
        user {
          id
          email
        }
        level
      }
    }
  }
`
export const DatasetSnapshotsFragmentDoc = gql`
  fragment DatasetSnapshots on Dataset {
    id
    snapshots {
      id
      tag
      created
      hexsha
    }
  }
`
export const DatasetIssuesFragmentDoc = gql`
  fragment DatasetIssues on Dataset {
    id
    draft {
      id
      issues {
        severity
        code
        reason
        files {
          evidence
          line
          character
          reason
          file {
            name
            path
            relativePath
          }
        }
        additionalFileCount
      }
    }
  }
`
export const SnapshotIssuesFragmentDoc = gql`
  fragment SnapshotIssues on Snapshot {
    id
    issues {
      severity
      code
      reason
      files {
        evidence
        line
        character
        reason
        file {
          name
          path
          relativePath
        }
      }
      additionalFileCount
    }
  }
`
export const SnapshotFieldsFragmentDoc = gql`
  fragment SnapshotFields on Snapshot {
    id
    tag
    created
    readme
    description {
      Name
      Authors
      DatasetDOI
      License
      Acknowledgements
      HowToAcknowledge
      Funding
      ReferencesAndLinks
      EthicsApprovals
    }
    files {
      id
      key
      filename
      size
      directory
      annexed
    }
    summary {
      modalities
      sessions
      subjects
      subjectMetadata {
        participantId
        age
        sex
        group
      }
      tasks
      size
      totalFiles
      dataProcessed
    }
    analytics {
      downloads
      views
    }
    ...SnapshotIssues
    hexsha
  }
  ${SnapshotIssuesFragmentDoc}
`
export const DatasetMetadataFragmentDoc = gql`
  fragment DatasetMetadata on Dataset {
    id
    metadata {
      datasetId
      datasetUrl
      datasetName
      firstSnapshotCreatedAt
      latestSnapshotCreatedAt
      dxStatus
      tasksCompleted
      trialCount
      grantFunderName
      grantIdentifier
      studyDesign
      studyDomain
      studyLongitudinal
      dataProcessed
      species
      associatedPaperDOI
      openneuroPaperDOI
      seniorAuthor
      adminUsers
      ages
      modalities
      affirmedDefaced
      affirmedConsent
    }
  }
`
export const UserFollowingFragmentDoc = gql`
  fragment UserFollowing on Dataset {
    id
    following
  }
`
export const DatasetPublishedFragmentDoc = gql`
  fragment DatasetPublished on Dataset {
    id
    public
  }
`
export const UserStarredFragmentDoc = gql`
  fragment UserStarred on Dataset {
    id
    starred
  }
`
export const FlaggedFilesDocument = gql`
  query flaggedFiles($flagged: Boolean, $deleted: Boolean) {
    flaggedFiles(flagged: $flagged, deleted: $deleted) {
      datasetId
      snapshot
      filepath
      flagger {
        name
        email
      }
    }
  }
`

/**
 * __useFlaggedFilesQuery__
 *
 * To run a query within a React component, call `useFlaggedFilesQuery` and pass it any options that fit your needs.
 * When your component renders, `useFlaggedFilesQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useFlaggedFilesQuery({
 *   variables: {
 *      flagged: // value for 'flagged'
 *      deleted: // value for 'deleted'
 *   },
 * });
 */
export function useFlaggedFilesQuery(
  baseOptions?: Apollo.QueryHookOptions<
    FlaggedFilesQuery,
    FlaggedFilesQueryVariables
  >,
) {
  const options = { ...defaultOptions, ...baseOptions }
  return Apollo.useQuery<FlaggedFilesQuery, FlaggedFilesQueryVariables>(
    FlaggedFilesDocument,
    options,
  )
}
export function useFlaggedFilesLazyQuery(
  baseOptions?: Apollo.LazyQueryHookOptions<
    FlaggedFilesQuery,
    FlaggedFilesQueryVariables
  >,
) {
  const options = { ...defaultOptions, ...baseOptions }
  return Apollo.useLazyQuery<FlaggedFilesQuery, FlaggedFilesQueryVariables>(
    FlaggedFilesDocument,
    options,
  )
}
export type FlaggedFilesQueryHookResult = ReturnType<
  typeof useFlaggedFilesQuery
>
export type FlaggedFilesLazyQueryHookResult = ReturnType<
  typeof useFlaggedFilesLazyQuery
>
export type FlaggedFilesQueryResult = Apollo.QueryResult<
  FlaggedFilesQuery,
  FlaggedFilesQueryVariables
>
export const SetAdminPermissionsDocument = gql`
  mutation setAdminPermissions($id: ID!, $admin: Boolean!) {
    setAdmin(id: $id, admin: $admin) {
      id
      name
      email
      provider
      admin
      created
      lastSeen
      blocked
    }
  }
`
export type SetAdminPermissionsMutationFn = Apollo.MutationFunction<
  SetAdminPermissionsMutation,
  SetAdminPermissionsMutationVariables
>

/**
 * __useSetAdminPermissionsMutation__
 *
 * To run a mutation, you first call `useSetAdminPermissionsMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useSetAdminPermissionsMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [setAdminPermissionsMutation, { data, loading, error }] = useSetAdminPermissionsMutation({
 *   variables: {
 *      id: // value for 'id'
 *      admin: // value for 'admin'
 *   },
 * });
 */
export function useSetAdminPermissionsMutation(
  baseOptions?: Apollo.MutationHookOptions<
    SetAdminPermissionsMutation,
    SetAdminPermissionsMutationVariables
  >,
) {
  const options = { ...defaultOptions, ...baseOptions }
  return Apollo.useMutation<
    SetAdminPermissionsMutation,
    SetAdminPermissionsMutationVariables
  >(SetAdminPermissionsDocument, options)
}
export type SetAdminPermissionsMutationHookResult = ReturnType<
  typeof useSetAdminPermissionsMutation
>
export type SetAdminPermissionsMutationResult =
  Apollo.MutationResult<SetAdminPermissionsMutation>
export type SetAdminPermissionsMutationOptions = Apollo.BaseMutationOptions<
  SetAdminPermissionsMutation,
  SetAdminPermissionsMutationVariables
>
export const SetBlockedDocument = gql`
  mutation setBlocked($id: ID!, $blocked: Boolean!) {
    setBlocked(id: $id, blocked: $blocked) {
      id
      name
      email
      provider
      admin
      created
      lastSeen
      blocked
    }
  }
`
export type SetBlockedMutationFn = Apollo.MutationFunction<
  SetBlockedMutation,
  SetBlockedMutationVariables
>

/**
 * __useSetBlockedMutation__
 *
 * To run a mutation, you first call `useSetBlockedMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useSetBlockedMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [setBlockedMutation, { data, loading, error }] = useSetBlockedMutation({
 *   variables: {
 *      id: // value for 'id'
 *      blocked: // value for 'blocked'
 *   },
 * });
 */
export function useSetBlockedMutation(
  baseOptions?: Apollo.MutationHookOptions<
    SetBlockedMutation,
    SetBlockedMutationVariables
  >,
) {
  const options = { ...defaultOptions, ...baseOptions }
  return Apollo.useMutation<SetBlockedMutation, SetBlockedMutationVariables>(
    SetBlockedDocument,
    options,
  )
}
export type SetBlockedMutationHookResult = ReturnType<
  typeof useSetBlockedMutation
>
export type SetBlockedMutationResult = Apollo.MutationResult<SetBlockedMutation>
export type SetBlockedMutationOptions = Apollo.BaseMutationOptions<
  SetBlockedMutation,
  SetBlockedMutationVariables
>
export const Document = gql`
  {
    users {
      ...userFields
    }
  }
  ${UserFieldsFragmentDoc}
`

/**
 * __useQuery__
 *
 * To run a query within a React component, call `useQuery` and pass it any options that fit your needs.
 * When your component renders, `useQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useQuery({
 *   variables: {
 *   },
 * });
 */
export function useQuery(
  baseOptions?: Apollo.QueryHookOptions<Query, QueryVariables>,
) {
  const options = { ...defaultOptions, ...baseOptions }
  return Apollo.useQuery<Query, QueryVariables>(Document, options)
}
export function useLazyQuery(
  baseOptions?: Apollo.LazyQueryHookOptions<Query, QueryVariables>,
) {
  const options = { ...defaultOptions, ...baseOptions }
  return Apollo.useLazyQuery<Query, QueryVariables>(Document, options)
}
export type QueryHookResult = ReturnType<typeof useQuery>
export type LazyQueryHookResult = ReturnType<typeof useLazyQuery>
export type QueryResult = Apollo.QueryResult<Query, QueryVariables>
export const GetDatasetPageDocument = gql`
  query getDatasetPage($datasetId: ID!) {
    dataset(id: $datasetId) {
      id
      created
      public
      following
      starred
      ...DatasetDraft
      ...DatasetPermissions
      ...DatasetSnapshots
      ...DatasetIssues
      ...DatasetMetadata
      ...DatasetComments
      uploader {
        id
        name
        email
      }
      analytics {
        downloads
        views
      }
      onBrainlife
    }
  }
  ${DatasetDraftFragmentDoc}
  ${DatasetPermissionsFragmentDoc}
  ${DatasetSnapshotsFragmentDoc}
  ${DatasetIssuesFragmentDoc}
  ${DatasetMetadataFragmentDoc}
  ${DatasetCommentsFragmentDoc}
`

/**
 * __useGetDatasetPageQuery__
 *
 * To run a query within a React component, call `useGetDatasetPageQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetDatasetPageQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetDatasetPageQuery({
 *   variables: {
 *      datasetId: // value for 'datasetId'
 *   },
 * });
 */
export function useGetDatasetPageQuery(
  baseOptions: Apollo.QueryHookOptions<
    GetDatasetPageQuery,
    GetDatasetPageQueryVariables
  >,
) {
  const options = { ...defaultOptions, ...baseOptions }
  return Apollo.useQuery<GetDatasetPageQuery, GetDatasetPageQueryVariables>(
    GetDatasetPageDocument,
    options,
  )
}
export function useGetDatasetPageLazyQuery(
  baseOptions?: Apollo.LazyQueryHookOptions<
    GetDatasetPageQuery,
    GetDatasetPageQueryVariables
  >,
) {
  const options = { ...defaultOptions, ...baseOptions }
  return Apollo.useLazyQuery<GetDatasetPageQuery, GetDatasetPageQueryVariables>(
    GetDatasetPageDocument,
    options,
  )
}
export type GetDatasetPageQueryHookResult = ReturnType<
  typeof useGetDatasetPageQuery
>
export type GetDatasetPageLazyQueryHookResult = ReturnType<
  typeof useGetDatasetPageLazyQuery
>
export type GetDatasetPageQueryResult = Apollo.QueryResult<
  GetDatasetPageQuery,
  GetDatasetPageQueryVariables
>
export const GetDraftPageDocument = gql`
  query getDraftPage($datasetId: ID!) {
    dataset(id: $datasetId) {
      id
      created
      public
      following
      starred
      worker
      ...DatasetDraft
      ...DatasetDraftFiles
      ...DatasetPermissions
      ...DatasetSnapshots
      ...DatasetIssues
      ...DatasetMetadata
      ...DatasetComments
      uploader {
        id
        name
        email
      }
      analytics {
        downloads
        views
      }
      onBrainlife
    }
  }
  ${DatasetDraftFragmentDoc}
  ${DatasetDraftFilesFragmentDoc}
  ${DatasetPermissionsFragmentDoc}
  ${DatasetSnapshotsFragmentDoc}
  ${DatasetIssuesFragmentDoc}
  ${DatasetMetadataFragmentDoc}
  ${DatasetCommentsFragmentDoc}
`

/**
 * __useGetDraftPageQuery__
 *
 * To run a query within a React component, call `useGetDraftPageQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetDraftPageQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetDraftPageQuery({
 *   variables: {
 *      datasetId: // value for 'datasetId'
 *   },
 * });
 */
export function useGetDraftPageQuery(
  baseOptions: Apollo.QueryHookOptions<
    GetDraftPageQuery,
    GetDraftPageQueryVariables
  >,
) {
  const options = { ...defaultOptions, ...baseOptions }
  return Apollo.useQuery<GetDraftPageQuery, GetDraftPageQueryVariables>(
    GetDraftPageDocument,
    options,
  )
}
export function useGetDraftPageLazyQuery(
  baseOptions?: Apollo.LazyQueryHookOptions<
    GetDraftPageQuery,
    GetDraftPageQueryVariables
  >,
) {
  const options = { ...defaultOptions, ...baseOptions }
  return Apollo.useLazyQuery<GetDraftPageQuery, GetDraftPageQueryVariables>(
    GetDraftPageDocument,
    options,
  )
}
export type GetDraftPageQueryHookResult = ReturnType<
  typeof useGetDraftPageQuery
>
export type GetDraftPageLazyQueryHookResult = ReturnType<
  typeof useGetDraftPageLazyQuery
>
export type GetDraftPageQueryResult = Apollo.QueryResult<
  GetDraftPageQuery,
  GetDraftPageQueryVariables
>
export const GetHistoryDocument = gql`
  query getHistory($datasetId: ID!) {
    dataset(id: $datasetId) {
      id
      history {
        id
        authorName
        authorEmail
        date
        references
        message
      }
      worker
    }
  }
`

/**
 * __useGetHistoryQuery__
 *
 * To run a query within a React component, call `useGetHistoryQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetHistoryQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetHistoryQuery({
 *   variables: {
 *      datasetId: // value for 'datasetId'
 *   },
 * });
 */
export function useGetHistoryQuery(
  baseOptions: Apollo.QueryHookOptions<
    GetHistoryQuery,
    GetHistoryQueryVariables
  >,
) {
  const options = { ...defaultOptions, ...baseOptions }
  return Apollo.useQuery<GetHistoryQuery, GetHistoryQueryVariables>(
    GetHistoryDocument,
    options,
  )
}
export function useGetHistoryLazyQuery(
  baseOptions?: Apollo.LazyQueryHookOptions<
    GetHistoryQuery,
    GetHistoryQueryVariables
  >,
) {
  const options = { ...defaultOptions, ...baseOptions }
  return Apollo.useLazyQuery<GetHistoryQuery, GetHistoryQueryVariables>(
    GetHistoryDocument,
    options,
  )
}
export type GetHistoryQueryHookResult = ReturnType<typeof useGetHistoryQuery>
export type GetHistoryLazyQueryHookResult = ReturnType<
  typeof useGetHistoryLazyQuery
>
export type GetHistoryQueryResult = Apollo.QueryResult<
  GetHistoryQuery,
  GetHistoryQueryVariables
>
export const CacheClearDocument = gql`
  mutation cacheClear($datasetId: ID!) {
    cacheClear(datasetId: $datasetId)
  }
`
export type CacheClearMutationFn = Apollo.MutationFunction<
  CacheClearMutation,
  CacheClearMutationVariables
>

/**
 * __useCacheClearMutation__
 *
 * To run a mutation, you first call `useCacheClearMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useCacheClearMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [cacheClearMutation, { data, loading, error }] = useCacheClearMutation({
 *   variables: {
 *      datasetId: // value for 'datasetId'
 *   },
 * });
 */
export function useCacheClearMutation(
  baseOptions?: Apollo.MutationHookOptions<
    CacheClearMutation,
    CacheClearMutationVariables
  >,
) {
  const options = { ...defaultOptions, ...baseOptions }
  return Apollo.useMutation<CacheClearMutation, CacheClearMutationVariables>(
    CacheClearDocument,
    options,
  )
}
export type CacheClearMutationHookResult = ReturnType<
  typeof useCacheClearMutation
>
export type CacheClearMutationResult = Apollo.MutationResult<CacheClearMutation>
export type CacheClearMutationOptions = Apollo.BaseMutationOptions<
  CacheClearMutation,
  CacheClearMutationVariables
>
export const AddCommentDocument = gql`
  mutation addComment($datasetId: ID!, $parentId: ID, $comment: String!) {
    addComment(datasetId: $datasetId, parentId: $parentId, comment: $comment)
  }
`
export type AddCommentMutationFn = Apollo.MutationFunction<
  AddCommentMutation,
  AddCommentMutationVariables
>

/**
 * __useAddCommentMutation__
 *
 * To run a mutation, you first call `useAddCommentMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useAddCommentMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [addCommentMutation, { data, loading, error }] = useAddCommentMutation({
 *   variables: {
 *      datasetId: // value for 'datasetId'
 *      parentId: // value for 'parentId'
 *      comment: // value for 'comment'
 *   },
 * });
 */
export function useAddCommentMutation(
  baseOptions?: Apollo.MutationHookOptions<
    AddCommentMutation,
    AddCommentMutationVariables
  >,
) {
  const options = { ...defaultOptions, ...baseOptions }
  return Apollo.useMutation<AddCommentMutation, AddCommentMutationVariables>(
    AddCommentDocument,
    options,
  )
}
export type AddCommentMutationHookResult = ReturnType<
  typeof useAddCommentMutation
>
export type AddCommentMutationResult = Apollo.MutationResult<AddCommentMutation>
export type AddCommentMutationOptions = Apollo.BaseMutationOptions<
  AddCommentMutation,
  AddCommentMutationVariables
>
export const EditCommentDocument = gql`
  mutation editComment($commentId: ID!, $comment: String!) {
    editComment(commentId: $commentId, comment: $comment)
  }
`
export type EditCommentMutationFn = Apollo.MutationFunction<
  EditCommentMutation,
  EditCommentMutationVariables
>

/**
 * __useEditCommentMutation__
 *
 * To run a mutation, you first call `useEditCommentMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useEditCommentMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [editCommentMutation, { data, loading, error }] = useEditCommentMutation({
 *   variables: {
 *      commentId: // value for 'commentId'
 *      comment: // value for 'comment'
 *   },
 * });
 */
export function useEditCommentMutation(
  baseOptions?: Apollo.MutationHookOptions<
    EditCommentMutation,
    EditCommentMutationVariables
  >,
) {
  const options = { ...defaultOptions, ...baseOptions }
  return Apollo.useMutation<EditCommentMutation, EditCommentMutationVariables>(
    EditCommentDocument,
    options,
  )
}
export type EditCommentMutationHookResult = ReturnType<
  typeof useEditCommentMutation
>
export type EditCommentMutationResult =
  Apollo.MutationResult<EditCommentMutation>
export type EditCommentMutationOptions = Apollo.BaseMutationOptions<
  EditCommentMutation,
  EditCommentMutationVariables
>
export const DeleteCommentDocument = gql`
  mutation deleteComment($commentId: ID!, $deleteChildren: Boolean) {
    deleteComment(commentId: $commentId, deleteChildren: $deleteChildren)
  }
`
export type DeleteCommentMutationFn = Apollo.MutationFunction<
  DeleteCommentMutation,
  DeleteCommentMutationVariables
>

/**
 * __useDeleteCommentMutation__
 *
 * To run a mutation, you first call `useDeleteCommentMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useDeleteCommentMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [deleteCommentMutation, { data, loading, error }] = useDeleteCommentMutation({
 *   variables: {
 *      commentId: // value for 'commentId'
 *      deleteChildren: // value for 'deleteChildren'
 *   },
 * });
 */
export function useDeleteCommentMutation(
  baseOptions?: Apollo.MutationHookOptions<
    DeleteCommentMutation,
    DeleteCommentMutationVariables
  >,
) {
  const options = { ...defaultOptions, ...baseOptions }
  return Apollo.useMutation<
    DeleteCommentMutation,
    DeleteCommentMutationVariables
  >(DeleteCommentDocument, options)
}
export type DeleteCommentMutationHookResult = ReturnType<
  typeof useDeleteCommentMutation
>
export type DeleteCommentMutationResult =
  Apollo.MutationResult<DeleteCommentMutation>
export type DeleteCommentMutationOptions = Apollo.BaseMutationOptions<
  DeleteCommentMutation,
  DeleteCommentMutationVariables
>
export const DeleteDatasetDocument = gql`
  mutation deleteDataset($id: ID!, $reason: String, $redirect: String) {
    deleteDataset(id: $id, reason: $reason, redirect: $redirect)
  }
`
export type DeleteDatasetMutationFn = Apollo.MutationFunction<
  DeleteDatasetMutation,
  DeleteDatasetMutationVariables
>

/**
 * __useDeleteDatasetMutation__
 *
 * To run a mutation, you first call `useDeleteDatasetMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useDeleteDatasetMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [deleteDatasetMutation, { data, loading, error }] = useDeleteDatasetMutation({
 *   variables: {
 *      id: // value for 'id'
 *      reason: // value for 'reason'
 *      redirect: // value for 'redirect'
 *   },
 * });
 */
export function useDeleteDatasetMutation(
  baseOptions?: Apollo.MutationHookOptions<
    DeleteDatasetMutation,
    DeleteDatasetMutationVariables
  >,
) {
  const options = { ...defaultOptions, ...baseOptions }
  return Apollo.useMutation<
    DeleteDatasetMutation,
    DeleteDatasetMutationVariables
  >(DeleteDatasetDocument, options)
}
export type DeleteDatasetMutationHookResult = ReturnType<
  typeof useDeleteDatasetMutation
>
export type DeleteDatasetMutationResult =
  Apollo.MutationResult<DeleteDatasetMutation>
export type DeleteDatasetMutationOptions = Apollo.BaseMutationOptions<
  DeleteDatasetMutation,
  DeleteDatasetMutationVariables
>
export const UpdateDescriptionDocument = gql`
  mutation updateDescription(
    $datasetId: ID!
    $field: String!
    $value: String!
  ) {
    updateDescription(datasetId: $datasetId, field: $field, value: $value) {
      id
      Name
      BIDSVersion
      License
      Authors
      Acknowledgements
      HowToAcknowledge
      Funding
      ReferencesAndLinks
      DatasetDOI
      EthicsApprovals
    }
  }
`
export type UpdateDescriptionMutationFn = Apollo.MutationFunction<
  UpdateDescriptionMutation,
  UpdateDescriptionMutationVariables
>

/**
 * __useUpdateDescriptionMutation__
 *
 * To run a mutation, you first call `useUpdateDescriptionMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useUpdateDescriptionMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [updateDescriptionMutation, { data, loading, error }] = useUpdateDescriptionMutation({
 *   variables: {
 *      datasetId: // value for 'datasetId'
 *      field: // value for 'field'
 *      value: // value for 'value'
 *   },
 * });
 */
export function useUpdateDescriptionMutation(
  baseOptions?: Apollo.MutationHookOptions<
    UpdateDescriptionMutation,
    UpdateDescriptionMutationVariables
  >,
) {
  const options = { ...defaultOptions, ...baseOptions }
  return Apollo.useMutation<
    UpdateDescriptionMutation,
    UpdateDescriptionMutationVariables
  >(UpdateDescriptionDocument, options)
}
export type UpdateDescriptionMutationHookResult = ReturnType<
  typeof useUpdateDescriptionMutation
>
export type UpdateDescriptionMutationResult =
  Apollo.MutationResult<UpdateDescriptionMutation>
export type UpdateDescriptionMutationOptions = Apollo.BaseMutationOptions<
  UpdateDescriptionMutation,
  UpdateDescriptionMutationVariables
>
export const UpdateDescriptionListDocument = gql`
  mutation updateDescriptionList(
    $datasetId: ID!
    $field: String!
    $value: [String!]
  ) {
    updateDescriptionList(datasetId: $datasetId, field: $field, value: $value) {
      id
      Name
      BIDSVersion
      License
      Authors
      Acknowledgements
      HowToAcknowledge
      Funding
      ReferencesAndLinks
      DatasetDOI
      EthicsApprovals
    }
  }
`
export type UpdateDescriptionListMutationFn = Apollo.MutationFunction<
  UpdateDescriptionListMutation,
  UpdateDescriptionListMutationVariables
>

/**
 * __useUpdateDescriptionListMutation__
 *
 * To run a mutation, you first call `useUpdateDescriptionListMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useUpdateDescriptionListMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [updateDescriptionListMutation, { data, loading, error }] = useUpdateDescriptionListMutation({
 *   variables: {
 *      datasetId: // value for 'datasetId'
 *      field: // value for 'field'
 *      value: // value for 'value'
 *   },
 * });
 */
export function useUpdateDescriptionListMutation(
  baseOptions?: Apollo.MutationHookOptions<
    UpdateDescriptionListMutation,
    UpdateDescriptionListMutationVariables
  >,
) {
  const options = { ...defaultOptions, ...baseOptions }
  return Apollo.useMutation<
    UpdateDescriptionListMutation,
    UpdateDescriptionListMutationVariables
  >(UpdateDescriptionListDocument, options)
}
export type UpdateDescriptionListMutationHookResult = ReturnType<
  typeof useUpdateDescriptionListMutation
>
export type UpdateDescriptionListMutationResult =
  Apollo.MutationResult<UpdateDescriptionListMutation>
export type UpdateDescriptionListMutationOptions = Apollo.BaseMutationOptions<
  UpdateDescriptionListMutation,
  UpdateDescriptionListMutationVariables
>
export const FlagAnnexObjectDocument = gql`
  mutation flagAnnexObject(
    $datasetId: ID!
    $snapshot: String!
    $filepath: String!
    $annexKey: String!
  ) {
    flagAnnexObject(
      datasetId: $datasetId
      snapshot: $snapshot
      filepath: $filepath
      annexKey: $annexKey
    )
  }
`
export type FlagAnnexObjectMutationFn = Apollo.MutationFunction<
  FlagAnnexObjectMutation,
  FlagAnnexObjectMutationVariables
>

/**
 * __useFlagAnnexObjectMutation__
 *
 * To run a mutation, you first call `useFlagAnnexObjectMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useFlagAnnexObjectMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [flagAnnexObjectMutation, { data, loading, error }] = useFlagAnnexObjectMutation({
 *   variables: {
 *      datasetId: // value for 'datasetId'
 *      snapshot: // value for 'snapshot'
 *      filepath: // value for 'filepath'
 *      annexKey: // value for 'annexKey'
 *   },
 * });
 */
export function useFlagAnnexObjectMutation(
  baseOptions?: Apollo.MutationHookOptions<
    FlagAnnexObjectMutation,
    FlagAnnexObjectMutationVariables
  >,
) {
  const options = { ...defaultOptions, ...baseOptions }
  return Apollo.useMutation<
    FlagAnnexObjectMutation,
    FlagAnnexObjectMutationVariables
  >(FlagAnnexObjectDocument, options)
}
export type FlagAnnexObjectMutationHookResult = ReturnType<
  typeof useFlagAnnexObjectMutation
>
export type FlagAnnexObjectMutationResult =
  Apollo.MutationResult<FlagAnnexObjectMutation>
export type FlagAnnexObjectMutationOptions = Apollo.BaseMutationOptions<
  FlagAnnexObjectMutation,
  FlagAnnexObjectMutationVariables
>
export const FollowDatasetDocument = gql`
  mutation followDataset($datasetId: ID!) {
    followDataset(datasetId: $datasetId)
  }
`
export type FollowDatasetMutationFn = Apollo.MutationFunction<
  FollowDatasetMutation,
  FollowDatasetMutationVariables
>

/**
 * __useFollowDatasetMutation__
 *
 * To run a mutation, you first call `useFollowDatasetMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useFollowDatasetMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [followDatasetMutation, { data, loading, error }] = useFollowDatasetMutation({
 *   variables: {
 *      datasetId: // value for 'datasetId'
 *   },
 * });
 */
export function useFollowDatasetMutation(
  baseOptions?: Apollo.MutationHookOptions<
    FollowDatasetMutation,
    FollowDatasetMutationVariables
  >,
) {
  const options = { ...defaultOptions, ...baseOptions }
  return Apollo.useMutation<
    FollowDatasetMutation,
    FollowDatasetMutationVariables
  >(FollowDatasetDocument, options)
}
export type FollowDatasetMutationHookResult = ReturnType<
  typeof useFollowDatasetMutation
>
export type FollowDatasetMutationResult =
  Apollo.MutationResult<FollowDatasetMutation>
export type FollowDatasetMutationOptions = Apollo.BaseMutationOptions<
  FollowDatasetMutation,
  FollowDatasetMutationVariables
>
export const PublishDatasetDocument = gql`
  mutation publishDataset($datasetId: ID!) {
    publishDataset(datasetId: $datasetId)
  }
`
export type PublishDatasetMutationFn = Apollo.MutationFunction<
  PublishDatasetMutation,
  PublishDatasetMutationVariables
>

/**
 * __usePublishDatasetMutation__
 *
 * To run a mutation, you first call `usePublishDatasetMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `usePublishDatasetMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [publishDatasetMutation, { data, loading, error }] = usePublishDatasetMutation({
 *   variables: {
 *      datasetId: // value for 'datasetId'
 *   },
 * });
 */
export function usePublishDatasetMutation(
  baseOptions?: Apollo.MutationHookOptions<
    PublishDatasetMutation,
    PublishDatasetMutationVariables
  >,
) {
  const options = { ...defaultOptions, ...baseOptions }
  return Apollo.useMutation<
    PublishDatasetMutation,
    PublishDatasetMutationVariables
  >(PublishDatasetDocument, options)
}
export type PublishDatasetMutationHookResult = ReturnType<
  typeof usePublishDatasetMutation
>
export type PublishDatasetMutationResult =
  Apollo.MutationResult<PublishDatasetMutation>
export type PublishDatasetMutationOptions = Apollo.BaseMutationOptions<
  PublishDatasetMutation,
  PublishDatasetMutationVariables
>
export const UpdateReadmeDocument = gql`
  mutation updateReadme($datasetId: ID!, $value: String!) {
    updateReadme(datasetId: $datasetId, value: $value)
  }
`
export type UpdateReadmeMutationFn = Apollo.MutationFunction<
  UpdateReadmeMutation,
  UpdateReadmeMutationVariables
>

/**
 * __useUpdateReadmeMutation__
 *
 * To run a mutation, you first call `useUpdateReadmeMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useUpdateReadmeMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [updateReadmeMutation, { data, loading, error }] = useUpdateReadmeMutation({
 *   variables: {
 *      datasetId: // value for 'datasetId'
 *      value: // value for 'value'
 *   },
 * });
 */
export function useUpdateReadmeMutation(
  baseOptions?: Apollo.MutationHookOptions<
    UpdateReadmeMutation,
    UpdateReadmeMutationVariables
  >,
) {
  const options = { ...defaultOptions, ...baseOptions }
  return Apollo.useMutation<
    UpdateReadmeMutation,
    UpdateReadmeMutationVariables
  >(UpdateReadmeDocument, options)
}
export type UpdateReadmeMutationHookResult = ReturnType<
  typeof useUpdateReadmeMutation
>
export type UpdateReadmeMutationResult =
  Apollo.MutationResult<UpdateReadmeMutation>
export type UpdateReadmeMutationOptions = Apollo.BaseMutationOptions<
  UpdateReadmeMutation,
  UpdateReadmeMutationVariables
>
export const RemoveAnnexObjectDocument = gql`
  mutation removeAnnexObject(
    $datasetId: ID!
    $snapshot: String!
    $annexKey: String!
    $path: String
    $filename: String
  ) {
    removeAnnexObject(
      datasetId: $datasetId
      snapshot: $snapshot
      annexKey: $annexKey
      path: $path
      filename: $filename
    )
  }
`
export type RemoveAnnexObjectMutationFn = Apollo.MutationFunction<
  RemoveAnnexObjectMutation,
  RemoveAnnexObjectMutationVariables
>

/**
 * __useRemoveAnnexObjectMutation__
 *
 * To run a mutation, you first call `useRemoveAnnexObjectMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useRemoveAnnexObjectMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [removeAnnexObjectMutation, { data, loading, error }] = useRemoveAnnexObjectMutation({
 *   variables: {
 *      datasetId: // value for 'datasetId'
 *      snapshot: // value for 'snapshot'
 *      annexKey: // value for 'annexKey'
 *      path: // value for 'path'
 *      filename: // value for 'filename'
 *   },
 * });
 */
export function useRemoveAnnexObjectMutation(
  baseOptions?: Apollo.MutationHookOptions<
    RemoveAnnexObjectMutation,
    RemoveAnnexObjectMutationVariables
  >,
) {
  const options = { ...defaultOptions, ...baseOptions }
  return Apollo.useMutation<
    RemoveAnnexObjectMutation,
    RemoveAnnexObjectMutationVariables
  >(RemoveAnnexObjectDocument, options)
}
export type RemoveAnnexObjectMutationHookResult = ReturnType<
  typeof useRemoveAnnexObjectMutation
>
export type RemoveAnnexObjectMutationResult =
  Apollo.MutationResult<RemoveAnnexObjectMutation>
export type RemoveAnnexObjectMutationOptions = Apollo.BaseMutationOptions<
  RemoveAnnexObjectMutation,
  RemoveAnnexObjectMutationVariables
>
export const RemovePermissionsDocument = gql`
  mutation removePermissions($datasetId: ID!, $userId: String!) {
    removePermissions(datasetId: $datasetId, userId: $userId)
  }
`
export type RemovePermissionsMutationFn = Apollo.MutationFunction<
  RemovePermissionsMutation,
  RemovePermissionsMutationVariables
>

/**
 * __useRemovePermissionsMutation__
 *
 * To run a mutation, you first call `useRemovePermissionsMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useRemovePermissionsMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [removePermissionsMutation, { data, loading, error }] = useRemovePermissionsMutation({
 *   variables: {
 *      datasetId: // value for 'datasetId'
 *      userId: // value for 'userId'
 *   },
 * });
 */
export function useRemovePermissionsMutation(
  baseOptions?: Apollo.MutationHookOptions<
    RemovePermissionsMutation,
    RemovePermissionsMutationVariables
  >,
) {
  const options = { ...defaultOptions, ...baseOptions }
  return Apollo.useMutation<
    RemovePermissionsMutation,
    RemovePermissionsMutationVariables
  >(RemovePermissionsDocument, options)
}
export type RemovePermissionsMutationHookResult = ReturnType<
  typeof useRemovePermissionsMutation
>
export type RemovePermissionsMutationResult =
  Apollo.MutationResult<RemovePermissionsMutation>
export type RemovePermissionsMutationOptions = Apollo.BaseMutationOptions<
  RemovePermissionsMutation,
  RemovePermissionsMutationVariables
>
export const RevalidateDocument = gql`
  mutation revalidate($datasetId: ID!, $ref: String!) {
    revalidate(datasetId: $datasetId, ref: $ref)
  }
`
export type RevalidateMutationFn = Apollo.MutationFunction<
  RevalidateMutation,
  RevalidateMutationVariables
>

/**
 * __useRevalidateMutation__
 *
 * To run a mutation, you first call `useRevalidateMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useRevalidateMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [revalidateMutation, { data, loading, error }] = useRevalidateMutation({
 *   variables: {
 *      datasetId: // value for 'datasetId'
 *      ref: // value for 'ref'
 *   },
 * });
 */
export function useRevalidateMutation(
  baseOptions?: Apollo.MutationHookOptions<
    RevalidateMutation,
    RevalidateMutationVariables
  >,
) {
  const options = { ...defaultOptions, ...baseOptions }
  return Apollo.useMutation<RevalidateMutation, RevalidateMutationVariables>(
    RevalidateDocument,
    options,
  )
}
export type RevalidateMutationHookResult = ReturnType<
  typeof useRevalidateMutation
>
export type RevalidateMutationResult = Apollo.MutationResult<RevalidateMutation>
export type RevalidateMutationOptions = Apollo.BaseMutationOptions<
  RevalidateMutation,
  RevalidateMutationVariables
>
export const StarDatasetDocument = gql`
  mutation starDataset($datasetId: ID!) {
    starDataset(datasetId: $datasetId)
  }
`
export type StarDatasetMutationFn = Apollo.MutationFunction<
  StarDatasetMutation,
  StarDatasetMutationVariables
>

/**
 * __useStarDatasetMutation__
 *
 * To run a mutation, you first call `useStarDatasetMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useStarDatasetMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [starDatasetMutation, { data, loading, error }] = useStarDatasetMutation({
 *   variables: {
 *      datasetId: // value for 'datasetId'
 *   },
 * });
 */
export function useStarDatasetMutation(
  baseOptions?: Apollo.MutationHookOptions<
    StarDatasetMutation,
    StarDatasetMutationVariables
  >,
) {
  const options = { ...defaultOptions, ...baseOptions }
  return Apollo.useMutation<StarDatasetMutation, StarDatasetMutationVariables>(
    StarDatasetDocument,
    options,
  )
}
export type StarDatasetMutationHookResult = ReturnType<
  typeof useStarDatasetMutation
>
export type StarDatasetMutationResult =
  Apollo.MutationResult<StarDatasetMutation>
export type StarDatasetMutationOptions = Apollo.BaseMutationOptions<
  StarDatasetMutation,
  StarDatasetMutationVariables
>
export const AddMetadataDocument = gql`
  mutation addMetadata($datasetId: ID!, $metadata: MetadataInput!) {
    addMetadata(datasetId: $datasetId, metadata: $metadata) {
      datasetId
      datasetUrl
      datasetName
      firstSnapshotCreatedAt
      latestSnapshotCreatedAt
      dxStatus
      tasksCompleted
      grantFunderName
      grantIdentifier
      trialCount
      studyDesign
      studyDomain
      studyLongitudinal
      dataProcessed
      species
      associatedPaperDOI
      openneuroPaperDOI
      seniorAuthor
      adminUsers
      ages
      modalities
      affirmedDefaced
      affirmedConsent
    }
  }
`
export type AddMetadataMutationFn = Apollo.MutationFunction<
  AddMetadataMutation,
  AddMetadataMutationVariables
>

/**
 * __useAddMetadataMutation__
 *
 * To run a mutation, you first call `useAddMetadataMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useAddMetadataMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [addMetadataMutation, { data, loading, error }] = useAddMetadataMutation({
 *   variables: {
 *      datasetId: // value for 'datasetId'
 *      metadata: // value for 'metadata'
 *   },
 * });
 */
export function useAddMetadataMutation(
  baseOptions?: Apollo.MutationHookOptions<
    AddMetadataMutation,
    AddMetadataMutationVariables
  >,
) {
  const options = { ...defaultOptions, ...baseOptions }
  return Apollo.useMutation<AddMetadataMutation, AddMetadataMutationVariables>(
    AddMetadataDocument,
    options,
  )
}
export type AddMetadataMutationHookResult = ReturnType<
  typeof useAddMetadataMutation
>
export type AddMetadataMutationResult =
  Apollo.MutationResult<AddMetadataMutation>
export type AddMetadataMutationOptions = Apollo.BaseMutationOptions<
  AddMetadataMutation,
  AddMetadataMutationVariables
>
export const SubscribeToNewsletterDocument = gql`
  mutation subscribeToNewsletter($email: String!) {
    subscribeToNewsletter(email: $email)
  }
`
export type SubscribeToNewsletterMutationFn = Apollo.MutationFunction<
  SubscribeToNewsletterMutation,
  SubscribeToNewsletterMutationVariables
>

/**
 * __useSubscribeToNewsletterMutation__
 *
 * To run a mutation, you first call `useSubscribeToNewsletterMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useSubscribeToNewsletterMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [subscribeToNewsletterMutation, { data, loading, error }] = useSubscribeToNewsletterMutation({
 *   variables: {
 *      email: // value for 'email'
 *   },
 * });
 */
export function useSubscribeToNewsletterMutation(
  baseOptions?: Apollo.MutationHookOptions<
    SubscribeToNewsletterMutation,
    SubscribeToNewsletterMutationVariables
  >,
) {
  const options = { ...defaultOptions, ...baseOptions }
  return Apollo.useMutation<
    SubscribeToNewsletterMutation,
    SubscribeToNewsletterMutationVariables
  >(SubscribeToNewsletterDocument, options)
}
export type SubscribeToNewsletterMutationHookResult = ReturnType<
  typeof useSubscribeToNewsletterMutation
>
export type SubscribeToNewsletterMutationResult =
  Apollo.MutationResult<SubscribeToNewsletterMutation>
export type SubscribeToNewsletterMutationOptions = Apollo.BaseMutationOptions<
  SubscribeToNewsletterMutation,
  SubscribeToNewsletterMutationVariables
>
export const ResetDraftDocument = gql`
  mutation resetDraft($datasetId: ID!, $ref: String!) {
    resetDraft(datasetId: $datasetId, ref: $ref)
  }
`
export type ResetDraftMutationFn = Apollo.MutationFunction<
  ResetDraftMutation,
  ResetDraftMutationVariables
>

/**
 * __useResetDraftMutation__
 *
 * To run a mutation, you first call `useResetDraftMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useResetDraftMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [resetDraftMutation, { data, loading, error }] = useResetDraftMutation({
 *   variables: {
 *      datasetId: // value for 'datasetId'
 *      ref: // value for 'ref'
 *   },
 * });
 */
export function useResetDraftMutation(
  baseOptions?: Apollo.MutationHookOptions<
    ResetDraftMutation,
    ResetDraftMutationVariables
  >,
) {
  const options = { ...defaultOptions, ...baseOptions }
  return Apollo.useMutation<ResetDraftMutation, ResetDraftMutationVariables>(
    ResetDraftDocument,
    options,
  )
}
export type ResetDraftMutationHookResult = ReturnType<
  typeof useResetDraftMutation
>
export type ResetDraftMutationResult = Apollo.MutationResult<ResetDraftMutation>
export type ResetDraftMutationOptions = Apollo.BaseMutationOptions<
  ResetDraftMutation,
  ResetDraftMutationVariables
>
export const ReexportRemotesDocument = gql`
  mutation reexportRemotes($datasetId: ID!) {
    reexportRemotes(datasetId: $datasetId)
  }
`
export type ReexportRemotesMutationFn = Apollo.MutationFunction<
  ReexportRemotesMutation,
  ReexportRemotesMutationVariables
>

/**
 * __useReexportRemotesMutation__
 *
 * To run a mutation, you first call `useReexportRemotesMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useReexportRemotesMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [reexportRemotesMutation, { data, loading, error }] = useReexportRemotesMutation({
 *   variables: {
 *      datasetId: // value for 'datasetId'
 *   },
 * });
 */
export function useReexportRemotesMutation(
  baseOptions?: Apollo.MutationHookOptions<
    ReexportRemotesMutation,
    ReexportRemotesMutationVariables
  >,
) {
  const options = { ...defaultOptions, ...baseOptions }
  return Apollo.useMutation<
    ReexportRemotesMutation,
    ReexportRemotesMutationVariables
  >(ReexportRemotesDocument, options)
}
export type ReexportRemotesMutationHookResult = ReturnType<
  typeof useReexportRemotesMutation
>
export type ReexportRemotesMutationResult =
  Apollo.MutationResult<ReexportRemotesMutation>
export type ReexportRemotesMutationOptions = Apollo.BaseMutationOptions<
  ReexportRemotesMutation,
  ReexportRemotesMutationVariables
>
export const SnapshotDocument = gql`
  query snapshot($datasetId: ID!, $tag: String!) {
    snapshot(datasetId: $datasetId, tag: $tag) {
      id
      ...SnapshotFields
    }
  }
  ${SnapshotFieldsFragmentDoc}
`

/**
 * __useSnapshotQuery__
 *
 * To run a query within a React component, call `useSnapshotQuery` and pass it any options that fit your needs.
 * When your component renders, `useSnapshotQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useSnapshotQuery({
 *   variables: {
 *      datasetId: // value for 'datasetId'
 *      tag: // value for 'tag'
 *   },
 * });
 */
export function useSnapshotQuery(
  baseOptions: Apollo.QueryHookOptions<SnapshotQuery, SnapshotQueryVariables>,
) {
  const options = { ...defaultOptions, ...baseOptions }
  return Apollo.useQuery<SnapshotQuery, SnapshotQueryVariables>(
    SnapshotDocument,
    options,
  )
}
export function useSnapshotLazyQuery(
  baseOptions?: Apollo.LazyQueryHookOptions<
    SnapshotQuery,
    SnapshotQueryVariables
  >,
) {
  const options = { ...defaultOptions, ...baseOptions }
  return Apollo.useLazyQuery<SnapshotQuery, SnapshotQueryVariables>(
    SnapshotDocument,
    options,
  )
}
export type SnapshotQueryHookResult = ReturnType<typeof useSnapshotQuery>
export type SnapshotLazyQueryHookResult = ReturnType<
  typeof useSnapshotLazyQuery
>
export type SnapshotQueryResult = Apollo.QueryResult<
  SnapshotQuery,
  SnapshotQueryVariables
>
export const FilesUpdatedDocument = gql`
  subscription filesUpdated($datasetId: ID!) {
    filesUpdated(datasetId: $datasetId) {
      action
      payload {
        id
        filename
        size
        directory
      }
    }
  }
`

/**
 * __useFilesUpdatedSubscription__
 *
 * To run a query within a React component, call `useFilesUpdatedSubscription` and pass it any options that fit your needs.
 * When your component renders, `useFilesUpdatedSubscription` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the subscription, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useFilesUpdatedSubscription({
 *   variables: {
 *      datasetId: // value for 'datasetId'
 *   },
 * });
 */
export function useFilesUpdatedSubscription(
  baseOptions: Apollo.SubscriptionHookOptions<
    FilesUpdatedSubscription,
    FilesUpdatedSubscriptionVariables
  >,
) {
  const options = { ...defaultOptions, ...baseOptions }
  return Apollo.useSubscription<
    FilesUpdatedSubscription,
    FilesUpdatedSubscriptionVariables
  >(FilesUpdatedDocument, options)
}
export type FilesUpdatedSubscriptionHookResult = ReturnType<
  typeof useFilesUpdatedSubscription
>
export type FilesUpdatedSubscriptionResult =
  Apollo.SubscriptionResult<FilesUpdatedSubscription>
export const DatasetDeletedDocument = gql`
  subscription datasetDeleted($datasetIds: [ID!]) {
    datasetDeleted(datasetIds: $datasetIds)
  }
`

/**
 * __useDatasetDeletedSubscription__
 *
 * To run a query within a React component, call `useDatasetDeletedSubscription` and pass it any options that fit your needs.
 * When your component renders, `useDatasetDeletedSubscription` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the subscription, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useDatasetDeletedSubscription({
 *   variables: {
 *      datasetIds: // value for 'datasetIds'
 *   },
 * });
 */
export function useDatasetDeletedSubscription(
  baseOptions?: Apollo.SubscriptionHookOptions<
    DatasetDeletedSubscription,
    DatasetDeletedSubscriptionVariables
  >,
) {
  const options = { ...defaultOptions, ...baseOptions }
  return Apollo.useSubscription<
    DatasetDeletedSubscription,
    DatasetDeletedSubscriptionVariables
  >(DatasetDeletedDocument, options)
}
export type DatasetDeletedSubscriptionHookResult = ReturnType<
  typeof useDatasetDeletedSubscription
>
export type DatasetDeletedSubscriptionResult =
  Apollo.SubscriptionResult<DatasetDeletedSubscription>
export const DraftUpdatedDocument = gql`
  subscription draftUpdated($datasetId: ID!) {
    draftUpdated(datasetId: $datasetId) {
      id
      ...DatasetDraft
      ...DatasetIssues
    }
  }
  ${DatasetDraftFragmentDoc}
  ${DatasetIssuesFragmentDoc}
`

/**
 * __useDraftUpdatedSubscription__
 *
 * To run a query within a React component, call `useDraftUpdatedSubscription` and pass it any options that fit your needs.
 * When your component renders, `useDraftUpdatedSubscription` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the subscription, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useDraftUpdatedSubscription({
 *   variables: {
 *      datasetId: // value for 'datasetId'
 *   },
 * });
 */
export function useDraftUpdatedSubscription(
  baseOptions: Apollo.SubscriptionHookOptions<
    DraftUpdatedSubscription,
    DraftUpdatedSubscriptionVariables
  >,
) {
  const options = { ...defaultOptions, ...baseOptions }
  return Apollo.useSubscription<
    DraftUpdatedSubscription,
    DraftUpdatedSubscriptionVariables
  >(DraftUpdatedDocument, options)
}
export type DraftUpdatedSubscriptionHookResult = ReturnType<
  typeof useDraftUpdatedSubscription
>
export type DraftUpdatedSubscriptionResult =
  Apollo.SubscriptionResult<DraftUpdatedSubscription>
export const PermissionsUpdatedDocument = gql`
  subscription permissionsUpdated($datasetIds: [ID!]) {
    permissionsUpdated(datasetIds: $datasetIds) {
      id
      ...DatasetPermissions
    }
  }
  ${DatasetPermissionsFragmentDoc}
`

/**
 * __usePermissionsUpdatedSubscription__
 *
 * To run a query within a React component, call `usePermissionsUpdatedSubscription` and pass it any options that fit your needs.
 * When your component renders, `usePermissionsUpdatedSubscription` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the subscription, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = usePermissionsUpdatedSubscription({
 *   variables: {
 *      datasetIds: // value for 'datasetIds'
 *   },
 * });
 */
export function usePermissionsUpdatedSubscription(
  baseOptions?: Apollo.SubscriptionHookOptions<
    PermissionsUpdatedSubscription,
    PermissionsUpdatedSubscriptionVariables
  >,
) {
  const options = { ...defaultOptions, ...baseOptions }
  return Apollo.useSubscription<
    PermissionsUpdatedSubscription,
    PermissionsUpdatedSubscriptionVariables
  >(PermissionsUpdatedDocument, options)
}
export type PermissionsUpdatedSubscriptionHookResult = ReturnType<
  typeof usePermissionsUpdatedSubscription
>
export type PermissionsUpdatedSubscriptionResult =
  Apollo.SubscriptionResult<PermissionsUpdatedSubscription>
export const SnapshotsUpdatedDocument = gql`
  subscription snapshotsUpdated($datasetId: ID!) {
    snapshotsUpdated(datasetId: $datasetId) {
      id
      ...DatasetSnapshots
    }
  }
  ${DatasetSnapshotsFragmentDoc}
`

/**
 * __useSnapshotsUpdatedSubscription__
 *
 * To run a query within a React component, call `useSnapshotsUpdatedSubscription` and pass it any options that fit your needs.
 * When your component renders, `useSnapshotsUpdatedSubscription` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the subscription, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useSnapshotsUpdatedSubscription({
 *   variables: {
 *      datasetId: // value for 'datasetId'
 *   },
 * });
 */
export function useSnapshotsUpdatedSubscription(
  baseOptions: Apollo.SubscriptionHookOptions<
    SnapshotsUpdatedSubscription,
    SnapshotsUpdatedSubscriptionVariables
  >,
) {
  const options = { ...defaultOptions, ...baseOptions }
  return Apollo.useSubscription<
    SnapshotsUpdatedSubscription,
    SnapshotsUpdatedSubscriptionVariables
  >(SnapshotsUpdatedDocument, options)
}
export type SnapshotsUpdatedSubscriptionHookResult = ReturnType<
  typeof useSnapshotsUpdatedSubscription
>
export type SnapshotsUpdatedSubscriptionResult =
  Apollo.SubscriptionResult<SnapshotsUpdatedSubscription>
export const GetDraftFileTreeDocument = gql`
  query getDraftFileTree($datasetId: ID!, $filePrefix: String!) {
    dataset(id: $datasetId) {
      draft {
        files(prefix: $filePrefix) {
          id
          key
          filename
          size
          directory
          annexed
        }
      }
    }
  }
`

/**
 * __useGetDraftFileTreeQuery__
 *
 * To run a query within a React component, call `useGetDraftFileTreeQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetDraftFileTreeQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetDraftFileTreeQuery({
 *   variables: {
 *      datasetId: // value for 'datasetId'
 *      filePrefix: // value for 'filePrefix'
 *   },
 * });
 */
export function useGetDraftFileTreeQuery(
  baseOptions: Apollo.QueryHookOptions<
    GetDraftFileTreeQuery,
    GetDraftFileTreeQueryVariables
  >,
) {
  const options = { ...defaultOptions, ...baseOptions }
  return Apollo.useQuery<GetDraftFileTreeQuery, GetDraftFileTreeQueryVariables>(
    GetDraftFileTreeDocument,
    options,
  )
}
export function useGetDraftFileTreeLazyQuery(
  baseOptions?: Apollo.LazyQueryHookOptions<
    GetDraftFileTreeQuery,
    GetDraftFileTreeQueryVariables
  >,
) {
  const options = { ...defaultOptions, ...baseOptions }
  return Apollo.useLazyQuery<
    GetDraftFileTreeQuery,
    GetDraftFileTreeQueryVariables
  >(GetDraftFileTreeDocument, options)
}
export type GetDraftFileTreeQueryHookResult = ReturnType<
  typeof useGetDraftFileTreeQuery
>
export type GetDraftFileTreeLazyQueryHookResult = ReturnType<
  typeof useGetDraftFileTreeLazyQuery
>
export type GetDraftFileTreeQueryResult = Apollo.QueryResult<
  GetDraftFileTreeQuery,
  GetDraftFileTreeQueryVariables
>
export const GetSnapshotFileTreeDocument = gql`
  query getSnapshotFileTree(
    $datasetId: ID!
    $snapshotTag: String!
    $filePrefix: String!
  ) {
    snapshot(datasetId: $datasetId, tag: $snapshotTag) {
      files(prefix: $filePrefix) {
        id
        key
        filename
        size
        directory
        annexed
      }
    }
  }
`

/**
 * __useGetSnapshotFileTreeQuery__
 *
 * To run a query within a React component, call `useGetSnapshotFileTreeQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetSnapshotFileTreeQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetSnapshotFileTreeQuery({
 *   variables: {
 *      datasetId: // value for 'datasetId'
 *      snapshotTag: // value for 'snapshotTag'
 *      filePrefix: // value for 'filePrefix'
 *   },
 * });
 */
export function useGetSnapshotFileTreeQuery(
  baseOptions: Apollo.QueryHookOptions<
    GetSnapshotFileTreeQuery,
    GetSnapshotFileTreeQueryVariables
  >,
) {
  const options = { ...defaultOptions, ...baseOptions }
  return Apollo.useQuery<
    GetSnapshotFileTreeQuery,
    GetSnapshotFileTreeQueryVariables
  >(GetSnapshotFileTreeDocument, options)
}
export function useGetSnapshotFileTreeLazyQuery(
  baseOptions?: Apollo.LazyQueryHookOptions<
    GetSnapshotFileTreeQuery,
    GetSnapshotFileTreeQueryVariables
  >,
) {
  const options = { ...defaultOptions, ...baseOptions }
  return Apollo.useLazyQuery<
    GetSnapshotFileTreeQuery,
    GetSnapshotFileTreeQueryVariables
  >(GetSnapshotFileTreeDocument, options)
}
export type GetSnapshotFileTreeQueryHookResult = ReturnType<
  typeof useGetSnapshotFileTreeQuery
>
export type GetSnapshotFileTreeLazyQueryHookResult = ReturnType<
  typeof useGetSnapshotFileTreeLazyQuery
>
export type GetSnapshotFileTreeQueryResult = Apollo.QueryResult<
  GetSnapshotFileTreeQuery,
  GetSnapshotFileTreeQueryVariables
>
export const PublicDatasetCountDocument = gql`
  query publicDatasetCount {
    datasets(filterBy: { public: true }) {
      pageInfo {
        count
      }
    }
  }
`

/**
 * __usePublicDatasetCountQuery__
 *
 * To run a query within a React component, call `usePublicDatasetCountQuery` and pass it any options that fit your needs.
 * When your component renders, `usePublicDatasetCountQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = usePublicDatasetCountQuery({
 *   variables: {
 *   },
 * });
 */
export function usePublicDatasetCountQuery(
  baseOptions?: Apollo.QueryHookOptions<
    PublicDatasetCountQuery,
    PublicDatasetCountQueryVariables
  >,
) {
  const options = { ...defaultOptions, ...baseOptions }
  return Apollo.useQuery<
    PublicDatasetCountQuery,
    PublicDatasetCountQueryVariables
  >(PublicDatasetCountDocument, options)
}
export function usePublicDatasetCountLazyQuery(
  baseOptions?: Apollo.LazyQueryHookOptions<
    PublicDatasetCountQuery,
    PublicDatasetCountQueryVariables
  >,
) {
  const options = { ...defaultOptions, ...baseOptions }
  return Apollo.useLazyQuery<
    PublicDatasetCountQuery,
    PublicDatasetCountQueryVariables
  >(PublicDatasetCountDocument, options)
}
export type PublicDatasetCountQueryHookResult = ReturnType<
  typeof usePublicDatasetCountQuery
>
export type PublicDatasetCountLazyQueryHookResult = ReturnType<
  typeof usePublicDatasetCountLazyQuery
>
export type PublicDatasetCountQueryResult = Apollo.QueryResult<
  PublicDatasetCountQuery,
  PublicDatasetCountQueryVariables
>
export const Top_Viewed_DatasetsDocument = gql`
  query top_viewed_datasets {
    datasets(
      first: 5
      orderBy: { views: descending }
      filterBy: { public: true }
    ) {
      edges {
        node {
          id
          analytics {
            views
          }
          latestSnapshot {
            tag
            description {
              Name
            }
          }
        }
      }
    }
  }
`

/**
 * __useTop_Viewed_DatasetsQuery__
 *
 * To run a query within a React component, call `useTop_Viewed_DatasetsQuery` and pass it any options that fit your needs.
 * When your component renders, `useTop_Viewed_DatasetsQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useTop_Viewed_DatasetsQuery({
 *   variables: {
 *   },
 * });
 */
export function useTop_Viewed_DatasetsQuery(
  baseOptions?: Apollo.QueryHookOptions<
    Top_Viewed_DatasetsQuery,
    Top_Viewed_DatasetsQueryVariables
  >,
) {
  const options = { ...defaultOptions, ...baseOptions }
  return Apollo.useQuery<
    Top_Viewed_DatasetsQuery,
    Top_Viewed_DatasetsQueryVariables
  >(Top_Viewed_DatasetsDocument, options)
}
export function useTop_Viewed_DatasetsLazyQuery(
  baseOptions?: Apollo.LazyQueryHookOptions<
    Top_Viewed_DatasetsQuery,
    Top_Viewed_DatasetsQueryVariables
  >,
) {
  const options = { ...defaultOptions, ...baseOptions }
  return Apollo.useLazyQuery<
    Top_Viewed_DatasetsQuery,
    Top_Viewed_DatasetsQueryVariables
  >(Top_Viewed_DatasetsDocument, options)
}
export type Top_Viewed_DatasetsQueryHookResult = ReturnType<
  typeof useTop_Viewed_DatasetsQuery
>
export type Top_Viewed_DatasetsLazyQueryHookResult = ReturnType<
  typeof useTop_Viewed_DatasetsLazyQuery
>
export type Top_Viewed_DatasetsQueryResult = Apollo.QueryResult<
  Top_Viewed_DatasetsQuery,
  Top_Viewed_DatasetsQueryVariables
>
export const Recently_Published_DatasetsDocument = gql`
  query recently_published_datasets {
    datasets(
      first: 5
      orderBy: { publishDate: descending }
      filterBy: { public: true }
    ) {
      edges {
        node {
          id
          publishDate
          latestSnapshot {
            tag
            description {
              Name
            }
          }
        }
      }
    }
  }
`

/**
 * __useRecently_Published_DatasetsQuery__
 *
 * To run a query within a React component, call `useRecently_Published_DatasetsQuery` and pass it any options that fit your needs.
 * When your component renders, `useRecently_Published_DatasetsQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useRecently_Published_DatasetsQuery({
 *   variables: {
 *   },
 * });
 */
export function useRecently_Published_DatasetsQuery(
  baseOptions?: Apollo.QueryHookOptions<
    Recently_Published_DatasetsQuery,
    Recently_Published_DatasetsQueryVariables
  >,
) {
  const options = { ...defaultOptions, ...baseOptions }
  return Apollo.useQuery<
    Recently_Published_DatasetsQuery,
    Recently_Published_DatasetsQueryVariables
  >(Recently_Published_DatasetsDocument, options)
}
export function useRecently_Published_DatasetsLazyQuery(
  baseOptions?: Apollo.LazyQueryHookOptions<
    Recently_Published_DatasetsQuery,
    Recently_Published_DatasetsQueryVariables
  >,
) {
  const options = { ...defaultOptions, ...baseOptions }
  return Apollo.useLazyQuery<
    Recently_Published_DatasetsQuery,
    Recently_Published_DatasetsQueryVariables
  >(Recently_Published_DatasetsDocument, options)
}
export type Recently_Published_DatasetsQueryHookResult = ReturnType<
  typeof useRecently_Published_DatasetsQuery
>
export type Recently_Published_DatasetsLazyQueryHookResult = ReturnType<
  typeof useRecently_Published_DatasetsLazyQuery
>
export type Recently_Published_DatasetsQueryResult = Apollo.QueryResult<
  Recently_Published_DatasetsQuery,
  Recently_Published_DatasetsQueryVariables
>
export const ParticipantCountDocument = gql`
  query participantCount {
    participantCount
  }
`

/**
 * __useParticipantCountQuery__
 *
 * To run a query within a React component, call `useParticipantCountQuery` and pass it any options that fit your needs.
 * When your component renders, `useParticipantCountQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useParticipantCountQuery({
 *   variables: {
 *   },
 * });
 */
export function useParticipantCountQuery(
  baseOptions?: Apollo.QueryHookOptions<
    ParticipantCountQuery,
    ParticipantCountQueryVariables
  >,
) {
  const options = { ...defaultOptions, ...baseOptions }
  return Apollo.useQuery<ParticipantCountQuery, ParticipantCountQueryVariables>(
    ParticipantCountDocument,
    options,
  )
}
export function useParticipantCountLazyQuery(
  baseOptions?: Apollo.LazyQueryHookOptions<
    ParticipantCountQuery,
    ParticipantCountQueryVariables
  >,
) {
  const options = { ...defaultOptions, ...baseOptions }
  return Apollo.useLazyQuery<
    ParticipantCountQuery,
    ParticipantCountQueryVariables
  >(ParticipantCountDocument, options)
}
export type ParticipantCountQueryHookResult = ReturnType<
  typeof useParticipantCountQuery
>
export type ParticipantCountLazyQueryHookResult = ReturnType<
  typeof useParticipantCountLazyQuery
>
export type ParticipantCountQueryResult = Apollo.QueryResult<
  ParticipantCountQuery,
  ParticipantCountQueryVariables
>
export const PrepareRepoAccessDocument = gql`
  mutation prepareRepoAccess($datasetId: ID!) {
    prepareRepoAccess(datasetId: $datasetId) {
      token
      endpoint
    }
  }
`
export type PrepareRepoAccessMutationFn = Apollo.MutationFunction<
  PrepareRepoAccessMutation,
  PrepareRepoAccessMutationVariables
>

/**
 * __usePrepareRepoAccessMutation__
 *
 * To run a mutation, you first call `usePrepareRepoAccessMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `usePrepareRepoAccessMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [prepareRepoAccessMutation, { data, loading, error }] = usePrepareRepoAccessMutation({
 *   variables: {
 *      datasetId: // value for 'datasetId'
 *   },
 * });
 */
export function usePrepareRepoAccessMutation(
  baseOptions?: Apollo.MutationHookOptions<
    PrepareRepoAccessMutation,
    PrepareRepoAccessMutationVariables
  >,
) {
  const options = { ...defaultOptions, ...baseOptions }
  return Apollo.useMutation<
    PrepareRepoAccessMutation,
    PrepareRepoAccessMutationVariables
  >(PrepareRepoAccessDocument, options)
}
export type PrepareRepoAccessMutationHookResult = ReturnType<
  typeof usePrepareRepoAccessMutation
>
export type PrepareRepoAccessMutationResult =
  Apollo.MutationResult<PrepareRepoAccessMutation>
export type PrepareRepoAccessMutationOptions = Apollo.BaseMutationOptions<
  PrepareRepoAccessMutation,
  PrepareRepoAccessMutationVariables
>
export const DatasetDocument = gql`
  query dataset($id: ID!) {
    dataset(id: $id) {
      id
      snapshots {
        id
        tag
        created
        description {
          Name
        }
      }
    }
  }
`

/**
 * __useDatasetQuery__
 *
 * To run a query within a React component, call `useDatasetQuery` and pass it any options that fit your needs.
 * When your component renders, `useDatasetQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useDatasetQuery({
 *   variables: {
 *      id: // value for 'id'
 *   },
 * });
 */
export function useDatasetQuery(
  baseOptions: Apollo.QueryHookOptions<DatasetQuery, DatasetQueryVariables>,
) {
  const options = { ...defaultOptions, ...baseOptions }
  return Apollo.useQuery<DatasetQuery, DatasetQueryVariables>(
    DatasetDocument,
    options,
  )
}
export function useDatasetLazyQuery(
  baseOptions?: Apollo.LazyQueryHookOptions<
    DatasetQuery,
    DatasetQueryVariables
  >,
) {
  const options = { ...defaultOptions, ...baseOptions }
  return Apollo.useLazyQuery<DatasetQuery, DatasetQueryVariables>(
    DatasetDocument,
    options,
  )
}
export type DatasetQueryHookResult = ReturnType<typeof useDatasetQuery>
export type DatasetLazyQueryHookResult = ReturnType<typeof useDatasetLazyQuery>
export type DatasetQueryResult = Apollo.QueryResult<
  DatasetQuery,
  DatasetQueryVariables
>
export const GetDatasetDocument = gql`
  query getDataset($id: ID!) {
    dataset(id: $id) {
      id
      _id: id
      created
      public
      uploader {
        id
        name
        email
      }
      draft {
        id
        description {
          Name
        }
        modified
        files {
          id
          filename
          size
          objectpath
        }
        summary {
          modalities
          sessions
          subjects
          subjectMetadata {
            participantId
            age
            sex
            group
          }
          tasks
          size
          totalFiles
          dataProcessed
        }
        issues {
          key
          severity
        }
      }
      snapshots {
        id
        _id: id
        tag
        created
        snapshot_version: tag
      }
      permissions {
        id
        userPermissions {
          userId
          _id: userId
          level
          access: level
          user {
            id
            name
            email
            provider
          }
        }
      }
    }
  }
`

/**
 * __useGetDatasetQuery__
 *
 * To run a query within a React component, call `useGetDatasetQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetDatasetQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetDatasetQuery({
 *   variables: {
 *      id: // value for 'id'
 *   },
 * });
 */
export function useGetDatasetQuery(
  baseOptions: Apollo.QueryHookOptions<
    GetDatasetQuery,
    GetDatasetQueryVariables
  >,
) {
  const options = { ...defaultOptions, ...baseOptions }
  return Apollo.useQuery<GetDatasetQuery, GetDatasetQueryVariables>(
    GetDatasetDocument,
    options,
  )
}
export function useGetDatasetLazyQuery(
  baseOptions?: Apollo.LazyQueryHookOptions<
    GetDatasetQuery,
    GetDatasetQueryVariables
  >,
) {
  const options = { ...defaultOptions, ...baseOptions }
  return Apollo.useLazyQuery<GetDatasetQuery, GetDatasetQueryVariables>(
    GetDatasetDocument,
    options,
  )
}
export type GetDatasetQueryHookResult = ReturnType<typeof useGetDatasetQuery>
export type GetDatasetLazyQueryHookResult = ReturnType<
  typeof useGetDatasetLazyQuery
>
export type GetDatasetQueryResult = Apollo.QueryResult<
  GetDatasetQuery,
  GetDatasetQueryVariables
>
export const GetDraftFilesDocument = gql`
  query getDraftFiles($id: ID!) {
    dataset(id: $id) {
      id
      draft {
        id
        files(prefix: null) {
          filename
          size
        }
      }
      metadata {
        affirmedDefaced
        affirmedConsent
      }
    }
  }
`

/**
 * __useGetDraftFilesQuery__
 *
 * To run a query within a React component, call `useGetDraftFilesQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetDraftFilesQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetDraftFilesQuery({
 *   variables: {
 *      id: // value for 'id'
 *   },
 * });
 */
export function useGetDraftFilesQuery(
  baseOptions: Apollo.QueryHookOptions<
    GetDraftFilesQuery,
    GetDraftFilesQueryVariables
  >,
) {
  const options = { ...defaultOptions, ...baseOptions }
  return Apollo.useQuery<GetDraftFilesQuery, GetDraftFilesQueryVariables>(
    GetDraftFilesDocument,
    options,
  )
}
export function useGetDraftFilesLazyQuery(
  baseOptions?: Apollo.LazyQueryHookOptions<
    GetDraftFilesQuery,
    GetDraftFilesQueryVariables
  >,
) {
  const options = { ...defaultOptions, ...baseOptions }
  return Apollo.useLazyQuery<GetDraftFilesQuery, GetDraftFilesQueryVariables>(
    GetDraftFilesDocument,
    options,
  )
}
export type GetDraftFilesQueryHookResult = ReturnType<
  typeof useGetDraftFilesQuery
>
export type GetDraftFilesLazyQueryHookResult = ReturnType<
  typeof useGetDraftFilesLazyQuery
>
export type GetDraftFilesQueryResult = Apollo.QueryResult<
  GetDraftFilesQuery,
  GetDraftFilesQueryVariables
>
export const GetDatasetsDocument = gql`
  query getDatasets(
    $cursor: String
    $orderBy: DatasetSort = { created: descending }
    $filterBy: DatasetFilter = {}
    $myDatasets: Boolean = false
  ) {
    datasets(
      first: 25
      after: $cursor
      orderBy: $orderBy
      filterBy: $filterBy
      myDatasets: $myDatasets
    ) {
      edges {
        node {
          id
          created
          uploader {
            id
            name
          }
          public
          permissions {
            id
            userPermissions {
              userId
              level
              access: level
              user {
                id
                name
                email
                provider
              }
            }
          }
          draft {
            id
            summary {
              modalities
              sessions
              subjects
              subjectMetadata {
                participantId
                age
                sex
                group
              }
              tasks
              size
              totalFiles
              dataProcessed
            }
            issues {
              severity
            }
            description {
              Name
            }
          }
          analytics {
            views
            downloads
          }
          stars {
            userId
            datasetId
          }
          followers {
            userId
            datasetId
          }
          snapshots {
            id
            created
            tag
          }
        }
      }
      pageInfo {
        startCursor
        endCursor
        hasPreviousPage
        hasNextPage
        count
      }
    }
  }
`

/**
 * __useGetDatasetsQuery__
 *
 * To run a query within a React component, call `useGetDatasetsQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetDatasetsQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetDatasetsQuery({
 *   variables: {
 *      cursor: // value for 'cursor'
 *      orderBy: // value for 'orderBy'
 *      filterBy: // value for 'filterBy'
 *      myDatasets: // value for 'myDatasets'
 *   },
 * });
 */
export function useGetDatasetsQuery(
  baseOptions?: Apollo.QueryHookOptions<
    GetDatasetsQuery,
    GetDatasetsQueryVariables
  >,
) {
  const options = { ...defaultOptions, ...baseOptions }
  return Apollo.useQuery<GetDatasetsQuery, GetDatasetsQueryVariables>(
    GetDatasetsDocument,
    options,
  )
}
export function useGetDatasetsLazyQuery(
  baseOptions?: Apollo.LazyQueryHookOptions<
    GetDatasetsQuery,
    GetDatasetsQueryVariables
  >,
) {
  const options = { ...defaultOptions, ...baseOptions }
  return Apollo.useLazyQuery<GetDatasetsQuery, GetDatasetsQueryVariables>(
    GetDatasetsDocument,
    options,
  )
}
export type GetDatasetsQueryHookResult = ReturnType<typeof useGetDatasetsQuery>
export type GetDatasetsLazyQueryHookResult = ReturnType<
  typeof useGetDatasetsLazyQuery
>
export type GetDatasetsQueryResult = Apollo.QueryResult<
  GetDatasetsQuery,
  GetDatasetsQueryVariables
>
export const SearchDatasetsDocument = gql`
  query searchDatasets($q: String!, $cursor: String) {
    searchDatasets(q: $q, first: 25, after: $cursor) {
      edges {
        node {
          id
          created
          uploader {
            id
            name
          }
          public
          permissions {
            id
            userPermissions {
              userId
              level
              access: level
              user {
                id
                name
                email
                provider
              }
            }
          }
          draft {
            id
            summary {
              modalities
              sessions
              subjects
              subjectMetadata {
                participantId
                age
                sex
                group
              }
              tasks
              size
              totalFiles
              dataProcessed
            }
            issues {
              severity
            }
            description {
              Name
            }
          }
          analytics {
            views
            downloads
          }
          stars {
            userId
            datasetId
          }
          followers {
            userId
            datasetId
          }
          snapshots {
            id
            created
            tag
          }
        }
      }
      pageInfo {
        startCursor
        endCursor
        hasPreviousPage
        hasNextPage
        count
      }
    }
  }
`

/**
 * __useSearchDatasetsQuery__
 *
 * To run a query within a React component, call `useSearchDatasetsQuery` and pass it any options that fit your needs.
 * When your component renders, `useSearchDatasetsQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useSearchDatasetsQuery({
 *   variables: {
 *      q: // value for 'q'
 *      cursor: // value for 'cursor'
 *   },
 * });
 */
export function useSearchDatasetsQuery(
  baseOptions: Apollo.QueryHookOptions<
    SearchDatasetsQuery,
    SearchDatasetsQueryVariables
  >,
) {
  const options = { ...defaultOptions, ...baseOptions }
  return Apollo.useQuery<SearchDatasetsQuery, SearchDatasetsQueryVariables>(
    SearchDatasetsDocument,
    options,
  )
}
export function useSearchDatasetsLazyQuery(
  baseOptions?: Apollo.LazyQueryHookOptions<
    SearchDatasetsQuery,
    SearchDatasetsQueryVariables
  >,
) {
  const options = { ...defaultOptions, ...baseOptions }
  return Apollo.useLazyQuery<SearchDatasetsQuery, SearchDatasetsQueryVariables>(
    SearchDatasetsDocument,
    options,
  )
}
export type SearchDatasetsQueryHookResult = ReturnType<
  typeof useSearchDatasetsQuery
>
export type SearchDatasetsLazyQueryHookResult = ReturnType<
  typeof useSearchDatasetsLazyQuery
>
export type SearchDatasetsQueryResult = Apollo.QueryResult<
  SearchDatasetsQuery,
  SearchDatasetsQueryVariables
>
export const GetDatasetIssuesDocument = gql`
  query getDatasetIssues($datasetId: ID!) {
    dataset(id: $datasetId) {
      id
      draft {
        id
        issues {
          severity
          code
          reason
          files {
            evidence
            line
            character
            reason
            file {
              name
              path
              relativePath
            }
          }
          additionalFileCount
        }
      }
    }
  }
`

/**
 * __useGetDatasetIssuesQuery__
 *
 * To run a query within a React component, call `useGetDatasetIssuesQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetDatasetIssuesQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetDatasetIssuesQuery({
 *   variables: {
 *      datasetId: // value for 'datasetId'
 *   },
 * });
 */
export function useGetDatasetIssuesQuery(
  baseOptions: Apollo.QueryHookOptions<
    GetDatasetIssuesQuery,
    GetDatasetIssuesQueryVariables
  >,
) {
  const options = { ...defaultOptions, ...baseOptions }
  return Apollo.useQuery<GetDatasetIssuesQuery, GetDatasetIssuesQueryVariables>(
    GetDatasetIssuesDocument,
    options,
  )
}
export function useGetDatasetIssuesLazyQuery(
  baseOptions?: Apollo.LazyQueryHookOptions<
    GetDatasetIssuesQuery,
    GetDatasetIssuesQueryVariables
  >,
) {
  const options = { ...defaultOptions, ...baseOptions }
  return Apollo.useLazyQuery<
    GetDatasetIssuesQuery,
    GetDatasetIssuesQueryVariables
  >(GetDatasetIssuesDocument, options)
}
export type GetDatasetIssuesQueryHookResult = ReturnType<
  typeof useGetDatasetIssuesQuery
>
export type GetDatasetIssuesLazyQueryHookResult = ReturnType<
  typeof useGetDatasetIssuesLazyQuery
>
export type GetDatasetIssuesQueryResult = Apollo.QueryResult<
  GetDatasetIssuesQuery,
  GetDatasetIssuesQueryVariables
>
export const CreateDatasetDocument = gql`
  mutation createDataset($affirmedDefaced: Boolean, $affirmedConsent: Boolean) {
    createDataset(
      affirmedDefaced: $affirmedDefaced
      affirmedConsent: $affirmedConsent
    ) {
      id
      worker
    }
  }
`
export type CreateDatasetMutationFn = Apollo.MutationFunction<
  CreateDatasetMutation,
  CreateDatasetMutationVariables
>

/**
 * __useCreateDatasetMutation__
 *
 * To run a mutation, you first call `useCreateDatasetMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useCreateDatasetMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [createDatasetMutation, { data, loading, error }] = useCreateDatasetMutation({
 *   variables: {
 *      affirmedDefaced: // value for 'affirmedDefaced'
 *      affirmedConsent: // value for 'affirmedConsent'
 *   },
 * });
 */
export function useCreateDatasetMutation(
  baseOptions?: Apollo.MutationHookOptions<
    CreateDatasetMutation,
    CreateDatasetMutationVariables
  >,
) {
  const options = { ...defaultOptions, ...baseOptions }
  return Apollo.useMutation<
    CreateDatasetMutation,
    CreateDatasetMutationVariables
  >(CreateDatasetDocument, options)
}
export type CreateDatasetMutationHookResult = ReturnType<
  typeof useCreateDatasetMutation
>
export type CreateDatasetMutationResult =
  Apollo.MutationResult<CreateDatasetMutation>
export type CreateDatasetMutationOptions = Apollo.BaseMutationOptions<
  CreateDatasetMutation,
  CreateDatasetMutationVariables
>
export const DeleteSnapshotDocument = gql`
  mutation deleteSnapshot($datasetId: ID!, $tag: String!) {
    deleteSnapshot(datasetId: $datasetId, tag: $tag)
  }
`
export type DeleteSnapshotMutationFn = Apollo.MutationFunction<
  DeleteSnapshotMutation,
  DeleteSnapshotMutationVariables
>

/**
 * __useDeleteSnapshotMutation__
 *
 * To run a mutation, you first call `useDeleteSnapshotMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useDeleteSnapshotMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [deleteSnapshotMutation, { data, loading, error }] = useDeleteSnapshotMutation({
 *   variables: {
 *      datasetId: // value for 'datasetId'
 *      tag: // value for 'tag'
 *   },
 * });
 */
export function useDeleteSnapshotMutation(
  baseOptions?: Apollo.MutationHookOptions<
    DeleteSnapshotMutation,
    DeleteSnapshotMutationVariables
  >,
) {
  const options = { ...defaultOptions, ...baseOptions }
  return Apollo.useMutation<
    DeleteSnapshotMutation,
    DeleteSnapshotMutationVariables
  >(DeleteSnapshotDocument, options)
}
export type DeleteSnapshotMutationHookResult = ReturnType<
  typeof useDeleteSnapshotMutation
>
export type DeleteSnapshotMutationResult =
  Apollo.MutationResult<DeleteSnapshotMutation>
export type DeleteSnapshotMutationOptions = Apollo.BaseMutationOptions<
  DeleteSnapshotMutation,
  DeleteSnapshotMutationVariables
>
export const UpdatePublicDocument = gql`
  mutation updatePublic($id: ID!, $publicFlag: Boolean!) {
    updatePublic(datasetId: $id, publicFlag: $publicFlag)
  }
`
export type UpdatePublicMutationFn = Apollo.MutationFunction<
  UpdatePublicMutation,
  UpdatePublicMutationVariables
>

/**
 * __useUpdatePublicMutation__
 *
 * To run a mutation, you first call `useUpdatePublicMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useUpdatePublicMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [updatePublicMutation, { data, loading, error }] = useUpdatePublicMutation({
 *   variables: {
 *      id: // value for 'id'
 *      publicFlag: // value for 'publicFlag'
 *   },
 * });
 */
export function useUpdatePublicMutation(
  baseOptions?: Apollo.MutationHookOptions<
    UpdatePublicMutation,
    UpdatePublicMutationVariables
  >,
) {
  const options = { ...defaultOptions, ...baseOptions }
  return Apollo.useMutation<
    UpdatePublicMutation,
    UpdatePublicMutationVariables
  >(UpdatePublicDocument, options)
}
export type UpdatePublicMutationHookResult = ReturnType<
  typeof useUpdatePublicMutation
>
export type UpdatePublicMutationResult =
  Apollo.MutationResult<UpdatePublicMutation>
export type UpdatePublicMutationOptions = Apollo.BaseMutationOptions<
  UpdatePublicMutation,
  UpdatePublicMutationVariables
>
export const UpdatePermissionsDocument = gql`
  mutation updatePermissions(
    $datasetId: ID!
    $userEmail: String!
    $level: String
  ) {
    updatePermissions(
      datasetId: $datasetId
      userEmail: $userEmail
      level: $level
    ) {
      id
      email
    }
  }
`
export type UpdatePermissionsMutationFn = Apollo.MutationFunction<
  UpdatePermissionsMutation,
  UpdatePermissionsMutationVariables
>

/**
 * __useUpdatePermissionsMutation__
 *
 * To run a mutation, you first call `useUpdatePermissionsMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useUpdatePermissionsMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [updatePermissionsMutation, { data, loading, error }] = useUpdatePermissionsMutation({
 *   variables: {
 *      datasetId: // value for 'datasetId'
 *      userEmail: // value for 'userEmail'
 *      level: // value for 'level'
 *   },
 * });
 */
export function useUpdatePermissionsMutation(
  baseOptions?: Apollo.MutationHookOptions<
    UpdatePermissionsMutation,
    UpdatePermissionsMutationVariables
  >,
) {
  const options = { ...defaultOptions, ...baseOptions }
  return Apollo.useMutation<
    UpdatePermissionsMutation,
    UpdatePermissionsMutationVariables
  >(UpdatePermissionsDocument, options)
}
export type UpdatePermissionsMutationHookResult = ReturnType<
  typeof useUpdatePermissionsMutation
>
export type UpdatePermissionsMutationResult =
  Apollo.MutationResult<UpdatePermissionsMutation>
export type UpdatePermissionsMutationOptions = Apollo.BaseMutationOptions<
  UpdatePermissionsMutation,
  UpdatePermissionsMutationVariables
>
export const TrackAnalyticsDocument = gql`
  mutation trackAnalytics(
    $datasetId: ID!
    $tag: String
    $type: AnalyticTypes!
  ) {
    trackAnalytics(datasetId: $datasetId, tag: $tag, type: $type)
  }
`
export type TrackAnalyticsMutationFn = Apollo.MutationFunction<
  TrackAnalyticsMutation,
  TrackAnalyticsMutationVariables
>

/**
 * __useTrackAnalyticsMutation__
 *
 * To run a mutation, you first call `useTrackAnalyticsMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useTrackAnalyticsMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [trackAnalyticsMutation, { data, loading, error }] = useTrackAnalyticsMutation({
 *   variables: {
 *      datasetId: // value for 'datasetId'
 *      tag: // value for 'tag'
 *      type: // value for 'type'
 *   },
 * });
 */
export function useTrackAnalyticsMutation(
  baseOptions?: Apollo.MutationHookOptions<
    TrackAnalyticsMutation,
    TrackAnalyticsMutationVariables
  >,
) {
  const options = { ...defaultOptions, ...baseOptions }
  return Apollo.useMutation<
    TrackAnalyticsMutation,
    TrackAnalyticsMutationVariables
  >(TrackAnalyticsDocument, options)
}
export type TrackAnalyticsMutationHookResult = ReturnType<
  typeof useTrackAnalyticsMutation
>
export type TrackAnalyticsMutationResult =
  Apollo.MutationResult<TrackAnalyticsMutation>
export type TrackAnalyticsMutationOptions = Apollo.BaseMutationOptions<
  TrackAnalyticsMutation,
  TrackAnalyticsMutationVariables
>
export const DownloadDatasetDocument = gql`
  query downloadDataset($datasetId: ID!) {
    dataset(id: $datasetId) {
      id
      draft {
        id
        files(prefix: null) {
          id
          filename
          size
          urls
        }
      }
    }
  }
`

/**
 * __useDownloadDatasetQuery__
 *
 * To run a query within a React component, call `useDownloadDatasetQuery` and pass it any options that fit your needs.
 * When your component renders, `useDownloadDatasetQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useDownloadDatasetQuery({
 *   variables: {
 *      datasetId: // value for 'datasetId'
 *   },
 * });
 */
export function useDownloadDatasetQuery(
  baseOptions: Apollo.QueryHookOptions<
    DownloadDatasetQuery,
    DownloadDatasetQueryVariables
  >,
) {
  const options = { ...defaultOptions, ...baseOptions }
  return Apollo.useQuery<DownloadDatasetQuery, DownloadDatasetQueryVariables>(
    DownloadDatasetDocument,
    options,
  )
}
export function useDownloadDatasetLazyQuery(
  baseOptions?: Apollo.LazyQueryHookOptions<
    DownloadDatasetQuery,
    DownloadDatasetQueryVariables
  >,
) {
  const options = { ...defaultOptions, ...baseOptions }
  return Apollo.useLazyQuery<
    DownloadDatasetQuery,
    DownloadDatasetQueryVariables
  >(DownloadDatasetDocument, options)
}
export type DownloadDatasetQueryHookResult = ReturnType<
  typeof useDownloadDatasetQuery
>
export type DownloadDatasetLazyQueryHookResult = ReturnType<
  typeof useDownloadDatasetLazyQuery
>
export type DownloadDatasetQueryResult = Apollo.QueryResult<
  DownloadDatasetQuery,
  DownloadDatasetQueryVariables
>
export const DownloadSnapshotDocument = gql`
  query downloadSnapshot($datasetId: ID!, $tag: String!) {
    snapshot(datasetId: $datasetId, tag: $tag) {
      id
      files(prefix: null) {
        id
        filename
        size
        urls
      }
    }
  }
`

/**
 * __useDownloadSnapshotQuery__
 *
 * To run a query within a React component, call `useDownloadSnapshotQuery` and pass it any options that fit your needs.
 * When your component renders, `useDownloadSnapshotQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useDownloadSnapshotQuery({
 *   variables: {
 *      datasetId: // value for 'datasetId'
 *      tag: // value for 'tag'
 *   },
 * });
 */
export function useDownloadSnapshotQuery(
  baseOptions: Apollo.QueryHookOptions<
    DownloadSnapshotQuery,
    DownloadSnapshotQueryVariables
  >,
) {
  const options = { ...defaultOptions, ...baseOptions }
  return Apollo.useQuery<DownloadSnapshotQuery, DownloadSnapshotQueryVariables>(
    DownloadSnapshotDocument,
    options,
  )
}
export function useDownloadSnapshotLazyQuery(
  baseOptions?: Apollo.LazyQueryHookOptions<
    DownloadSnapshotQuery,
    DownloadSnapshotQueryVariables
  >,
) {
  const options = { ...defaultOptions, ...baseOptions }
  return Apollo.useLazyQuery<
    DownloadSnapshotQuery,
    DownloadSnapshotQueryVariables
  >(DownloadSnapshotDocument, options)
}
export type DownloadSnapshotQueryHookResult = ReturnType<
  typeof useDownloadSnapshotQuery
>
export type DownloadSnapshotLazyQueryHookResult = ReturnType<
  typeof useDownloadSnapshotLazyQuery
>
export type DownloadSnapshotQueryResult = Apollo.QueryResult<
  DownloadSnapshotQuery,
  DownloadSnapshotQueryVariables
>
export const DeleteFilesDocument = gql`
  mutation deleteFiles($datasetId: ID!, $files: [DeleteFile]!) {
    deleteFiles(datasetId: $datasetId, files: $files)
  }
`
export type DeleteFilesMutationFn = Apollo.MutationFunction<
  DeleteFilesMutation,
  DeleteFilesMutationVariables
>

/**
 * __useDeleteFilesMutation__
 *
 * To run a mutation, you first call `useDeleteFilesMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useDeleteFilesMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [deleteFilesMutation, { data, loading, error }] = useDeleteFilesMutation({
 *   variables: {
 *      datasetId: // value for 'datasetId'
 *      files: // value for 'files'
 *   },
 * });
 */
export function useDeleteFilesMutation(
  baseOptions?: Apollo.MutationHookOptions<
    DeleteFilesMutation,
    DeleteFilesMutationVariables
  >,
) {
  const options = { ...defaultOptions, ...baseOptions }
  return Apollo.useMutation<DeleteFilesMutation, DeleteFilesMutationVariables>(
    DeleteFilesDocument,
    options,
  )
}
export type DeleteFilesMutationHookResult = ReturnType<
  typeof useDeleteFilesMutation
>
export type DeleteFilesMutationResult =
  Apollo.MutationResult<DeleteFilesMutation>
export type DeleteFilesMutationOptions = Apollo.BaseMutationOptions<
  DeleteFilesMutation,
  DeleteFilesMutationVariables
>
export const CreateSnapshotDocument = gql`
  mutation createSnapshot($datasetId: ID!, $tag: String!, $changes: [String!]) {
    createSnapshot(datasetId: $datasetId, tag: $tag, changes: $changes) {
      id
      tag
    }
  }
`
export type CreateSnapshotMutationFn = Apollo.MutationFunction<
  CreateSnapshotMutation,
  CreateSnapshotMutationVariables
>

/**
 * __useCreateSnapshotMutation__
 *
 * To run a mutation, you first call `useCreateSnapshotMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useCreateSnapshotMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [createSnapshotMutation, { data, loading, error }] = useCreateSnapshotMutation({
 *   variables: {
 *      datasetId: // value for 'datasetId'
 *      tag: // value for 'tag'
 *      changes: // value for 'changes'
 *   },
 * });
 */
export function useCreateSnapshotMutation(
  baseOptions?: Apollo.MutationHookOptions<
    CreateSnapshotMutation,
    CreateSnapshotMutationVariables
  >,
) {
  const options = { ...defaultOptions, ...baseOptions }
  return Apollo.useMutation<
    CreateSnapshotMutation,
    CreateSnapshotMutationVariables
  >(CreateSnapshotDocument, options)
}
export type CreateSnapshotMutationHookResult = ReturnType<
  typeof useCreateSnapshotMutation
>
export type CreateSnapshotMutationResult =
  Apollo.MutationResult<CreateSnapshotMutation>
export type CreateSnapshotMutationOptions = Apollo.BaseMutationOptions<
  CreateSnapshotMutation,
  CreateSnapshotMutationVariables
>
export const GetSnapshotDocument = gql`
  query getSnapshot($datasetId: ID!, $tag: String!) {
    snapshot(datasetId: $datasetId, tag: $tag) {
      id
      _id: id
      tag
      created
      description {
        Name
      }
      summary {
        size
        totalFiles
      }
      files {
        id
        _id: id
        name: filename
        filename
        size
      }
      analytics {
        views
        downloads
      }
    }
  }
`

/**
 * __useGetSnapshotQuery__
 *
 * To run a query within a React component, call `useGetSnapshotQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetSnapshotQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetSnapshotQuery({
 *   variables: {
 *      datasetId: // value for 'datasetId'
 *      tag: // value for 'tag'
 *   },
 * });
 */
export function useGetSnapshotQuery(
  baseOptions: Apollo.QueryHookOptions<
    GetSnapshotQuery,
    GetSnapshotQueryVariables
  >,
) {
  const options = { ...defaultOptions, ...baseOptions }
  return Apollo.useQuery<GetSnapshotQuery, GetSnapshotQueryVariables>(
    GetSnapshotDocument,
    options,
  )
}
export function useGetSnapshotLazyQuery(
  baseOptions?: Apollo.LazyQueryHookOptions<
    GetSnapshotQuery,
    GetSnapshotQueryVariables
  >,
) {
  const options = { ...defaultOptions, ...baseOptions }
  return Apollo.useLazyQuery<GetSnapshotQuery, GetSnapshotQueryVariables>(
    GetSnapshotDocument,
    options,
  )
}
export type GetSnapshotQueryHookResult = ReturnType<typeof useGetSnapshotQuery>
export type GetSnapshotLazyQueryHookResult = ReturnType<
  typeof useGetSnapshotLazyQuery
>
export type GetSnapshotQueryResult = Apollo.QueryResult<
  GetSnapshotQuery,
  GetSnapshotQueryVariables
>
export const PrepareUploadDocument = gql`
  mutation prepareUpload($datasetId: ID!, $uploadId: ID!) {
    prepareUpload(datasetId: $datasetId, uploadId: $uploadId) {
      id
      datasetId
      token
      endpoint
    }
  }
`
export type PrepareUploadMutationFn = Apollo.MutationFunction<
  PrepareUploadMutation,
  PrepareUploadMutationVariables
>

/**
 * __usePrepareUploadMutation__
 *
 * To run a mutation, you first call `usePrepareUploadMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `usePrepareUploadMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [prepareUploadMutation, { data, loading, error }] = usePrepareUploadMutation({
 *   variables: {
 *      datasetId: // value for 'datasetId'
 *      uploadId: // value for 'uploadId'
 *   },
 * });
 */
export function usePrepareUploadMutation(
  baseOptions?: Apollo.MutationHookOptions<
    PrepareUploadMutation,
    PrepareUploadMutationVariables
  >,
) {
  const options = { ...defaultOptions, ...baseOptions }
  return Apollo.useMutation<
    PrepareUploadMutation,
    PrepareUploadMutationVariables
  >(PrepareUploadDocument, options)
}
export type PrepareUploadMutationHookResult = ReturnType<
  typeof usePrepareUploadMutation
>
export type PrepareUploadMutationResult =
  Apollo.MutationResult<PrepareUploadMutation>
export type PrepareUploadMutationOptions = Apollo.BaseMutationOptions<
  PrepareUploadMutation,
  PrepareUploadMutationVariables
>
export const FinishUploadDocument = gql`
  mutation finishUpload($uploadId: ID!) {
    finishUpload(uploadId: $uploadId)
  }
`
export type FinishUploadMutationFn = Apollo.MutationFunction<
  FinishUploadMutation,
  FinishUploadMutationVariables
>

/**
 * __useFinishUploadMutation__
 *
 * To run a mutation, you first call `useFinishUploadMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useFinishUploadMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [finishUploadMutation, { data, loading, error }] = useFinishUploadMutation({
 *   variables: {
 *      uploadId: // value for 'uploadId'
 *   },
 * });
 */
export function useFinishUploadMutation(
  baseOptions?: Apollo.MutationHookOptions<
    FinishUploadMutation,
    FinishUploadMutationVariables
  >,
) {
  const options = { ...defaultOptions, ...baseOptions }
  return Apollo.useMutation<
    FinishUploadMutation,
    FinishUploadMutationVariables
  >(FinishUploadDocument, options)
}
export type FinishUploadMutationHookResult = ReturnType<
  typeof useFinishUploadMutation
>
export type FinishUploadMutationResult =
  Apollo.MutationResult<FinishUploadMutation>
export type FinishUploadMutationOptions = Apollo.BaseMutationOptions<
  FinishUploadMutation,
  FinishUploadMutationVariables
>
export const GetUsersDocument = gql`
  query getUsers {
    users {
      id
      _id: id
      name
      email
      provider
      admin
      created
      lastSeen
    }
  }
`

/**
 * __useGetUsersQuery__
 *
 * To run a query within a React component, call `useGetUsersQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetUsersQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetUsersQuery({
 *   variables: {
 *   },
 * });
 */
export function useGetUsersQuery(
  baseOptions?: Apollo.QueryHookOptions<GetUsersQuery, GetUsersQueryVariables>,
) {
  const options = { ...defaultOptions, ...baseOptions }
  return Apollo.useQuery<GetUsersQuery, GetUsersQueryVariables>(
    GetUsersDocument,
    options,
  )
}
export function useGetUsersLazyQuery(
  baseOptions?: Apollo.LazyQueryHookOptions<
    GetUsersQuery,
    GetUsersQueryVariables
  >,
) {
  const options = { ...defaultOptions, ...baseOptions }
  return Apollo.useLazyQuery<GetUsersQuery, GetUsersQueryVariables>(
    GetUsersDocument,
    options,
  )
}
export type GetUsersQueryHookResult = ReturnType<typeof useGetUsersQuery>
export type GetUsersLazyQueryHookResult = ReturnType<
  typeof useGetUsersLazyQuery
>
export type GetUsersQueryResult = Apollo.QueryResult<
  GetUsersQuery,
  GetUsersQueryVariables
>
export const RemoveUserDocument = gql`
  mutation removeUser($id: ID!) {
    removeUser(id: $id)
  }
`
export type RemoveUserMutationFn = Apollo.MutationFunction<
  RemoveUserMutation,
  RemoveUserMutationVariables
>

/**
 * __useRemoveUserMutation__
 *
 * To run a mutation, you first call `useRemoveUserMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useRemoveUserMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [removeUserMutation, { data, loading, error }] = useRemoveUserMutation({
 *   variables: {
 *      id: // value for 'id'
 *   },
 * });
 */
export function useRemoveUserMutation(
  baseOptions?: Apollo.MutationHookOptions<
    RemoveUserMutation,
    RemoveUserMutationVariables
  >,
) {
  const options = { ...defaultOptions, ...baseOptions }
  return Apollo.useMutation<RemoveUserMutation, RemoveUserMutationVariables>(
    RemoveUserDocument,
    options,
  )
}
export type RemoveUserMutationHookResult = ReturnType<
  typeof useRemoveUserMutation
>
export type RemoveUserMutationResult = Apollo.MutationResult<RemoveUserMutation>
export type RemoveUserMutationOptions = Apollo.BaseMutationOptions<
  RemoveUserMutation,
  RemoveUserMutationVariables
>
export const SetAdminDocument = gql`
  mutation setAdmin($id: ID!, $admin: Boolean!) {
    setAdmin(id: $id, admin: $admin) {
      id
    }
  }
`
export type SetAdminMutationFn = Apollo.MutationFunction<
  SetAdminMutation,
  SetAdminMutationVariables
>

/**
 * __useSetAdminMutation__
 *
 * To run a mutation, you first call `useSetAdminMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useSetAdminMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [setAdminMutation, { data, loading, error }] = useSetAdminMutation({
 *   variables: {
 *      id: // value for 'id'
 *      admin: // value for 'admin'
 *   },
 * });
 */
export function useSetAdminMutation(
  baseOptions?: Apollo.MutationHookOptions<
    SetAdminMutation,
    SetAdminMutationVariables
  >,
) {
  const options = { ...defaultOptions, ...baseOptions }
  return Apollo.useMutation<SetAdminMutation, SetAdminMutationVariables>(
    SetAdminDocument,
    options,
  )
}
export type SetAdminMutationHookResult = ReturnType<typeof useSetAdminMutation>
export type SetAdminMutationResult = Apollo.MutationResult<SetAdminMutation>
export type SetAdminMutationOptions = Apollo.BaseMutationOptions<
  SetAdminMutation,
  SetAdminMutationVariables
>
export const GetIndexDocument = gql`
  query getIndex(
    $cursor: String
    $orderBy: DatasetSort = { created: descending }
    $filterBy: DatasetFilter = { public: true }
  ) {
    datasets(first: 5, after: $cursor, orderBy: $orderBy, filterBy: $filterBy) {
      edges {
        node {
          id
          created
          metadata {
            dxStatus
            trialCount
            studyDesign
            studyDomain
            studyLongitudinal
            dataProcessed
            species
            associatedPaperDOI
            openneuroPaperDOI
            seniorAuthor
            grantFunderName
            grantIdentifier
          }
          latestSnapshot {
            id
            tag
            description {
              Name
              Authors
            }
            summary {
              tasks
              modalities
              subjectMetadata {
                participantId
                group
                sex
                age
              }
            }
            readme
          }
        }
      }
      pageInfo {
        endCursor
        hasNextPage
        count
      }
    }
  }
`

/**
 * __useGetIndexQuery__
 *
 * To run a query within a React component, call `useGetIndexQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetIndexQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetIndexQuery({
 *   variables: {
 *      cursor: // value for 'cursor'
 *      orderBy: // value for 'orderBy'
 *      filterBy: // value for 'filterBy'
 *   },
 * });
 */
export function useGetIndexQuery(
  baseOptions?: Apollo.QueryHookOptions<GetIndexQuery, GetIndexQueryVariables>,
) {
  const options = { ...defaultOptions, ...baseOptions }
  return Apollo.useQuery<GetIndexQuery, GetIndexQueryVariables>(
    GetIndexDocument,
    options,
  )
}
export function useGetIndexLazyQuery(
  baseOptions?: Apollo.LazyQueryHookOptions<
    GetIndexQuery,
    GetIndexQueryVariables
  >,
) {
  const options = { ...defaultOptions, ...baseOptions }
  return Apollo.useLazyQuery<GetIndexQuery, GetIndexQueryVariables>(
    GetIndexDocument,
    options,
  )
}
export type GetIndexQueryHookResult = ReturnType<typeof useGetIndexQuery>
export type GetIndexLazyQueryHookResult = ReturnType<
  typeof useGetIndexLazyQuery
>
export type GetIndexQueryResult = Apollo.QueryResult<
  GetIndexQuery,
  GetIndexQueryVariables
>

export interface PossibleTypesResultData {
  possibleTypes: {
    [key: string]: string[]
  }
}
const result: PossibleTypesResultData = {
  possibleTypes: {},
}
export default result
