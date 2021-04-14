import mongoose, { Document } from 'mongoose'
const { Schema, model } = mongoose

export interface AnalyticsDocument extends Document {
  datasetId: string
  tag: string
  type: string
  downloads: number
  view: number
}

const analyticsSchema = new Schema({
  datasetId: { type: String, required: true },
  tag: { type: String, required: false },
  type: { type: String, required: true },
  downloads: { type: Number, required: false },
  views: { type: Number, required: false },
})

const Analytics = model<AnalyticsDocument>('Analytics', analyticsSchema)

export default Analytics
