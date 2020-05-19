import mongoose from 'mongoose'

const snapshotSchema = new mongoose.Schema({
  datasetId: { type: String, required: true },
  tag: { type: String, required: true },
  created: { type: Date, default: Date.now },
  hexsha: { type: String },
})

snapshotSchema.index({ datasetId: 1, tag: 1 }, { unique: true })

const Snapshot = mongoose.model('Snapshot', snapshotSchema)

export default Snapshot
