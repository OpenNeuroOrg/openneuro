import mongoose from 'mongoose'

const analyticsSchema = new mongoose.Schema({
  datasetId: { type: String, required: true },
  tag: { type: String, required: false },
  type: { type: String, required: true },
  downloads: { type: Number, required: false },
  views: { type: Number, required: false },
})

const Analytics = mongoose.model('Analytics', analyticsSchema)

export default Analytics
