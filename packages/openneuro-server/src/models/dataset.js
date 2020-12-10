import mongoose from 'mongoose'

const datasetSchema = new mongoose.Schema(
  {
    id: { type: String, unique: true }, // Accession number
    created: { type: Date, default: Date.now },
    modified: { type: Date, default: Date.now },
    public: Boolean,
    publishDate: { type: Date, default: null },
    uploader: String,
    name: String,
  },
  { toJSON: { virtuals: true }, toObject: { virtuals: true } },
)

// Foreign key virtuals for sorting

datasetSchema.virtual('uploadUser', {
  ref: 'User',
  localField: 'uploader',
  foreignField: 'id',
  justOne: true,
})

datasetSchema.virtual('stars', {
  ref: 'Star',
  localField: 'id',
  foreignField: 'datasetId',
  count: true,
  justOne: true,
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
  count: true,
  justOne: true,
})

const Dataset = mongoose.model('Dataset', datasetSchema)

export default Dataset
