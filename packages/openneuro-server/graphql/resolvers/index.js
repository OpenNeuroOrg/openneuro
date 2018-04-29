import { GraphQLDate, GraphQLTime, GraphQLDateTime } from 'graphql-iso-date'
import { GraphQLUpload } from 'apollo-upload-server'
import Dataset from './dataset.js'
import { dataset, datasets, createDataset, updateFiles } from './dataset.js'
import { draft, snapshot } from './datalad.js'
import { summary } from './summary.js'
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
  },
  User: user,
  Dataset: {
    uploader: ds => user(ds, { id: ds.uploader }),
    draft,
  },
  Draft: draft,
  Snapshot: snapshot,
  Summary: summary,
}
