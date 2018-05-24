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
    # All datasets
    datasets: [Dataset]
    # Check for server side login status
    whoami: User
    # Get one user
    user(id: ID!): User
    # Get a list of users
    users: [User]
    # Request one snapshot
    snapshot(datasetId: ID!, tag: String!): Snapshot
  }

  type Mutation {
    # Create a new dataset container and repository
    createDataset(label: String!): Dataset
    # Deletes a dataset and all associated snapshots
    deleteDataset(label: String!): Dataset
    # Tag the current draft
    createSnapshot(datasetId: ID!, tag: String!): Snapshot
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

  # OpenNeuro user records from all providers
  type User {
    id: ID!
    provider: UserProvider
    avatar: String
    created: DateTime!
    modified: DateTime
    email: String!
    firstLogin: DateTime
    lastLogin: DateTime
    firstName: String!
    lastName: String!
  }
  
  # Which provider a user login comes from
  enum UserProvider {
    Google
    ORCID
  }

  # Top level dataset, one draft and many snapshots
  type Dataset { 
    id: ID!
    created: DateTime!
    label: String!
    uploader: User
    public: Boolean
    draft: Draft
    snapshots: [Snapshot]
  }

  # Ephemeral draft or working tree for a dataset
  type Draft {
    id: ID!
    dataset: Dataset
    modified: DateTime!
    authors: [Author]
    summary: Summary
    issues: [ValidationIssue]
    files: [DatasetFile]
  }

  # Tagged snapshot of a draft
  type Snapshot {
    id: ID!
    tag: String!
    dataset: Dataset!
    created: DateTime
    authors: [Author]
    summary: Summary
    files: [DatasetFile]
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
    filename: String
    path: String
    relativePath: String
    evidence: String
    line: Int
    character: Int
    severity: Severity!
    reason: String
  }

  input ValidationIssueFileInput {
    key: String!
    code: Int!
    filename: String
    path: String
    relativePath: String
    evidence: String
    line: Int
    character: Int
    severity: Severity!
    reason: String
  }

  # File metadata and link to contents
  type DatasetFile {
    id: ID!
    filename: String!
    size: BigInt
    urls: [String]
  }

  # Update file object
  input UpdateFileUrlInput {
    filename: String!
    urls: [String]
  }
`

export default makeExecutableSchema({
  typeDefs,
  resolvers,
})
