import mongoose from 'mongoose'

const ObjectId = mongoose.Schema.Types.ObjectId

const badAnnexObject = new mongoose.Schema(
  {
    datasetId: String, // OpenNeuro id
    snapshot: String,
    filepath: String,
    annexKey: String,
    removed: { type: Boolean, default: false },
    remover: { type: ObjectId, ref: 'User' },
    flagged: { type: Boolean, default: false },
    flagger: { type: ObjectId, ref: 'User' },
  },
  { timestamps: { createdAt: 'created_at' } },
)

const BadAnnexObject = mongoose.model('BadAnnexObject', badAnnexObject)

export default BadAnnexObject
