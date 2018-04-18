import { GraphQLDate, GraphQLTime, GraphQLDateTime } from 'graphql-iso-date'
import { GraphQLUpload } from 'apollo-upload-server'
import { dataset, datasets, createDataset, updateFiles } from './dataset'
import { whoami, users } from './user'

export default {
  Query: {
    dataset,
    datasets,
    whoami,
    users,
  },
  Mutation: {
    createDataset,
    updateFiles,
  },
  Date: GraphQLDate,
  Time: GraphQLTime,
  DateTime: GraphQLDateTime,
  Upload: GraphQLUpload,
}
