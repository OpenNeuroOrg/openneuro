import { v4 as uuidv4 } from "uuid"
import mongoose, { Document } from "mongoose"
const { Schema, model } = mongoose

export interface ReviewerDocument extends Document {
  id: string
  datasetId: string
  expiration: Date
  creator: string
}

const reviewerSchema = new Schema({
  id: { type: String, required: true, default: uuidv4 },
  datasetId: { type: String, required: true },
  expiration: {
    type: Date,
    default: () => Date.now() + 365 * 24 * 60 * 60 * 1000,
  },
  creator: { type: String },
})

reviewerSchema.virtual("creatorUser", {
  ref: "User",
  localField: "creator",
  foreignField: "id",
  justOne: true,
})

const Reviewer = model<ReviewerDocument>("Reviewer", reviewerSchema)

export default Reviewer
