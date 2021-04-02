import mongoose from 'mongoose'

const removedAnnexObject = new mongoose.Schema(
  {
    datasetId: String, // OpenNeuro id
    user: { _id: String },
    annexKey: String,
  },
  { timestamps: { createdAt: 'created_at' } },
)

const RemovedAnnexObject = mongoose.model(
  'RemovedAnnexObject',
  removedAnnexObject,
)

export default RemovedAnnexObject
