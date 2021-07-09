import mongoose, { Document } from 'mongoose'
const { Schema, model } = mongoose

export interface SnapshotDocument extends Document {
  datasetId: string
  tag: string
  created: Date
  hexsha: string
  deprecated: boolean
  deprecatedBy: string // user
  deprecatedAt: Date
  deprecatedFor: string // cause
}

const snapshotSchema = new Schema({
  datasetId: { type: String, required: true },
  tag: { type: String, required: true },
  created: { type: Date, default: Date.now },
  hexsha: { type: String },
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

snapshotSchema.index({ datasetId: 1, tag: 1 }, { unique: true })
snapshotSchema.index({ datasetId: 1 })

const Snapshot = model<SnapshotDocument>('Snapshot', snapshotSchema)

export default Snapshot
