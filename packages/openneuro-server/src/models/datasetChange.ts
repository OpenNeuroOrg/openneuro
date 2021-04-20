import mongoose, { Document } from 'mongoose'
const { Schema, model } = mongoose
import pubsub from '../graphql/pubsub'

export interface DatasetChangeDocument extends Document {
  datasetId: string
  created: boolean
  modified: boolean
  deleted: boolean
  timestamp: Date
}

const datasetChangeSchema = new Schema(
  {
    datasetId: { type: String, required: true },
    created: { type: Boolean, default: false },
    modified: { type: Boolean, default: false },
    deleted: { type: Boolean, default: false },
    timestamp: { type: Date, default: Date.now },
  },
  {
    // limits the collection size to 1000 documents
    // works like a circular buffer
    capped: 1000,
  },
)

datasetChangeSchema.post('save', doc => {
  pubsub.publish('datasetChanged', {
    datasetChanged: doc,
  })
})

const DatasetChange = model<DatasetChangeDocument>(
  'DatasetChange',
  datasetChangeSchema,
)

export default DatasetChange
