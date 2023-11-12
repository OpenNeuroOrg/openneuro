import mongoose, { Document } from "mongoose"
const { Schema, model } = mongoose

export interface SubscriptionDocument extends Document {
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
