import mongoose from "mongoose"
import type { Document } from "mongoose"
const { Schema, model } = mongoose

export interface DataRetentionDocument extends Document {
  datasetId: string
  // Current draft revision — when this changes, retention notices reset
  hexsha: string
  // Retention warning notices (reset when hexsha changes)
  notifiedAt14Days: Date | null
  notifiedAt7Days: Date | null
  notifiedAtDeletion: Date | null
  // One-time notice: no snapshot created within 24h of upload
  notifiedNoSnapshot: Date | null
}

const dataRetentionSchema = new Schema({
  datasetId: { type: String, required: true, unique: true },
  hexsha: { type: String, required: true },
  notifiedAt14Days: { type: Date, default: null },
  notifiedAt7Days: { type: Date, default: null },
  notifiedAtDeletion: { type: Date, default: null },
  notifiedNoSnapshot: { type: Date, default: null },
})

dataRetentionSchema.index({ datasetId: 1 })

/**
 * Data retention notification status for datasets
 */
const DataRetention = model<DataRetentionDocument>(
  "DataRetention",
  dataRetentionSchema,
)

export default DataRetention
