import mongoose, { Document } from 'mongoose'
const { Schema, model } = mongoose

export interface SummaryDocument extends Document {
  id: string
  datasetId: string
  sessions: string[]
  subjects: string[]
  subjectMetadata: object
  tasks: string[]
  modalities: string[]
  totalFiles: number
  size: number
  dataProcessed: boolean
}

const summarySchema = new Schema({
  id: { type: String, required: true },
  datasetId: { type: String, required: true },
  sessions: [String],
  subjects: [String],
  subjectMetadata: Object,
  tasks: [String],
  modalities: [String],
  totalFiles: Number,
  size: Number,
  dataProcessed: Boolean,
})

summarySchema.index({ id: 1 })

const Summary = model<SummaryDocument>('Summary', summarySchema)

export default Summary
