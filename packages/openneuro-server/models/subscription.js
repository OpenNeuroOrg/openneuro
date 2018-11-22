import mongoose from 'mongoose'

const subscriptionSchema = new mongoose.Schema({
  datasetId: { type: String, required: true },
  userId: { type: String, required: true },
})

const Subscription = mongoose.model('Subscription', subscriptionSchema)

export default Subscription
