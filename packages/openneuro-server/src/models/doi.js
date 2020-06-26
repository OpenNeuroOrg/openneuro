import mongoose from 'mongoose'

const doiSchema = new mongoose.Schema({
  datasetId: String,
  snapshotId: String,
  doi: String,
})

const Doi = mongoose.model('Doi', doiSchema)

export default Doi
