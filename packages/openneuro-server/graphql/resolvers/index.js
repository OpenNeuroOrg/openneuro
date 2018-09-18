import { GraphQLDate, GraphQLTime, GraphQLDateTime } from 'graphql-iso-date'
import GraphQLBigInt from 'graphql-bigint'
import Query from './query.js'
import Mutation from './mutation.js'
import Subscription from './subscriptions.js'
import Dataset from './dataset.js'
import Snapshot from './snapshots.js'
import User from './user.js'

export default {
  // Scalars
  Date: GraphQLDate,
  Time: GraphQLTime,
  DateTime: GraphQLDateTime,
  BigInt: GraphQLBigInt,
  // Complex types
  Query,
  Mutation,
  Subscription,
  User,
  Dataset,
  Snapshot,
}
