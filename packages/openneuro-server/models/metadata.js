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
  type: String,
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

metadataSchema.virtual('context').get(function() {
  return {
    datasetName: 'http://schema.org/Text',
    datasetUrl: 'http://schema.org/Text', // @id type
    dataProcessed: 'http://schema.org/Boolean', // 'true' | 'false' | 'user input string'
    firstSnapshotCreatedAt: 'http://schema.org/DateTime',
    latestSnapshotCreatedAt: 'http://schema.org/DateTime',
    ages: {
      type: 'http://schema.org/Number', // email type (@id type?)
      container: '@list',
    },
    modalities: {
      type: 'http://schema.org/Text', // email type (@id type?)
      container: '@list',
    },
    datasetId: 'http://schema.org/Text', // OpenNeuro id
    dxStatus: 'http://schema.org/Text',
    tasksCompleted: 'http://schema.org/Text',
    trialCount: 'http://schema.org/Number',
    studyDesign: 'http://schema.org/Text',
    studyDomain: 'http://schema.org/Text',
    studyLongitudinal: 'http://schema.org/Text', // 'true' | 'false' | 'user input string'
    species: 'http://schema.org/Text',
    associatedPaperDOI: {
      id: 'http://schema.org/url',
      type: '@id',
    }, // @id type
    openneuroPaperDOI: {
      id: 'http://schema.org/url',
      type: '@id',
    }, // @id type
    seniorAuthor: 'http://schema.org/name',
    adminUsers: {
      type: 'http://schema.org/email', // email type (@id type?)
      container: '@list',
    },
  }
})

metadataSchema.index({ datasetId: 1 }, { unique: true })

const Metadata = mongoose.model('Metadata', metadataSchema)

export default Metadata
