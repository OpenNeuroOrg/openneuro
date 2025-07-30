import mongoose from "mongoose"
import type { Document } from "mongoose"
import type { OpenNeuroUserId } from "../types/user"
import { v4 as uuidv4 } from "uuid"
import type { UserDocument } from "./user"
const { Schema, model } = mongoose

const _datasetEventTypes = [
  "created",
  "versioned",
  "deleted",
  "published",
  "permissionChange",
  "git",
  "upload",
  "note",
  "contributorRequest",
  "contributorResponse",
] as const

/**
 * Various events that occur affecting one dataset
 *
 * created - Dataset was created
 * versioned - Dataset has a snapshot created
 * deleted - The dataset was deleted
 * published - Dataset was made public
 * permissionChange - Dataset permissions were modified
 * git - A git event modified the dataset's repository (git history provides details)
 * upload - A non-git upload occurred (typically one file changed)
 * note - A note unrelated to another event
 * contributorRequest - a request event is created for user access
 * contributorResponse - response of deny or approve is granted
 */
export type DatasetEventName = typeof _datasetEventTypes[number]

export type DatasetEventCommon = {
  type: DatasetEventName
}

export type DatasetEventCreated = DatasetEventCommon & {
  type: "created"
}

export type DatasetEventVersioned = DatasetEventCommon & {
  type: "versioned"
  version: string
}

export type DatasetEventDeleted = DatasetEventCommon & {
  type: "deleted"
}

export type DatasetEventPublished = DatasetEventCommon & {
  type: "published"
  // True if made public, false if made private
  public: boolean
}

export type DatasetEventPermissionChange = DatasetEventCommon & {
  type: "permissionChange"
  // User with the permission being changed
  target: OpenNeuroUserId
  level: string
}

export type DatasetEventGit = DatasetEventCommon & {
  type: "git"
  commit: string
  reference: string
}

export type DatasetEventUpload = DatasetEventCommon & {
  type: "upload"
}

export type DatasetEventNote = DatasetEventCommon & {
  type: "note"
  // only visible to dataset Admins
  admin: boolean
}

export type DatasetEventContributorRequest = DatasetEventCommon & {
  type: "contributorRequest"
  requestId?: string
  resolutionStatus?: "pending" | "accepted" | "denied"
}

export type DatasetEventContributorResponse = DatasetEventCommon & {
  type: "contributorResponse"
  requestId: string
  targetUserId: OpenNeuroUserId
  status: "accepted" | "denied"
  reason?: string
}

/**
 * Description of a dataset event
 */
export type DatasetEventType =
  | DatasetEventCreated
  | DatasetEventVersioned
  | DatasetEventDeleted
  | DatasetEventPublished
  | DatasetEventPermissionChange
  | DatasetEventGit
  | DatasetEventUpload
  | DatasetEventNote
  | DatasetEventContributorRequest
  | DatasetEventContributorResponse

/**
 * Dataset events log changes to a dataset
 */
export interface DatasetEventDocument extends Document {
  // Unique id for the event
  id: string
  // Affected dataset
  datasetId: string
  // Timestamp of the event
  timestamp: Date
  // User id that triggered the event
  userId: string
  // User that triggered the event
  user: UserDocument
  // A description of the event, optional but recommended to provide context
  event: DatasetEventType
  // Did the action logged succeed?
  success: boolean
  // Admin notes
  note: string
}

const datasetEventSchema = new Schema<DatasetEventDocument>({
  id: { type: String, required: true, default: uuidv4 },
  datasetId: { type: String, required: true },
  timestamp: { type: Date, default: Date.now },
  userId: { type: String, required: true },
  event: {
    type: { type: String, required: true, enum: _datasetEventTypes },
    version: { type: String },
    public: { type: Boolean },
    target: { type: String },
    level: { type: String },
    commit: { type: String },
    reference: { type: String },
    admin: { type: Boolean, default: false },
    requestId: { type: String, sparse: true, index: true },
    targetUserId: { type: String },
    status: { type: String, enum: ["accepted", "denied"] },
    reason: { type: String },
    datasetId: { type: String },
    resolutionStatus: {
      type: String,
      enum: ["pending", "accepted", "denied"],
      default: "pending",
    },
  },
  success: { type: Boolean, default: false },
  note: { type: String, default: "" },
})

datasetEventSchema.virtual("user", {
  ref: "User",
  localField: "userId",
  foreignField: "id",
  justOne: true,
})

const DatasetEvent = model<DatasetEventDocument>(
  "DatasetEvent",
  datasetEventSchema,
)

export default DatasetEvent
