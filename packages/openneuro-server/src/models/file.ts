import mongoose, { Document } from "mongoose"
const { Schema, model } = mongoose

export interface FileDocument extends Document {
  datasetId: string
  tag: string
  files: any[]
}

const fileSchema = new Schema({
  datasetId: { type: String, required: true },
  tag: { type: String, required: true },
  files: Array,
})

const File = model<FileDocument>("File", fileSchema)

export default File
