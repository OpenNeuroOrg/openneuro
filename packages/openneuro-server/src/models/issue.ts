import mongoose, { Document } from 'mongoose'
const { Schema, model } = mongoose

export interface IssueDocument extends Document {
  id: string
  datasetId: string
  issues: object
}

const issueSchema = new Schema({
  id: { type: String, required: true },
  datasetId: { type: String, required: true },
  issues: Object,
})

const Issue = model<IssueDocument>('Issue', issueSchema)

export default Issue
