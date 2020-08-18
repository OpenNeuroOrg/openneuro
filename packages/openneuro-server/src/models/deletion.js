import mongoose from 'mongoose'

const deletion = new mongoose.Schema(
  {
    datasetId: String, // OpenNeuro id
    user: { _id: String },
    reason: String,
    redirect: String,
  },
  { timestamps: { createdAt: 'created_at' } },
)

const Deletion = mongoose.model('Deletion', deletion)

export default Deletion
