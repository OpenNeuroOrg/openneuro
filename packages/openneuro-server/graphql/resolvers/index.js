import { GraphQLDate, GraphQLTime, GraphQLDateTime } from 'graphql-iso-date'
import { GraphQLUpload } from 'apollo-upload-server'
import GraphQLBigInt from 'graphql-bigint'
import {
  dataset,
  datasets,
  createDataset,
  deleteDataset,
  createSnapshot,
  updatePublic,
  updateFiles,
  deleteFiles,
  updateSnapshotFileUrls,
} from './dataset.js'
import { updateSummary, updateValidation } from './validation.js'
import { draft, snapshot, snapshots } from './datalad.js'
import { whoami, user, users } from './user.js'
import { datasetAdded, datasetDeleted } from './subscriptions.js'

export default {
  Date: GraphQLDate,
  Time: GraphQLTime,
  DateTime: GraphQLDateTime,
  Upload: GraphQLUpload,
  BigInt: GraphQLBigInt,
  Query: {
    dataset,
    datasets,
    whoami,
    user,
    users,
    snapshot,
  },
  Mutation: {
    createDataset,
    updateFiles,
    deleteDataset,
    deleteFiles,
    createSnapshot,
    updateSummary,
    updateValidation,
    updateSnapshotFileUrls,
    updatePublic,
  },
  Subscription: {
    datasetAdded,
    datasetDeleted,
  },
  User: user,
  Dataset: {
    uploader: ds => user(ds, { id: ds.uploader }),
    draft,
    snapshots,
  },
}
