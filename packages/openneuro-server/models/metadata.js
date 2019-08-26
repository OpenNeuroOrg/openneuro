import uuid from 'uuid'
import mongoose from 'mongoose'

const metadataSchema = new mongoose.Schema({
  datasetId: { type: String, default: uuid.v4 }, // OpenNeuro id
  type: String,

  datasetUrl: String, // @id type
  datasetName: String,
  firstSnapshotCreatedAt: Date,
  latestSnapshotCreatedAt: Date,
  subjectCount: Number,
  modalities: [String],
  dxStatus: [String],
  ages: String,
  tasksCompleted: Boolean,
  trialCount: Number,
  studyDesign: String,
  studyDomain: String,
  studyLongitudinal: String, // 'true' | 'false' | 'user input string'
  dataProcessed: String, // 'true' | 'false' | 'user input string'
  species: String,
  associatedPaperDOI: String, // @id type
  openneuroPaperDOI: String, // @id type
  seniorAuthor: String,
  adminUsers: String, // email type (@id type?)
  notes: String,
})

metadataSchema.virtual('context').get(function() {
  return {
    datasetId: 'http://schema.org/Text', // OpenNeuro id

    datasetUrl: 'http://schema.org/Text', // @id type
    datasetName: 'http://schema.org/Text',
    firstSnapshotCreatedAt: 'http://schema.org/DateTime',
    latestSnapshotCreatedAt: 'http://schema.org/DateTime',
    subjectCount: 'http://schema.org/Number',
    modalities: {
      type: 'http://schema.org/Text',
      container: '@list',
    },
    dxStatus: {
      type: 'http://schema.org/Text',
      container: '@list',
    },
    ages: 'http://schema.org/typicalAgeRange',
    tasksCompleted: 'http://schema.org/Boolean',
    trialCount: 'http://schema.org/Number',
    studyDesign: 'http://schema.org/Text',
    studyDomain: 'http://schema.org/Text',
    studyLongitudinal: 'http://schema.org/Text', // 'true' | 'false' | 'user input string'
    dataProcessed: 'http://schema.org/Boolean', // 'true' | 'false' | 'user input string'
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
    adminUsers: 'http://schema.org/email', // email type (@id type?)
    notes: 'http://schema.org/Text',
  }
})

metadataSchema.index({ datasetId: 1 }, { unique: true })

const Metadata = mongoose.model('Metadata', metadataSchema)

export default Metadata
