import { v4 as uuidv4 } from "uuid"
import mongoose, { Document } from "mongoose"
const { Schema, model } = mongoose

export interface UploadDocument extends Document {
  id: string
  datasetId: string
  estimatedSize: number
  complete: boolean
}

/**
 * Track state for uploads in progress
 *
 * newFiles excludes files in existing commits, as those are handled by other resolvers
 */
const uploadSchema = new Schema({
  id: { type: String, required: true, default: uuidv4 },
  datasetId: { type: String, required: true },
  estimatedSize: Number,
  complete: { type: Boolean, default: false, required: true },
})

const Upload = model<UploadDocument>("Upload", uploadSchema)

export default Upload
