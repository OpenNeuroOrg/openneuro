import mongoose from 'mongoose'

const badAnnexObject = new mongoose.Schema(
  {
    datasetId: String, // OpenNeuro id
    snapshot: String,
    annexKey: String,
    removed: { type: Boolean, default: false },
    remover: { _id: String },
    flagged: { type: Boolean, default: false },
    flagger: { _id: String },
  },
  { timestamps: { createdAt: 'created_at' } },
)

const BadAnnexObject = mongoose.model('BadAnnexObject', badAnnexObject)

export default BadAnnexObject
