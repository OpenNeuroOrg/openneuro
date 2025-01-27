import mongoose from "mongoose"
import type { Document } from "mongoose"
const { Schema, model } = mongoose

export interface SubscriptionDocument extends Document {
  _id: string
  datasetId: string
  userId: string
}

const subscriptionSchema = new Schema({
  datasetId: { type: String, required: true },
  userId: { type: String, required: true },
})

const Subscription = model<SubscriptionDocument>(
  "Subscription",
  subscriptionSchema,
)

export default Subscription
