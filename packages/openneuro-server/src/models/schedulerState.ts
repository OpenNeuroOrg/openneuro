import mongoose from "mongoose"
import type { Document } from "mongoose"
const { Schema, model } = mongoose

export interface SchedulerStateDocument extends Document {
  key: string
  lastRun: Date | null
}

const schedulerStateSchema = new Schema({
  key: { type: String, required: true, unique: true },
  lastRun: { type: Date, default: null },
})

/**
 * Coordinates last run of any scheduled tasks across multiple server instances
 */
const SchedulerState = model<SchedulerStateDocument>(
  "SchedulerState",
  schedulerStateSchema,
)

export default SchedulerState
