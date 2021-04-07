import mongoose from 'mongoose'
import pubsub from '../graphql/pubsub.js'

const datasetChangeSchema = new mongoose.Schema(
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

const DatasetChange = mongoose.model('DatasetChange', datasetChangeSchema)

export default DatasetChange
