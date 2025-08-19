import mongoose from "mongoose"
import type { Document } from "mongoose"
const { Schema, model } = mongoose

// --- Interfaces ---
export type NotificationStatusType = "UNREAD" | "SAVED" | "ARCHIVED"

export interface UserNotificationStatusDocument extends Document {
  _id: string
  userId: mongoose.Types.ObjectId // Reference to User's _id
  datasetEventId: mongoose.Types.ObjectId // Reference to DatasetEvent's _id
  status: NotificationStatusType
  createdAt: Date
  updatedAt: Date
}

const userNotificationStatusSchema = new Schema({
  userId: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  datasetEventId: {
    type: Schema.Types.ObjectId,
    ref: "DatasetEvent",
    required: true,
  },
  status: {
    type: String,
    enum: ["UNREAD", "SAVED", "ARCHIVED"],
    default: "UNREAD",
    required: true,
  },
}, {
  timestamps: true,
})

// Add a compound unique index to ensure a user has only one status entry per unique event
userNotificationStatusSchema.index({ userId: 1, datasetEventId: 1 }, {
  unique: true,
})

export const UserNotificationStatus = model<UserNotificationStatusDocument>(
  "UserNotificationStatus",
  userNotificationStatusSchema,
)
