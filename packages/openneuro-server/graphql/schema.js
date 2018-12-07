import { makeExecutableSchema } from 'graphql-tools'
import resolvers from './resolvers'

const typeDefs = `
  scalar Date
  scalar DateTime
  scalar Time
  scalar Upload
  scalar BigInt

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
      "Limit to datasets available publicly"
      public: Boolean = false
      "Sorting fields"
      orderBy: DatasetSort
    ): DatasetConnection
    # Get one user
    user(id: ID!): User
    # Get a list of users
    users: [User]
    # Request one snapshot
    snapshot(datasetId: ID!, tag: String!): Snapshot
    # Determine if a dataset is partially uploaded
    partial(datasetId: ID!): Boolean
  }

  type Mutation {
    # Create a new dataset container and repository
    createDataset(label: String!): Dataset
    # Deletes a dataset and all associated snapshots
    deleteDataset(id: ID!): Dataset
    # Tag the current draft
    createSnapshot(datasetId: ID!, tag: String!): Snapshot
    # Remove a tag from the dataset
    deleteSnapshot(datasetId: ID!, tag: String!): Boolean!
    # Add or update files in a draft - returns a new Draft
    updateFiles(datasetId: ID!, files: FileTree!): Draft
    # delete files in a draft - returns a new Draft
    deleteFiles(datasetId: ID!, files: FileTree!): Draft
    # Add or remove the public flag from a dataset
    updatePublic(datasetId: ID!, publicFlag: Boolean!): Boolean!
    # Update a draft summary
    updateSummary(summary: SummaryInput!): Summary
    # Update a draft with validation results
    updateValidation(validation: ValidationInput!): Boolean
    # Update a snapshot with a list of file urls
    updateSnapshotFileUrls(fileUrls: FileUrls!): Boolean
    # Update a users's permissions on a dataset
    updatePermissions(datasetId: ID!, userEmail: String!, level: String): Boolean
    # Remove a users's permissions on a dataset
    removePermissions(datasetId: ID!, userId: String!): Boolean
    # Remove a user
    removeUser(id: ID!): Boolean
    # Sets a users admin status
    setAdmin(id: ID!, admin: Boolean!): Boolean
    # Tracks a view or download for a dataset
    trackAnalytics(datasetId: ID!, tag: String, type: AnalyticTypes): Boolean
  }

  type Subscription {
    datasetCreated: Dataset
    datasetDeleted: ID
    snapshotAdded(datasetId: ID!): Snapshot
    snapshotDeleted(datasetId: ID!): ID
    datasetValidationUpdated(datasetId: ID!, hash: String!): [ValidationIssue]
    draftFilesUpdated(datasetId: ID!): [DatasetFile]
    permissionsUpdated(datasetId: ID!): [Permission]
  }

  input SummaryInput {
    id: ID! # Git reference for this summary
    datasetId: ID!
    modalities: [String]
    sessions: [String]
    subjects: [String]
    tasks: [String]
    size: BigInt!
    totalFiles: Int!
  }

  input ValidationInput {
    id: ID! # Git reference for this validation
    datasetId: ID!
    issues: [ValidationIssueInput]!
  }

  input FileUrls {
    datasetId: ID!
    tag: String! # reference to the snapshot tag
    files: [UpdateFileUrlInput]
  }

  # File tree
  input FileTree {
    name: ID! # directory name (or empty string for root)
    files: [Upload!] # files within the directory
    directories: [FileTree] # directories within the directory
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
    node: Dataset
    # Pagination cursor
    cursor: String!
  }

  # Top level dataset, one draft and many snapshots
  type Dataset { 
    id: ID!
    created: DateTime!
    uploader: User
    public: Boolean
    draft: Draft
    snapshots: [Snapshot]
    permissions: [Permission]
    analytics: Analytic
    stars: [Star]
    followers: [Follower]
  }

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
    # Alphanumeric sort of user names
    user: SortOrdering
    # Order by star count
    stars: SortOrdering
    # Order by download count
    downloads: SortOrdering
    # Order by count of dataset followers
    subscriptions: SortOrdering
  }

  # Ephemeral draft or working tree for a dataset
  type Draft {
    # The draft id is the git hexsha of the most recent committed draft
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
    files(untracked: Boolean): [DatasetFile]
    # Flag if a dataset operation is incomplete (and may be reverted or resumed)
    partial: Boolean
    # dataset_description.json fields
    description: Description
  }

  # Tagged snapshot of a draft
  type Snapshot {
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
    files: [DatasetFile]
    # dataset_description.json fields
    description: Description
    # Snapshot usage and download statistics
    analytics: Analytic
  }

  # Contents of dataset_description.json
  type Description {
    # Name of the dataset
    Name: String!
    # The version of the BIDS standard that was used
    BIDSVersion: String!
    # License for distribution - see BIDS specification (https://bids.neuroimaging.io) appendix II for recommended values
    License: String
    # List of individuals who contributed to the creation/curation of the dataset
    Authors: [String]
    # Text acknowledging contributions of individuals or institutions beyond those listed in Authors or Funding.
    Acknowledgements: [String]
    # Instructions how researchers using this dataset should acknowledge the original authors. This field can also be used to define a publication that should be cited in publications that use the dataset.
    HowToAcknowledge: String
    # List of sources of funding (grant numbers)
    Funding: [String]
    # List of references to publication that contain information on the dataset, or links
    ReferencesAndLinks: [String]
    # The Document Object Identifier of the dataset (not the corresponding paper).
    DatasetDOI: String
  }

  #User permissions on a dataset
  type Permission {
    datasetId: ID!
    userId: String!
    level: String!
    user: User
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
    tasks: [String]
    size: BigInt!
    totalFiles: Int!
  }

  # Dataset Followers
  type Follower {
    userId: String
    datasetId: String
  }

  # Dataset Stars
  type Star {
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
  }

  input ValidationIssueInput {
    severity: Severity!
    key: String!
    code: Int!
    reason: String!
    files: [ValidationIssueFileInput]
    additionalFileCount: Int
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
  }

  # Update file object
  input UpdateFileUrlInput {
    filename: String!
    urls: [String]
  }

  # Analytics for a dataset
  type Analytic {
    datasetId: ID!
    tag: String
    views: Int
    downloads: Int
  }

  # Types of analytics
  enum AnalyticTypes {
    downloads
    views
  }

`

export default makeExecutableSchema({
  typeDefs,
  resolvers,
})
