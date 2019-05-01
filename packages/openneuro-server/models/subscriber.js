import mongoose from 'mongoose'

const subscriberSchema = new mongoose.Schema({
  created: { type: Date, default: Date.now },
  email: String,
})

const Subscriber = mongoose.model('Subscriber', subscriberSchema)

export default Subscriber
