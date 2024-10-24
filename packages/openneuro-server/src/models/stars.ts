import mongoose from "mongoose"
import type { Document } from "mongoose"
const { Schema, model } = mongoose

export interface StarDocument extends Document {
  datasetId: string
  userId: string
}

const starSchema = new Schema({
  datasetId: { type: String, required: true },
  userId: { type: String, required: true },
})

starSchema.virtual("user", {
  ref: "User",
  localField: "userId",
  foreignField: "id",
  justOne: true,
})

const Star = model<StarDocument>("Star", starSchema)

export default Star
