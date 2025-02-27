import mongoose from "mongoose"
import type { Document } from "mongoose"
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
]

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
export type DatasetEventTypes = typeof datasetEventTypes[number]

/**
 * Dataset events log changes to a dataset
 */
export interface DatasetEventDocument extends Document {
  // Affected dataset
  datasetId: string
  // Timestamp of the event
  timestamp: Date
  // Event types
  type: DatasetEventTypes
  // User that triggered the event
  user: string
  // A description of the event, optional but recommended to provide context
  description: string
  // Admin notes
  note: string
}

const datasetEventSchema = new Schema<DatasetEventDocument>({
  datasetId: { type: String, required: true },
  timestamp: { type: Date, default: Date.now },
  type: { type: String, required: true, enum: datasetEventTypes },
  user: { type: String, required: true },
  description: { type: String, default: "" },
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
