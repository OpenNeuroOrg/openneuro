import { makeExecutableSchema } from 'graphql-tools'
import resolvers from './resolvers'

const typeDefs = `
  scalar Date
  scalar DateTime
  scalar Time
  scalar Upload

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
    # Tag the current draft
    createSnapshot(datasetId: ID!, tag: String!): Snapshot
    # Add or update files in a draft - returns a new Draft
    updateFiles(datasetId: ID!, files: FileTree!): Draft
    # Update a draft with validation results
    updateValidation(datasetId: ID!, ref: String!, summary: Summary, issues: [ValidationIssue]): Boolean
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
    modalities: [String]
    sessions: [String]
    subjects: [String]
    tasks: [String]
    size: Int!
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

  type ValidationIssueFile {
    key: String!
    code: Int!
    file: ValidationFileDetail
    evidence: String
    line: Int
    character: Int
    severity: Severity!
    reason: String
  }

  type ValidationFileDetail {
    name: String!
    path: String!
    relativePath: String!
  }

  # File metadata and link to contents
  type DatasetFile {
    id: ID!
    filename: String!
    size: Int
    urls: [String]
  }
`

export default makeExecutableSchema({
  typeDefs,
  resolvers,
})
