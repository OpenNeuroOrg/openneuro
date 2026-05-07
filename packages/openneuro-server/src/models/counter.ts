import mongoose from "mongoose"
import type { Document } from "mongoose"
const { Schema, model } = mongoose

export interface CounterDocument extends Document {
  sequence_value: number
}
const countersSchema = new Schema({
  sequence_value: { type: Number, default: 0 },
})

const Counter = model<CounterDocument>("Counter", countersSchema)

export default Counter
