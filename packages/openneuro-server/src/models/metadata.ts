import { v4 as uuidv4 } from "uuid"
import mongoose, { Document } from "mongoose"
const { Schema, model } = mongoose

export interface MetadataDocument extends Document {
  datasetId: string
  datasetName: string
  datasetUrl: string
  dataProcessed: boolean
  firstSnapshotCreatedAt: Date
  latestSnapshotCreatedAt: Date
  ages: number[]
  modalities: string[]
  adminUsers: string[]
  dxStatus: string
  tasksCompleted: string[]
  trialCount: number
  studyDesign: string
  studyDomain: string
  studyLongitudinal: string
  species: string
  associatedPaperDOI: string
  openneuroPaperDOI: string
  seniorAuthor: string
  grantFunderName: string
  grantIdentifier: string
  affirmedDefaced: boolean
  affirmedConsent: boolean
}

const metadataSchema = new Schema({
  datasetId: { type: String, default: uuidv4 }, // OpenNeuro id
  datasetName: String,
  datasetUrl: String, // @id type
  dataProcessed: Boolean, // 'true' | 'false' | 'user input string'
  firstSnapshotCreatedAt: Date,
  latestSnapshotCreatedAt: Date,
  ages: [Number],
  modalities: [String],
  adminUsers: [String], // email type (@id type?)
  dxStatus: String,
  tasksCompleted: [String],
  trialCount: Number,
  studyDesign: String,
  studyDomain: String,
  studyLongitudinal: String, // 'true' | 'false' | 'user input string'
  species: String,
  associatedPaperDOI: String, // @id type
  openneuroPaperDOI: String, // @id type
  seniorAuthor: String,
  grantFunderName: String,
  grantIdentifier: String,
  affirmedDefaced: Boolean,
  affirmedConsent: Boolean,
})

metadataSchema.index({ datasetId: 1 }, { unique: true })

const Metadata = model<MetadataDocument>("Metadata", metadataSchema)

export default Metadata
