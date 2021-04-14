import mongoose, { Document } from 'mongoose'
const { Schema, model } = mongoose

export interface SummaryDocument extends Document {
  id: string
  datasetId: string
  sessions: any[]
  subjects: any[]
  subjectMetadata: object
  tasks: any[]
  modalities: any[]
  totalFiles: number
  size: number
  dataProcessed: boolean
}

const summarySchema = new Schema({
  id: { type: String, required: true },
  datasetId: { type: String, required: true },
  sessions: Array,
  subjects: Array,
  subjectMetadata: Object,
  tasks: Array,
  modalities: Array,
  totalFiles: Number,
  size: Number,
  dataProcessed: Boolean,
})

const Summary = model<SummaryDocument>('Summary', summarySchema)

export default Summary
