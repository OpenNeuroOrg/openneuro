import { schemaComposer } from "graphql-compose"
import resolvers from "./resolvers"
import {
  advancedDatasetSearch,
  datasetSearch,
} from "./resolvers/dataset-search"

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
    maxAge: Int
    scope: CacheControlScope
  ) on OBJECT | FIELD_DEFINITION

  enum SortOrdering {
    ascending
    descending
  }

  # Sorting order for users
  input UserSortInput {
    field: String!
    order: SortOrdering = ascending 
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
      orderBy: DatasetSort = { created: ascending }
      "Filtering fields"
      filterBy: DatasetFilter = {}
      "Query user's datasets only - excludes public datasets from other filters"
      myDatasets: Boolean
      "Query datasets of a specific modality"
      modality: String
    ): DatasetConnection
    # Get one user
    user(id: ID!): User
    # Get a list of users
    users(
      orderBy: [UserSortInput!]
      isAdmin: Boolean
      isBlocked: Boolean
      search: String
      limit: Int 
      offset: Int 
    ): UserList! 
    # Get the total number of dataset participants
    participantCount(modality: String): Int @cacheControl(maxAge: 3600, scope: PUBLIC)
    # Request one snapshot
    snapshot(datasetId: ID!, tag: String!): Snapshot
    # Get annexed files that have been flagged or removed.
    flaggedFiles(
      "Get files that have been flagged, default true."
      flagged: Boolean = true
      "Get files that have already been deleted, default false."
      deleted: Boolean = false
    ): [FlaggedFile]
    # All public dataset metadata
    publicMetadata: [Metadata] @cacheControl(maxAge: 86400, scope: PUBLIC)
    orcidConsent: Boolean
  }

  type Mutation {
    # Create a new dataset container and repository
    createDataset(affirmedDefaced: Boolean, affirmedConsent: Boolean): Dataset
    # Deletes a dataset and all associated snapshots
    deleteDataset(id: ID!, reason: String, redirect: String): Boolean
    # Tag the current draft
    createSnapshot(datasetId: ID!, tag: String!, changes: [String!]): Snapshot
    # Remove a tag from the dataset
    deleteSnapshot(datasetId: ID!, tag: String!): Boolean!
    # removes the annex object of the given file
    removeAnnexObject(datasetId: ID!, snapshot: String!, annexKey: String!, path: String, filename: String): Boolean
    # flags the given file
    flagAnnexObject(datasetId: ID!, snapshot: String!, filepath: String!, annexKey: String!): Boolean
    # Delete files or directories in a draft
    deleteFiles(datasetId: ID!, files: [DeleteFile]): Boolean
    # Add or remove the public flag from a dataset
    updatePublic(datasetId: ID!, publicFlag: Boolean!): Boolean!
    # Update a draft summary
    updateSummary(summary: SummaryInput!): Summary
    # Update a draft with validation results
    updateValidation(validation: ValidatorInput!): Boolean
    # Update a users's permissions on a dataset
    updatePermissions(datasetId: ID!, userEmail: String!, level: String!): DatasetPermissions
    # Update a users's permissions for a given ORCID
    updateOrcidPermissions(datasetId: ID!, userOrcid: String!, level: String!): DatasetPermissions
    # Remove a users's permissions on a dataset
    removePermissions(datasetId: ID!, userId: String!): Boolean
    # Remove a user
    removeUser(id: ID!): Boolean
    # Sets a users admin status
    setAdmin(id: ID!, admin: Boolean!): User
    # Sets a users admin status
    setBlocked(id: ID!, blocked: Boolean!): User
    # Mutation for updating user data
    updateUser(id: ID!, location: String, institution: String, links: [String], orcidConsent: Boolean): User
    # Tracks a view or download for a dataset
    trackAnalytics(datasetId: ID!, tag: String, type: AnalyticTypes): Boolean
    # Follow dataset
    followDataset(datasetId: ID!): FollowDatasetResponse
    # Star dataset
    starDataset(datasetId: ID!): StarDatasetResponse
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
    # Start an upload
    prepareUpload(datasetId: ID!, uploadId: ID!): UploadMetadata
    # Add files from a completed upload to the dataset draft
    finishUpload(uploadId: ID!): Boolean
    # Drop download cache for a snapshot - requires site admin access
    cacheClear(datasetId: ID!, tag: String!): Boolean
    # Rerun the latest validator on a given commit
    revalidate(datasetId: ID!, ref: String!): Boolean
    # Request a temporary token for git access
    prepareRepoAccess(datasetId: ID!): RepoMetadata
    # Rerun remote exports
    reexportRemotes(datasetId: ID!): Boolean
    # Reset draft commit
    resetDraft(datasetId: ID!, ref: String!): Boolean
    # Flag snapshot as deprecated
    deprecateSnapshot(datasetId: ID!, tag: String!, reason: String!): Snapshot
    # Unflag snapshot as deprecated
    undoDeprecateSnapshot(datasetId: ID!, tag: String!): Snapshot
    # Create anonymous read only reviewer
    createReviewer(datasetId: ID!): DatasetReviewer
    # Remove reviewer
    deleteReviewer(datasetId: ID!, id: ID!): DatasetReviewer
    # Add a relationship to an external DOI
    createRelation(datasetId: ID!, doi: String!, relation: RelatedObjectRelation!, kind: RelatedObjectKind!, description: String): Dataset
    # Remove a relationship to an external DOI
    deleteRelation(datasetId: ID!, doi: String!): Dataset
    # Submit an import for a remote dataset, returns id if the URL is accepted for import
    importRemoteDataset(datasetId: ID!, url: String!): ID
    # Finish and notify import is done, returns true if successful
    finishImportRemoteDataset(id: ID!, success: Boolean!, message: String): Boolean
    # Create or update an admin note on a dataset
    saveAdminNote(id: ID, datasetId: ID!, note: String!): DatasetEvent
    # Create a git event log for dataset changes
    createGitEvent(datasetId: ID!, commit: String!, reference: String!): DatasetEvent
    # Create or update a fileCheck document
    updateFileCheck(
      datasetId: ID!
      hexsha: String!
      refs: [String!]!
      annexFsck: [AnnexFsckInput!]!
      remote: String
    ): FileCheck
    # Update worker task queue status
    updateWorkerTask(
      id: ID!,
      args: JSON,
      kwargs: JSON,
      taskName: String,
      worker: String,
      queuedAt: DateTime,
      startedAt: DateTime,
      finishedAt: DateTime,
      error: String,
      executionTime: Int,
    ): WorkerTask
  }

  # Anonymous dataset reviewer
  type DatasetReviewer {
    id: ID!
    # Dataset accession number
    datasetId: ID!
    # Expiration time
    expiration: DateTime
    # Login URL generated (only returned on creation)
    url: String!
  }

  input DeleteFile {
    path: String!
    filename: String
  }

  input UploadFile {
    filename: String!
    size: BigInt!
  }

  input SummaryPetInput {
    BodyPart: [String]
    ScannerManufacturer: [String]
    ScannerManufacturersModelName: [String]
    TracerName: [String]
    TracerRadionuclide: [String]
  }

  # BIDS Validator metadata
  type ValidatorMetadata {
    # Unique string identifying the type of BIDS validator software
    validator: String
    # Semantic versioning string for the version of the validation software
    version: String
  }

  # BIDS Validator metadata
  input ValidatorMetadataInput {
    # Unique string identifying the type of BIDS validator software
    validator: String
    # Semantic versioning string for the version of the validation software
    version: String
  }

  input SummaryInput {
    id: ID! # Git reference for this summary
    datasetId: ID!
    modalities: [String]
    secondaryModalities: [String]
    dataTypes: [String]
    sessions: [String]
    subjects: [String]
    subjectMetadata: [SubjectMetadataInput]
    tasks: [String]
    size: BigInt!
    totalFiles: Int!
    dataProcessed: Boolean
    pet: SummaryPetInput
    # Metadata for validation software used
    validatorMetadata: ValidatorMetadataInput
    # BIDS Specification schema version
    schemaVersion: String
  }

  input SubjectMetadataInput {
    participantId: String!
    age: Int
    sex: String
    group: String
  }

  input ValidatorInput {
    id: ID! # Git reference for this validation
    datasetId: ID!
    issues: [ValidatorIssueInput]!
    codeMessages: [ValidatorCodeMessageInput]!
    validatorMetadata: ValidatorMetadataInput!
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
    orcid: String
    created: DateTime!
    modified: DateTime
    lastSeen: DateTime
    email: String
    name: String
    admin: Boolean
    blocked: Boolean
    location: String
    institution: String
    github: String
    githubSynced: Date
    links: [String]
    orcidConsent: Boolean
  }

  type UserList {
    users: [User!]!
    totalCount: Int!
  }

  # Which provider a user login comes from
  enum UserProvider {
    google
    orcid
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
    # Edge identifier
    id: String!
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
    # Available derivatives of this dataset
    derivatives: [DatasetDerivatives] @cacheControl(maxAge: 3600, scope: PUBLIC)
    # Dataset Metadata
    metadata: Metadata
    # Return the version history for a dataset (git log)
    history: [DatasetCommit]
    # Worker assignment
    worker: String
    # Anonymous reviewers for this dataset
    reviewers: [DatasetReviewer]
    # Dataset belongs to Brain Initiative
    brainInitiative: Boolean
    # Log of events associated with this dataset
    events: [DatasetEvent]
  }

  type DatasetDerivatives {
    # Remote reference to display
    name: String
    # Is this an OpenNeuro derivative?
    local: Boolean
    # S3-like URL if available
    s3Url: String
    # DataLad GitHub URL if available
    dataladUrl: String
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
    # File changes in this commit
    files: [DiffFiles]
    # Files changed
    filesChanged: Int
    # Total number of insertions
    insertions: Int
    # Total number of deletions
    deletions: Int
  }

  type DiffFiles {
    # Status string (A = added, M = modified, D = deleted)
    status: String
    mode: Int
    # Previous path
    old: String
    # New path
    new: String
    binary: Boolean
  }

  type ValidatorCodeMessage {
    code: String!
    message: String!
  }

  # BIDS Validator (schema) issues
  type ValidatorIssue {
    code: String!
    subCode: String
    location: String
    severity: Severity
    rule: String
  }

  type DatasetValidation {
    # Hash of the data validated
    id: String
    datasetId: String
    # Issue objects returned by BIDS validator
    issues: [ValidatorIssue]
    codeMessages: [ValidatorCodeMessage]
    # Count of errors
    errors: Int
    # Count of warnings
    warnings: Int
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
    # Validator issues (legacy validator)
    issues: [ValidationIssue]
    # Validator issues status (legacy validator)
    issuesStatus: ValidationIssueStatus
    # Validator issues (schema validator)
    validation: DatasetValidation
    # Committed files in the working tree
    files(tree: String): [DatasetFile]
    # dataset_description.json fields
    description: Description
    # Dataset README
    readme: String
    # Uploads in progress or recently completed
    uploads: [UploadMetadata]
    # Git commit hash
    head: String
    # Total size in bytes of this draft
    size: BigInt
    # Creators list from datacite.yml || Authors list from dataset_description.json
    creators: [Creator] 
    # File issues
    fileCheck: FileCheck
    # NEW: Contributors list from datacite.yml
    contributors: [Contributor]
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
    # Validator issues (legacy validator)
    issues: [ValidationIssue]
    # Validator issues status (legacy validator)
    issuesStatus: ValidationIssueStatus
    # Validator issues (schema validator)
    validation: DatasetValidation
    # Snapshot files
    files(tree: String): [DatasetFile]
    # dataset_description.json fields
    description: Description
    # Snapshot usage and download statistics
    analytics: Analytic
    # Dataset README
    readme: String @cacheControl(maxAge: 31536000, scope: PUBLIC)
    # The git hash associated with this snapshot
    hexsha: String
    # Whether or not this snapshot has been deprecated (returns null if false)
    deprecated: DeprecatedSnapshot
    # Related DOI references
    related: [RelatedObject]
    # Is the snapshot available for analysis on Brainlife?
    onBrainlife: Boolean @cacheControl(maxAge: 10080, scope: PUBLIC)
    # Total size in bytes of this snapshot
    size: BigInt
    # Single list of files to download this snapshot (only available on snapshots)
    downloadFiles: [DatasetFile]
    # Authors list from datacite.yml || dataset_description.json
    creators: [Creator] 
    # NEW: Contributors list from datacite.yml
    contributors: [Contributor]
  }

  # RelatedObject nature of relationship
  enum RelatedObjectRelation {
    sameAs
    derivative
    source
  }

  # RelatedObject kind of target object
  enum RelatedObjectKind {
    Dataset
    Article
  }

  # DOI for an external object
  type RelatedObject {
    # DOI string in uri format
    id: ID!
    # The nature of the relationship
    relation: RelatedObjectRelation!
    # What kind of target object is it?
    kind: RelatedObjectKind!
    # Optional description
    description: String
  }

  # Set on snapshots that have been deprecated
  type DeprecatedSnapshot {
    # hexsha of deprecated snapshots
    id: ID!
    # ID of user who flagged snapshot as deprecated
    user: String
    # Reason for deprecating snapshot
    reason: String
    # Timestamp of snapshot deprecation
    timestamp: Date
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
    # PI or senior author of this dataset
    SeniorAuthor: String
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
    # The BIDS DatasetType field defined as "raw" or "derivative"
    DatasetType: String
    # List of ethics committee approvals of the research protocols and/or protocol identifiers.
    EthicsApprovals: [String]
  }

  # Defines the Creator type in creators.ts
  type Creator {
    name: String! 
    givenName: String 
    familyName: String 
    orcid: String 
  }

  # NEW: Defines the Contributor type in contributors.ts
  type Contributor {
    name: String!
    givenName: String
    familyName: String
    orcid: String
    contributorType: String!
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
    primaryModality: String
    secondaryModalities: [String]
    sessions: [String]
    subjects: [String]
    subjectMetadata: [SubjectMetadata]
    tasks: [String]
    size: BigInt!
    totalFiles: Int!
    dataProcessed: Boolean
    pet: SummaryPetFields
    # BIDS Specification schema version
    schemaVersion: String
    # Validator metadata
    validatorMetadata: ValidatorMetadata
  }

  type SummaryPetFields {
    BodyPart: [String]
    ScannerManufacturer: [String]
    ScannerManufacturersModelName: [String]
    TracerName: [String]
    TracerRadionuclide: [String]
  }

  type SubjectMetadata {
    participantId: String!
    age: Int
    sex: String
    group: String
  }

  type FollowDatasetResponse {
    following: Boolean
    newFollower: Follower
  }

  # Dataset Followers
  type Follower {
    userId: String
    datasetId: String
  }

  type StarDatasetResponse {
    starred: Boolean
    newStar: Star
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
    code: Int
    reason: String!
    files: [ValidationIssueFile]
    additionalFileCount: Int
    helpUrl: String
  }

  # Legacy validator count of errors and warnings
  type ValidationIssueStatus {
    errors: Int
    warnings: Int
  }

  input ValidatorIssueInput {
    code: String!
    subCode: String
    location: String
    severity: Severity
    rule: String
    issueMessage: String
    affects: String
  }

  input ValidatorCodeMessageInput {
    code: String!
    message: String!
  }

  type ValidationIssueFile {
    name: String
    path: String
    key: String!
    code: Int
    file: ValidationIssueFileDetail
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

  # File metadata and link to contents
  type DatasetFile {
    id: ID!
    key: String
    filename: String!
    size: BigInt
    annexed: Boolean
    urls: [String]
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

  # An annexed file that has been flagged for removal.
  type FlaggedFile {
    datasetId: String
    snapshot: String
    filepath: String
    annexKey: String
    removed: Boolean
    remover: User
    flagged: Boolean
    flagger: User
    createdAt: DateTime
  }

  type DatasetEventDescription {
    type: String
    version: String
    public: Boolean
    target: User
    level: String
    ref: String
    message: String
  }

  # Dataset events
  type DatasetEvent {
    # Unique identifier for the event
    id: ID
    # Timestamp of the event
    timestamp: DateTime
    # User associated with the event
    user: User
    # Event description object
    event: DatasetEventDescription
    # True if the event succeeded
    success: Boolean
    # Notes associated with the event
    note: String
  }

  type FileCheck {
    datasetId: String!
    hexsha: String!
    refs: [String!]!
    annexFsck: [AnnexFsck!]
    remote: String
  }

  type AnnexFsck {
    command: String
    errorMessages: [String]
    file: String
    key: String
    note: String
    success: Boolean
  }

  input AnnexFsckInput {
    command: String
    errorMessages: [String]
    file: String
    key: String
    note: String
    success: Boolean
    dead: [String]
    missing: [String]
    untrusted: [String]
    input: [String]
  }

  type WorkerTask {
    id: ID!
    args: JSON
    kwargs: JSON
    taskName: String
    worker: String
    queuedAt: DateTime
    startedAt: DateTime
    finishedAt: DateTime
    error: String
    executionTime: Int
  }
`

schemaComposer.addTypeDefs(typeDefs)
schemaComposer.addResolveMethods(resolvers)
schemaComposer.Query.addFields(datasetSearch)
schemaComposer.Query.addFields(advancedDatasetSearch)
export default schemaComposer.buildSchema()
