import mongoose, { Document } from "mongoose"
const { Schema, model } = mongoose

export interface CounterDocument extends Document {
  _id: string
  sequence_value: number
}
const countersSchema = new Schema({
  _id: { type: String },
  sequence_value: { type: Number, default: 0 },
})

const Counter = model<CounterDocument>("Counter", countersSchema)

export default Counter
