import mongoose from "mongoose"
import type { Document } from "mongoose"
const { Schema, model } = mongoose

export interface SnapshotDocument extends Document {
  id: string
  datasetId: string
  tag: string
  created: Date
  hexsha: string
}

const snapshotSchema = new Schema({
  datasetId: { type: String, required: true },
  tag: { type: String, required: true },
  created: { type: Date, default: Date.now },
  hexsha: { type: String },
})

snapshotSchema.index({ datasetId: 1, tag: 1 }, { unique: true })
snapshotSchema.index({ datasetId: 1 })

const Snapshot = model<SnapshotDocument>("Snapshot", snapshotSchema)

export default Snapshot
