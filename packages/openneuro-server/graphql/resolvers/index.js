import { GraphQLDate, GraphQLTime, GraphQLDateTime } from 'graphql-iso-date'
import { GraphQLUpload } from 'apollo-upload-server'
import {
  dataset,
  datasets,
  createDataset,
  createSnapshot,
  updatePublic,
  updateFiles,
} from './dataset.js'
import { draft, snapshot, snapshots } from './datalad.js'
import { whoami, user, users } from './user.js'

export default {
  Date: GraphQLDate,
  Time: GraphQLTime,
  DateTime: GraphQLDateTime,
  Upload: GraphQLUpload,
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
    createSnapshot,
    updatePublic
  },
  User: user,
  Dataset: {
    uploader: ds => user(ds, { id: ds.uploader }),
    draft,
    snapshots,
  },
}
