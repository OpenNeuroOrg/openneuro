import mongoose from 'mongoose'

/* Newsletter email listing */
const newsletterSchema = new mongoose.Schema({
  created: { type: Date, default: Date.now },
  email: {
    type: 'string',
    required: true,
    unique: true,
  },
})

const Newsletter = mongoose.model('Newsletter', newsletterSchema)

export default Newsletter
