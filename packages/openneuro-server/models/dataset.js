import mongoose from 'mongoose'

const datasetSchema = new mongoose.Schema({
  id: { type: String, unique: true }, // Accession number
  created: { type: Date, default: Date.now },
  modified: { type: Date, default: Date.now },
  uploader: String,
  revision: String,
})

const Dataset = mongoose.model('Dataset', datasetSchema)

export default Dataset
