import mongoose from 'mongoose'

const summarySchema = new mongoose.Schema({
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

const Summary = mongoose.model('Summary', summarySchema)

export default Summary
