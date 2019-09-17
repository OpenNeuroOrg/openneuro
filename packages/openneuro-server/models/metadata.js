import uuid from 'uuid'
import mongoose from 'mongoose'

const metadataSchema = new mongoose.Schema({
  datasetName: String,
  datasetUrl: String, // @id type
  dataProcessed: Boolean, // 'true' | 'false' | 'user input string'
  firstSnapshotCreatedAt: Date,
  latestSnapshotCreatedAt: Date,
  ages: [Number],
  modalities: [String],
  datasetId: { type: String, default: uuid.v4 }, // OpenNeuro id
  adminUsers: [String], // email type (@id type?)
  dxStatus: String,
  tasksCompleted: String,
  trialCount: Number,
  studyDesign: String,
  studyDomain: String,
  studyLongitudinal: String, // 'true' | 'false' | 'user input string'
  species: String,
  associatedPaperDOI: String, // @id type
  openneuroPaperDOI: String, // @id type
  seniorAuthor: String,
})

metadataSchema.index({ datasetId: 1 }, { unique: true })

const Metadata = mongoose.model('Metadata', metadataSchema)

export default Metadata
