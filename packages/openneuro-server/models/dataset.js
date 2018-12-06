import mongoose from 'mongoose'

const datasetSchema = new mongoose.Schema({
  id: { type: String, unique: true }, // Accession number
  created: { type: Date, default: Date.now },
  modified: { type: Date, default: Date.now },
  uploader: String,
  revision: String,
})

datasetSchema.virtual('uploader', {
  ref: 'User',
  localField: 'uploader',
  foreignField: 'id',
  justOne: true,
})

const Dataset = mongoose.model('Dataset', datasetSchema)

export default Dataset
