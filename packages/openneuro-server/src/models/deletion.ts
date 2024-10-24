import mongoose from "mongoose"
import type { Document } from "mongoose"
const { Schema, model } = mongoose

export interface DeletionDocument extends Document {
  datasetId: string
  user: {
    _id: string
  }
  reason: string
  redirect: string
  created_at: Date
}

const deletion = new Schema(
  {
    datasetId: String, // OpenNeuro id
    user: { _id: String },
    reason: String,
    redirect: String,
  },
  { timestamps: { createdAt: "created_at" } },
)

const Deletion = model<DeletionDocument>("Deletion", deletion)

export default Deletion
