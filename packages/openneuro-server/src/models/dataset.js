import mongoose from 'mongoose'
import Changes from './changes.js'

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

datasetSchema.post('save', dataset => {
  new Changes({
    datasetId: dataset.id,
    created: true,
  }).save()
})

datasetSchema.post('updateOne', function() {
  const datasetId = this._conditions ? this._conditions.id : null
  new Changes({
    datasetId,
    modified: true,
  }).save()
})

datasetSchema.post('deleteOne', function() {
  const datasetId = this._conditions ? this._conditions.id : null
  new Changes({
    datasetId,
    deleted: true,
  }).save()
})

const Dataset = mongoose.model('Dataset', datasetSchema)

export default Dataset
