import mongoose from 'mongoose'

const datasetSchema = new mongoose.Schema(
  {
    id: { type: String, unique: true }, // Accession number
    created: { type: Date, default: Date.now },
    modified: { type: Date, default: Date.now },
    revision: String,
  },
  { toJSON: { virtuals: true }, toObject: { virtuals: true } },
)

// Foreign key virtuals for sorting

datasetSchema.virtual('uploader', {
  ref: 'User',
  localField: 'uploader',
  foreignField: 'id',
  justOne: true,
})

datasetSchema.virtual('stars', {
  ref: 'Star',
  localField: 'id',
  foreignField: 'datasetId',
})

datasetSchema.virtual('analytics', {
  ref: 'Analytics',
  localField: 'id',
  foreignField: 'datasetId',
})

datasetSchema.virtual('subscriptions', {
  ref: 'Subscription',
  localField: 'id',
  foreignField: 'datasetId',
})

const Dataset = mongoose.model('Dataset', datasetSchema)

export default Dataset
