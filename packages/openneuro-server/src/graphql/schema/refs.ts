import { builder } from "../builder"
import type { CommentDocument } from "../../models/comment"
import type { DatasetDocument } from "../../models/dataset"
import type { GraphQLUserType } from "../resolvers/user"

export const UserRef = builder.objectRef<Partial<GraphQLUserType>>("User")
export const DatasetRef = builder.objectRef<DatasetDocument>("Dataset")
export const DraftRef = builder.objectRef<{
  id: string
  revision?: string
  modified?: Date | string
}>("Draft")
export const SnapshotRef = builder.objectRef<Record<string, unknown>>(
  "Snapshot",
)
export const CommentRef = builder.objectRef<CommentDocument>("Comment")
export const DatasetEventRef = builder.objectRef<Record<string, unknown>>(
  "DatasetEvent",
)
