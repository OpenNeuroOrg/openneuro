import { GraphQLDate, GraphQLTime, GraphQLDateTime } from 'graphql-iso-date'
import GraphQLBigInt from 'graphql-bigint'
import Query from './query.js'
import Mutation from './mutation.js'
import Dataset from './dataset.js'
import Draft from './draft.js'
import Snapshot from './snapshots.js'
import User from './user.js'
import Comment from './comment.js'

export default {
  // Scalars
  Date: GraphQLDate,
  Time: GraphQLTime,
  DateTime: GraphQLDateTime,
  BigInt: GraphQLBigInt,
  // Complex types
  Query,
  Mutation,
  User,
  Dataset,
  Draft,
  Snapshot,
  Comment,
}
