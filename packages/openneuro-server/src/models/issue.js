import mongoose from 'mongoose'

const issueSchema = new mongoose.Schema({
  id: { type: String, required: true },
  datasetId: { type: String, required: true },
  issues: Object,
})

const Issue = mongoose.model('Issue', issueSchema)

export default Issue
