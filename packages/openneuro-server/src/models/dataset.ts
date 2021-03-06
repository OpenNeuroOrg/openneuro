import mongoose, { Document } from 'mongoose'
const { Schema, model } = mongoose
import DatasetChange from './datasetChange'

export interface DatasetDocument extends Document {
  id: string
  created: Date
  modified: Date
  public: boolean
  publishDate: Date
  uploader: string
  name: string
  _conditions: any
}

const datasetSchema = new Schema<DatasetDocument>(
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

datasetSchema.index({ public: 1 }, { sparse: true })

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
  new DatasetChange({
    datasetId: dataset.id,
    created: true,
  }).save()
})

datasetSchema.post('updateOne', function () {
  const datasetId = this._conditions ? this._conditions.id : null
  new DatasetChange({
    datasetId,
    modified: true,
  }).save()
})

datasetSchema.post('deleteOne', function () {
  const datasetId = this._conditions ? this._conditions.id : null
  new DatasetChange({
    datasetId,
    deleted: true,
  }).save()
})

const Dataset = model<DatasetDocument>('Dataset', datasetSchema)

export default Dataset
