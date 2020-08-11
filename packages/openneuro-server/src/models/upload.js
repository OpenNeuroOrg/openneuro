import uuid from 'uuid'
import mongoose from 'mongoose'

/**
 * Track state for uploads in progress
 *
 * newFiles excludes files in existing commits, as those are handled by other resolvers
 */
const uploadSchema = new mongoose.Schema({
  id: { type: String, required: true, default: uuid.v4 },
  datasetId: { type: String, required: true },
  files: Array,
  estimatedSize: Number,
  complete: { type: Boolean, default: false, required: true },
})

const Upload = mongoose.model('Upload', uploadSchema)

export default Upload
