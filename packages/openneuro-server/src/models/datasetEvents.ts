import mongoose from "mongoose"
import type { Document } from "mongoose"
import type { OpenNeuroUserId } from "../types/user"
const { Schema, model } = mongoose

const datasetEventTypes = [
  "created",
  "versioned",
  "deleted",
  "published",
  "permissionChange",
  "git",
  "upload",
  "note",
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
 */
export type DatasetEventName = typeof datasetEventTypes[number]

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
  ref: string
  message: string
}

export type DatasetEventUpload = DatasetEventCommon & {
  type: "upload"
}

export type DatasetEventNote = DatasetEventCommon & {
  type: "note"
  // Is this note visible only to site admins?
  admin: boolean
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

/**
 * Dataset events log changes to a dataset
 */
export interface DatasetEventDocument extends Document {
  // Affected dataset
  datasetId: string
  // Timestamp of the event
  timestamp: Date
  // User that triggered the event
  user: string
  // A description of the event, optional but recommended to provide context
  event: DatasetEventType
  // Did the action logged succeed?
  success: boolean
  // Admin notes
  note: string
}

const datasetEventSchema = new Schema<DatasetEventDocument>({
  datasetId: { type: String, required: true },
  timestamp: { type: Date, default: Date.now },
  user: { type: String, required: true },
  event: {
    type: Object,
    required: true,
  },
  success: { type: Boolean, default: false },
  note: { type: String, default: "" },
})

datasetEventSchema.virtual("eventUser", {
  ref: "User",
  localField: "user",
  foreignField: "id",
  justOne: true,
})

const DatasetEvent = model<DatasetEventDocument>(
  "DatasetEvent",
  datasetEventSchema,
)

export default DatasetEvent
