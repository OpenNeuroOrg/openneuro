import mongoose, { Document } from "mongoose"
const { Schema, model } = mongoose

export interface NewsletterDocument extends Document {
  created: Date
  email: string
}

/* Newsletter email listing */
const newsletterSchema = new Schema({
  created: { type: Date, default: Date.now },
  email: {
    type: "string",
    required: true,
    unique: true,
  },
})

const Newsletter = model<NewsletterDocument>("Newsletter", newsletterSchema)

export default Newsletter
