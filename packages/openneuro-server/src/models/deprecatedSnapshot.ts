import mongoose, { Document } from 'mongoose'
const { Schema, model } = mongoose

export interface DeprecatedSnapshotDocument extends Document {
  id: string // snapshot hexsha
  deprecated: boolean
  deprecatedBy: string // user
  deprecatedAt: Date
  deprecatedFor: string // cause
}

const deprecatedSnapshotSchema = new Schema({
  id: { type: String, required: true },
  deprecated: { type: Boolean, default: false, required: true },
  deprecatedBy: {
    type: String,
    required: function (): boolean {
      return !!this.deprecated
    },
  },
  deprecatedAt: {
    type: Date,
    required: function (): boolean {
      return !!this.deprecated
    },
  },
  deprecatedFor: {
    type: String,
    required: function (): boolean {
      return !!this.deprecated
    },
  },
})

deprecatedSnapshotSchema.index({ datasetId: 1 })

const Snapshot = model<DeprecatedSnapshotDocument>(
  'DeprecatedSnapshot',
  deprecatedSnapshotSchema,
)

export default Snapshot
