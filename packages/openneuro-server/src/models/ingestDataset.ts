/**
 * Model for ingest of new datasets from a remote URL (zip/tarball)
 */
import mongoose, { Document, ObjectId } from "mongoose"
const { Schema, model } = mongoose
import { validateUrl } from "../utils/validateUrl"

export interface IngestDatasetDocument extends Document {
  _id: ObjectId
  datasetId: string
  userId: string
  url: string
  imported: boolean
}

const ingestDatasetSchema = new Schema({
  datasetId: { type: String, required: true },
  userId: { type: String, required: true },
  url: {
    type: String,
    required: true,
    validate: {
      validator: validateUrl,
      message: "Must be a valid HTTPS URL",
    },
  },
  imported: { type: Boolean, required: true, default: false },
})

const IngestDataset = model<IngestDatasetDocument>(
  "IngestDataset",
  ingestDatasetSchema,
)

export default IngestDataset
