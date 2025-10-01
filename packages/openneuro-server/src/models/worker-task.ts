import mongoose from "mongoose"
import type { Document } from "mongoose"
const { Schema, model } = mongoose

export interface WorkerTaskDocument extends Document {
  id: string
  args?: Record<string, unknown>
  kwargs?: Record<string, unknown>
  taskName?: string
  worker?: string
  queuedAt?: Date
  startedAt?: Date
  finishedAt?: Date
  error?: string
  executionTime?: number
}

const workerTaskSchema = new Schema({
  id: { type: String, required: true, unique: true },
  args: { type: Object },
  kwargs: { type: Object },
  taskName: { type: String },
  worker: { type: String },
  queuedAt: { type: Date },
  startedAt: { type: Date },
  finishedAt: { type: Date },
  error: { type: String },
  executionTime: { type: Number },
})

workerTaskSchema.index({ id: 1 })

const WorkerTaskModel = model<WorkerTaskDocument>(
  "WorkerTask",
  workerTaskSchema,
)

export default WorkerTaskModel
