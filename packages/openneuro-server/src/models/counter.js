import mongoose from 'mongoose'

const countersSchema = new mongoose.Schema({
  _id: { type: String },
  sequence_value: { type: Number, default: 0 },
})

const Counter = mongoose.model('Counter', countersSchema)

export default Counter
