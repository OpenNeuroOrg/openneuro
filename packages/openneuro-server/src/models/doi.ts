import mongoose, { Document } from "mongoose"
const { Schema, model } = mongoose

export interface DoiDocument extends Document {
  datasetId: string
  snapshotId: string
  doi: string
}

const doiSchema = new Schema({
  datasetId: String,
  snapshotId: String,
  doi: String,
})

const Doi = model<DoiDocument>("Doi", doiSchema)

export default Doi
