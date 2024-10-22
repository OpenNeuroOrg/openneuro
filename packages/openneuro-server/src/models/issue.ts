import mongoose from "mongoose"
import type { Document } from "mongoose"
const { Schema, model } = mongoose

export interface IssueDocument extends Document {
  id: string
  datasetId: string
  issues: object
  validatorMetadata: {
    validator: string
    version: string
  }
}

const issueSchema = new Schema({
  id: { type: String, required: true },
  datasetId: { type: String, required: true },
  issues: Object,
  validatorMetadata: {
    validator: String,
    version: String,
  },
})

const Issue = model<IssueDocument>("Issue", issueSchema)

export default Issue
