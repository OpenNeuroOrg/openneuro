import mongoose from "mongoose"
import type { Document } from "mongoose"
const { Schema, model } = mongoose

export type NotificationStatusType = "UNREAD" | "SAVED" | "ARCHIVED"

export interface UserNotificationStatusDocument extends Document {
  _id: string
  userId: string
  datasetEventId: string
  status: NotificationStatusType
  createdAt: Date
  updatedAt: Date
}

const userNotificationStatusSchema = new Schema<UserNotificationStatusDocument>(
  {
    userId: { type: String, ref: "User", required: true },
    datasetEventId: { type: String, ref: "DatasetEvent", required: true },
    status: {
      type: String,
      enum: ["UNREAD", "SAVED", "ARCHIVED"],
      default: "UNREAD",
      required: true,
    },
  },
  { timestamps: true },
)

userNotificationStatusSchema.index({ userId: 1, datasetEventId: 1 }, {
  unique: true,
})

export const UserNotificationStatus = model<UserNotificationStatusDocument>(
  "UserNotificationStatus",
  userNotificationStatusSchema,
)
