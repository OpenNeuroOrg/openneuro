import mongoose from "mongoose"
import type { Document } from "mongoose"
import type { DoiState } from "../types/datacite"
const { Schema, model } = mongoose

export interface DoiDocument extends Document {
  datasetId: string
  snapshotId: string
  doi: string
  state: DoiState
}

const doiSchema = new Schema({
  datasetId: String,
  snapshotId: String,
  doi: String,
  state: {
    type: String,
    enum: ["draft", "registered", "findable"],
    default: "draft",
  },
})

const Doi = model<DoiDocument>("Doi", doiSchema)

export default Doi
