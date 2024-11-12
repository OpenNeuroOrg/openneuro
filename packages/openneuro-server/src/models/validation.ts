import mongoose from "mongoose"
import type { Document } from "mongoose"
const { Schema, model } = mongoose

export interface ValidatorMetadata {
  validator: string
  version: string
}

export interface ValidatorCodeMessages {
  code: string
  message: string
}

export interface ValidatorIssue {
  code: string
  subCode?: string
  location?: string
  severity?: "error" | "warning"
  rule?: string
}

/**
 * Schema validator output collection
 */
export interface ValidationDocument extends Document {
  id: string
  datasetId: string
  issues: ValidatorIssue[]
  codeMessages: ValidatorCodeMessages
  validatorMetadata: ValidatorMetadata
}

const issueSchema = new Schema({
  id: { type: String, required: true },
  datasetId: { type: String, required: true },
  issues: [{
    code: String,
    subCode: String,
    location: String,
    severity: String,
    rule: String,
  }],
  codeMessages: [
    {
      code: String,
      message: String,
    },
  ],
  validatorMetadata: {
    validator: String,
    version: String,
  },
})

const Validation = model<ValidationDocument>("Validation", issueSchema)

export default Validation
