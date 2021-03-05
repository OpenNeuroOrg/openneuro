import { schemaComposer } from 'graphql-compose'
import resolvers from './resolvers'
import Subscription from './resolvers/subscriptions.js'
import datasetSearch from './resolvers/dataset-search'

export const typeDefs = `
  scalar Date
  scalar DateTime
  scalar Time
  scalar BigInt

  enum CacheControlScope {
    PUBLIC
    PRIVATE
  }

  directive @cacheControl(
    maxAge: Int,
    scope: CacheControlScope
  ) on OBJECT | FIELD_DEFINITION

  enum SortOrdering {
    ascending
    descending
  }

  # Sorting order for datasets
  input DatasetSort {
    # Dataset created time
    created: SortOrdering
    # Alphanumeric sort of dataset name
    name: SortOrdering
    # Alphanumeric sort of uploader name
    uploader: SortOrdering
    # Order by star count
    stars: SortOrdering
    # Order by download count
    downloads: SortOrdering
    # Order by dataset views
    views: SortOrdering
    # Order by count of dataset followers
    subscriptions: SortOrdering
    # Order by publish date
    publishDate: SortOrdering
  }

  # Dataset query filter flags
  input DatasetFilter {
    "Limit to datasets available publicly"
    public: Boolean
    "Return only datasets that are shared with the user"
    shared: Boolean
    "Return only datasets with an invalid Draft"
    invalid: Boolean
    "Return only datasets starred by the query user"
    starred: Boolean
    "Return all datasets, ignores any other constraints but not sorts"
    all: Boolean
  }

  type Query {
    # One dataset
    dataset(id: ID!): Dataset
    # Get all datasets
    datasets(
      "Limit results, default 25, max 100"
      first: Int = 25
      "Cursor key used to fetch later results"
      after: String
      "Cursor key used to fetch earlier results"
      before: String
      "Sorting fields"
      orderBy: DatasetSort = {created: ascending}
      "Filtering fields"
      filterBy: DatasetFilter = {}
      "Query user's datasets only - excludes public datasets from other filters"
      myDatasets: Boolean
    ): DatasetConnection
    # Get one user
    user(id: ID!): User
    # Get a list of users
    users: [User]
    # Get the total number of dataset participants
    participantCount: Int @cacheControl(maxAge: 86400, scope: PUBLIC)
    # Request one snapshot
    snapshot(datasetId: ID!, tag: String!): Snapshot
  }

  type Mutation {
    # Create a new dataset container and repository
    createDataset: Dataset
    # Deletes a dataset and all associated snapshots
    deleteDataset(id: ID!, reason: String, redirect: String): Boolean
    # Tag the current draft
    createSnapshot(datasetId: ID!, tag: String!, changes: [String!]): Snapshot
    # Remove a tag from the dataset
    deleteSnapshot(datasetId: ID!, tag: String!): Boolean!
    # Recursively delete a file or directory in a draft - returns true on success
    deleteFiles(datasetId: ID!, path: String!): Boolean
    # delete one file based on path
    deleteFile(datasetId: ID!, path: String!, filename: String!): Boolean
    # Add or remove the public flag from a dataset
    updatePublic(datasetId: ID!, publicFlag: Boolean!): Boolean!
    # Update a draft summary
    updateSummary(summary: SummaryInput!): Summary
    # Update a draft with validation results
    updateValidation(validation: ValidationInput!): Boolean
    # Update a users's permissions on a dataset
    updatePermissions(datasetId: ID!, userEmail: String!, level: String): User
    # Remove a users's permissions on a dataset
    removePermissions(datasetId: ID!, userId: String!): Boolean
    # Remove a user
    removeUser(id: ID!): Boolean
    # Sets a users admin status
    setAdmin(id: ID!, admin: Boolean!): User
    # Sets a users admin status
    setBlocked(id: ID!, blocked: Boolean!): User
    # Tracks a view or download for a dataset
    trackAnalytics(datasetId: ID!, tag: String, type: AnalyticTypes): Boolean
    # Follow dataset
    followDataset(datasetId: ID!): Boolean
    # Star dataset
    starDataset(datasetId: ID!): Boolean
    # Make a dataset public
    publishDataset(datasetId: ID!): Boolean
    # Update dataset_description.json scalar fields
    updateDescription(datasetId: ID!, field: String!, value: String!): Description
    # Update dataset_description.json list fields
    updateDescriptionList(datasetId: ID!, field: String!, value: [String!]): Description
    # Update dataset README file
    updateReadme(datasetId: ID!, value: String!): Boolean
    # Submits a new comment and returns the comment ID for replies
    addComment(datasetId: ID!, parentId: ID, comment: String!): ID
    # Edits an existing comment
    editComment(commentId: ID!, comment: String!): Boolean
    # Deletes an existing comment (deleteChildren defaults to false). Returns the ids of all deleted comments.
    deleteComment(commentId: ID!, deleteChildren: Boolean): [String]
    # Subscribes user to newsletter
    subscribeToNewsletter(email: String!): Boolean
    # Upserts dataset metadata
    addMetadata(datasetId: ID!, metadata: MetadataInput!): Metadata
    # Update draft reference pointer
    updateRef(datasetId: ID!, ref: String!): Boolean
    # Start an upload
    prepareUpload(datasetId: ID!, uploadId: ID!): UploadMetadata
    # Add files from a completed upload to the dataset draft
    finishUpload(uploadId: ID!): Boolean
    # Drop caches for a given dataset - requires site admin access
    cacheClear(datasetId: ID!): Boolean
    # Rerun the latest validator on a given commit
    revalidate(datasetId: ID!, ref: String!): Boolean
    # Request a temporary token for git access
    prepareRepoAccess(datasetId: ID!): RepoMetadata
    # Rerun remote exports
    reexportRemotes(datasetId: ID!): Boolean
    # Reset draft commit
    resetDraft(datasetId: ID!, ref: String!): Boolean
  }

  input UploadFile {
    filename: String!
    size: BigInt!
  }

  input SummaryInput {
    id: ID! # Git reference for this summary
    datasetId: ID!
    modalities: [String]
    sessions: [String]
    subjects: [String]
    subjectMetadata: [SubjectMetadataInput]
    tasks: [String]
    size: BigInt!
    totalFiles: Int!
    dataProcessed: Boolean
  }

  input SubjectMetadataInput {
    participantId: String!
    age: Int
    sex: String
    group: String
  }

  input ValidationInput {
    id: ID! # Git reference for this validation
    datasetId: ID!
    issues: [ValidationIssueInput]!
  }

  # Dataset Metadata
  input MetadataInput {
    datasetId: ID!
    datasetUrl: String
    datasetName: String
    firstSnapshotCreatedAt: DateTime
    latestSnapshotCreatedAt: DateTime
    dxStatus: String
    tasksCompleted: [String]
    trialCount: Int
    studyDesign: String
    studyDomain: String
    studyLongitudinal: String
    dataProcessed: Boolean
    species: String
    associatedPaperDOI: String
    openneuroPaperDOI: String
    seniorAuthor: String
    adminUsers: [String]
    ages: [Int]
    modalities: [String]
    grantFunderName: String
    grantIdentifier: String
    affirmedDefaced: Boolean
    affirmedConsent: Boolean
  }

  # Validation updated message
  type ValidationUpdate {
    id: ID!
    datasetId: ID!
    issues: [ValidationIssue]
  }

  # Information for pagination in a connection.
  type PageInfo {
    # When paginating forwards, are there more items?
    hasNextPage: Boolean!
    # When paginating backwards, are there more items?
    hasPreviousPage: Boolean!
    # When paginating backwards, the cursor to continue.
    startCursor: String
    # When paginating forwards, the cursor to continue.
    endCursor: String
    # Total results
    count: Int
  }

  # OpenNeuro user records from all providers
  type User {
    id: ID!
    provider: UserProvider
    avatar: String
    created: DateTime!
    modified: DateTime
    lastSeen: DateTime
    email: String!
    name: String!
    admin: Boolean
    blocked: Boolean
  }

  # Which provider a user login comes from
  enum UserProvider {
    google
    orcid
    globus
  }

  # Connection for a list of datasets
  type DatasetConnection {
    # A list of dataset edges
    edges: [DatasetEdge]
    # Pagination metadata
    pageInfo: PageInfo!
  }

  # One connected dataset
  type DatasetEdge {
    # Connected dataset
    node: Dataset!
    # Pagination cursor
    cursor: String!
  }

  type DatasetId {
    datasetId: ID
  }

  # Client metadata needed to complete an upload
  type UploadMetadata {
    # Unique identifier for this upload
    id: ID!
    # Dataset associated with this upload
    datasetId: ID!
    # Is this a complete upload (do we allow a resume or not?)
    complete: Boolean!
    # Estimated size in bytes (this is just used for progress display and can be inaccurate)
    estimatedSize: BigInt
    # On the first request, this token is returned to allow uploads into this upload bucket
    token: String
    # An endpoint index used to identify the backend responsible for these files
    endpoint: Int
  }

  # Top level dataset, one draft and many snapshots
  type Dataset {
    id: ID!
    created: DateTime!
    uploader: User
    public: Boolean
    draft: Draft
    snapshots: [Snapshot]
    # Newest snapshot
    latestSnapshot: Snapshot!
    permissions: DatasetPermissions
    analytics: Analytic
    stars: [Star]
    followers: [Follower]
    # Canonical name, latest snapshot or draft if no snapshot or default if neither
    name: String
    # User comments on this dataset
    comments: [Comment]
    # Am I following this dataset?
    following: Boolean
    # Have I starred this dataset?
    starred: Boolean
    # When was this dataset first made public?
    publishDate: DateTime
    # Is the dataset available for analysis on Brainlife?
    onBrainlife: Boolean @cacheControl(maxAge: 10080, scope: PUBLIC)
    # Dataset Metadata
    metadata: Metadata
    # Return the version history for a dataset (git log)
    history: [DatasetCommit]
    # Worker assignment
    worker: String
  }

  type DatasetCommit {
    # Git commit hash
    id: ID!
    # Commit time
    date: DateTime
    # Author string
    authorName: String
    # Author email
    authorEmail: String
    # Commit message
    message: String
    # Associated commit references (tags or branches)
    references: String
  }

  # Ephemeral draft or working tree for a dataset
  type Draft {
    id: ID
    # Which dataset this draft is related to
    dataset: Dataset
    # Last edit timestamp
    modified: DateTime
    # Validator summary
    summary: Summary
    # Validator issues
    issues: [ValidationIssue]
    # Committed files in the working tree
    files(untracked: Boolean, prefix: String = ""): [DatasetFile]
    # dataset_description.json fields
    description: Description
    # Dataset README
    readme: String
    # Uploads in progress or recently completed
    uploads: [UploadMetadata]
    # Git commit hash
    head: String
  }

  # Tagged snapshot of a draft
  type Snapshot @cacheControl(maxAge: 3600, scope: PUBLIC) {
    # Snapshot ids are dataset:tag values
    id: ID!
    # Git tag of this snapshot
    tag: String!
    # The parent dataset for this snapshot
    dataset: Dataset!
    created: DateTime
    # bids-validator summary of this snapshot
    summary: Summary
    # bids-validator issues for this snapshot
    issues: [ValidationIssue]
    # Snapshot files
    files(prefix: String = ""): [DatasetFile]
    # dataset_description.json fields
    description: Description
    # Snapshot usage and download statistics
    analytics: Analytic
    # Dataset README
    readme: String @cacheControl(maxAge: 31536000, scope: PUBLIC)
    # The git hash associated with this snapshot
    hexsha: String
  }

  # Contents of dataset_description.json
  type Description @cacheControl(maxAge: 30, scope: PUBLIC) {
    # Draft id for this description
    id: ID!
    # Name of the dataset
    Name: String!
    # The version of the BIDS standard that was used
    BIDSVersion: String!
    # License for distribution - see BIDS specification (https://bids.neuroimaging.io) appendix II for recommended values
    License: String
    # List of individuals who contributed to the creation/curation of the dataset
    Authors: [String]
    # Text acknowledging contributions of individuals or institutions beyond those listed in Authors or Funding.
    Acknowledgements: String
    # Instructions how researchers using this dataset should acknowledge the original authors. This field can also be used to define a publication that should be cited in publications that use the dataset.
    HowToAcknowledge: String
    # List of sources of funding (grant numbers)
    Funding: [String]
    # List of references to publication that contain information on the dataset, or links
    ReferencesAndLinks: [String]
    # The Document Object Identifier of the dataset (not the corresponding paper).
    DatasetDOI: String
    # List of ethics committee approvals of the research protocols and/or protocol identifiers.
    EthicsApprovals: [String]
  }

  # User permissions on a dataset
  type Permission {
    datasetId: ID!
    userId: String!
    level: String!
    user: User
  }

  # Fundamentally an array of permissions tied to an id
  #   for better cache control
  type DatasetPermissions {
    id: ID!
    userPermissions: [Permission]
  }

  # Authors of a dataset
  type Author {
    ORCID: String
    name: String
  }

  # Validator summary from bids-validator
  type Summary {
    id: ID!
    modalities: [String]
    sessions: [String]
    subjects: [String]
    subjectMetadata: [SubjectMetadata]
    tasks: [String]
    size: BigInt!
    totalFiles: Int!
    dataProcessed: Boolean
  }

  type SubjectMetadata {
    participantId: String!
    age: Int
    sex: String
    group: String
  }

  # Dataset Followers
  type Follower {
    userId: String
    datasetId: String
  }

  # Dataset Stars
  type Star @cacheControl(maxAge: 300, scope: PUBLIC) {
    userId: String
    datasetId: String
  }

  enum Severity {
    error
    warning
  }

  type ValidationIssue {
    severity: Severity!
    key: String!
    code: Int!
    reason: String!
    files: [ValidationIssueFile]
    additionalFileCount: Int
    helpUrl: String
  }

  input ValidationIssueInput {
    severity: Severity!
    key: String!
    code: Int!
    reason: String!
    files: [ValidationIssueFileInput]
    additionalFileCount: Int
    helpUrl: String
  }

  type ValidationIssueFile {
    key: String!
    code: Int!
    file: ValidationIssueFileDetail
    evidence: String
    line: Int
    character: Int
    severity: Severity!
    reason: String
    helpUrl: String
  }

  input ValidationIssueFileInput {
    key: String!
    code: Int!
    file: ValidationIssueFileDetailInput
    evidence: String
    line: Int
    character: Int
    severity: Severity!
    reason: String
    helpUrl: String
  }

  type ValidationIssueFileDetail {
    name: String
    path: String
    relativePath: String
  }

  input ValidationIssueFileDetailInput {
    name: String
    path: String
    relativePath: String
    webkitRelativePath: String
  }

  # File metadata and link to contents
  type DatasetFile {
    id: ID!
    filename: String!
    size: BigInt
    urls: [String]
    objectpath: String
    # Return a flag if this is a directory which contains more files
    directory: Boolean
  }

  # Update to files
  type FilesUpdate {
    datasetId: String
    action: String
    payload: [DatasetFile]
  }

  # Analytics for a dataset
  type Analytic @cacheControl(maxAge: 300, scope: PUBLIC) {
    datasetId: ID!
    tag: String
    views: Int
    downloads: Int
  }

  type Comment {
    id: ID!
    # Comment draft.js body
    text: String!
    # User posting the comment
    user: User
    # Comment creation time
    createDate: DateTime!
    # Any comment this is a reply to
    parent: Comment
    # Any replies to this comment
    replies: [Comment]
  }

  # Types of analytics
  enum AnalyticTypes {
    downloads
    views
  }

  # Dataset Metadata
  type Metadata {
    datasetId: ID!
    datasetUrl: String
    datasetName: String
    firstSnapshotCreatedAt: DateTime
    latestSnapshotCreatedAt: DateTime
    dxStatus: String
    tasksCompleted: [String]
    trialCount: Int
    studyDesign: String
    studyDomain: String
    studyLongitudinal: String
    dataProcessed: Boolean
    species: String
    associatedPaperDOI: String
    openneuroPaperDOI: String
    seniorAuthor: String
    adminUsers: [String]
    ages: [Int]
    modalities: [String]
    grantFunderName: String
    grantIdentifier: String
    affirmedDefaced: Boolean
    affirmedConsent: Boolean
  }

  # Info needed to access git repositories directly
  type RepoMetadata {
    # Temporary token used for HTTPS authentication via git
    token: String
    # An endpoint index used to identify the backend responsible for these files
    endpoint: Int
  }
`

schemaComposer.addTypeDefs(typeDefs)
schemaComposer.addResolveMethods(resolvers)
schemaComposer.Subscription.addFields(Subscription)
schemaComposer.Query.addFields(datasetSearch)

export default schemaComposer.buildSchema()
