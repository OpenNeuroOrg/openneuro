import mongoose from 'mongoose'
import pubsub from '../graphql/pubsub.js'

const changesSchema = new mongoose.Schema(
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

changesSchema.post('save', doc => {
  pubsub.publish('datasetChanged', {
    datasetChanged: doc,
  })
})

const Changes = mongoose.model('Changes', changesSchema)

export default Changes
