import mongoose from 'mongoose'

const starSchema = new mongoose.Schema({
  datasetId: { type: String, required: true },
})

starSchema.virtual('user', {
  ref: 'User',
  localField: 'userId',
  foreignField: 'id',
  justOne: true,
})

const Star = mongoose.model('Star', starSchema)

export default Star
