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
    # Get a list of users
    users: [User]
  }

  type Mutation {
    # Create a new dataset container and repository
    createDataset(label: String!): Dataset
    # Tag the current draft
    createSnapshot(datasetId: ID!): Snapshot
    # Add or update files in a draft - returns a new Draft
    updateFiles(datasetId: ID!, files: [Upload!]): Draft
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
    created: DateTime!
    modified: DateTime!
    files: [DatasetFile]
  }

  # Tagged snapshot of a draft
  type Snapshot {
    ref: String!
    dataset: Dataset!
    metadata: DatasetMetadata
    created: DateTime!
    modified: DateTime!
    files: [DatasetFile]
  }

  # Metadata associated with both drafts and snapshots
  type DatasetMetadata {
    id: ID!
    authors: [Author]
    summary: Summary
  }

  # Authors of a dataset
  type Author {
    ORCID: String
    name: String
  }

  # Validator summary from bids-validator
  type Summary {
    modalities: [String]
    session: [String]
    subjects: [String]
    tasks: [String]
    size: Int
    totalFiles: Int
  }

  # File metadata and link to contents
  type DatasetFile {
    id: ID!
    name: String!
    created: DateTime!
    modified: DateTime!
    size: Int
    hash: String
    url: String
  }
`

export default makeExecutableSchema({ typeDefs, resolvers })
