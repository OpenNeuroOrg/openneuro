import mongoose from 'mongoose'

const fileSchema = new mongoose.Schema({
  datasetId: { type: String, required: true },
  tag: { type: String, required: true },
  files: Array,
})

const File = mongoose.model('File', fileSchema)

export default File
