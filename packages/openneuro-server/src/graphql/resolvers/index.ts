import { GraphQLDate, GraphQLDateTime, GraphQLTime } from "graphql-iso-date"
import GraphQLBigInt from "graphql-bigint"
import Query from "./query"
import Mutation from "./mutation"
import Dataset from "./dataset"
import Draft from "./draft"
import Snapshot from "./snapshots"
import User from "./user"
import Comment from "./comment"

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
