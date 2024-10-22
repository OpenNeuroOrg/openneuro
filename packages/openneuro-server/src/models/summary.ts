import mongoose from "mongoose"
import type { Document } from "mongoose"
const { Schema, model } = mongoose

export interface SummaryPetField {
  BodyPart: string[]
  ScannerManufacturer: string[]
  ScannerManufacturersModelName: string[]
  TracerName: string[]
  TracerRadionuclide: string[]
}

export interface SummaryDocument extends Document {
  id: string
  datasetId: string
  sessions: string[]
  subjects: string[]
  subjectMetadata: Record<string, any>
  tasks: string[]
  modalities: string[]
  primaryModality: string
  secondaryModalities: string[]
  dataTypes: string[]
  totalFiles: number
  size: number
  dataProcessed: boolean
  pet: SummaryPetField
  validatorMetadata: {
    validator: string
    version: string
  }
}

const summarySchema = new Schema({
  id: { type: String, required: true },
  datasetId: { type: String, required: true },
  sessions: [String],
  subjects: [String],
  subjectMetadata: Object,
  tasks: [String],
  modalities: [String],
  primaryModality: String,
  secondaryModalities: [String],
  dataTypes: [String],
  totalFiles: Number,
  size: Number,
  dataProcessed: Boolean,
  pet: {
    BodyPart: [String],
    ScannerManufacturer: [String],
    ScannerManufacturersModelName: [String],
    TracerName: [String],
    TracerRadionuclide: [String],
  },
  validatorMetadata: {
    validator: String,
    version: String,
  },
})

summarySchema.index({ id: 1 })

const Summary = model<SummaryDocument>("Summary", summarySchema)

export default Summary
