import mongoose, { Document } from 'mongoose'
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
  secondaryModalities: string[]
  dataTypes: string[]
  totalFiles: number
  size: number
  dataProcessed: boolean
  pet: SummaryPetField
}

const summarySchema = new Schema({
  id: { type: String, required: true },
  datasetId: { type: String, required: true },
  sessions: [String],
  subjects: [String],
  subjectMetadata: Object,
  tasks: [String],
  modalities: [String],
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
})

summarySchema.index({ id: 1 })

const Summary = model<SummaryDocument>('Summary', summarySchema)

export default Summary
