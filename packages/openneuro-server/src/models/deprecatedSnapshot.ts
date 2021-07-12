import mongoose, { Document } from 'mongoose'
const { Schema, model } = mongoose

export interface DeprecatedSnapshotDocument extends Document {
  id: string // snapshot hexsha
  user: string
  cause: string
  timestamp: Date
}

const deprecatedSnapshotSchema = new Schema({
  id: { type: String, required: true },
  user: {
    type: String,
    required: true,
    ref: 'User',
  },
  cause: {
    type: String,
    required: true,
  },
  timestamp: {
    type: Date,
    required: true,
  },
})

deprecatedSnapshotSchema.index({ datasetId: 1 })

const Snapshot = model<DeprecatedSnapshotDocument>(
  'DeprecatedSnapshot',
  deprecatedSnapshotSchema,
)

export default Snapshot
