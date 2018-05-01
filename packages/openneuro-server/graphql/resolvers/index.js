import { GraphQLDate, GraphQLTime, GraphQLDateTime } from 'graphql-iso-date'
import { GraphQLUpload } from 'apollo-upload-server'
import {
  dataset,
  datasets,
  createDataset,
  createSnapshot,
  updateFiles,
} from './dataset.js'
import { draft, snapshots } from './datalad.js'
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
  },
  Mutation: {
    createDataset,
    updateFiles,
    createSnapshot,
  },
  User: user,
  Dataset: {
    uploader: ds => user(ds, { id: ds.uploader }),
    draft,
    snapshots,
  },
}
