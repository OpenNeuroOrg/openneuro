import uuid from 'uuid'
import mongoose, { Document } from 'mongoose'
const { Schema, model } = mongoose

export interface ReviewerDocument extends Document {
  id: string
  datasetId: string
}

const reviewerSchema = new Schema({
  id: { type: String, required: true, default: uuid.v4 },
  datasetId: { type: String, required: true },
})

const Reviewer = model<ReviewerDocument>('Reviewer', reviewerSchema)

export default Reviewer
