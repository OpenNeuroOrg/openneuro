import mongoose from "mongoose"
import type { Document } from "mongoose"
const { Schema, model } = mongoose

export interface FileCheckDocument extends Document {
  datasetId: string
  hexsha: string
  refs: string[]
  remote: string
  annexFsck: {
    command: string
    "error-messages": string[]
    file: string
    key: string
    note: string
    success: boolean
  }[]
}

const fileCheckSchema = new Schema({
  datasetId: { type: String, required: true },
  hexsha: { type: String, required: true },
  refs: { type: [String], required: true },
  remote: { type: String, default: "local", required: true },
  annexFsck: [{
    command: String,
    "error-messages": [String],
    file: String,
    key: String,
    note: String,
    success: Boolean,
  }],
})

const FileCheck = model<FileCheckDocument>("File", fileCheckSchema)

export default FileCheck
