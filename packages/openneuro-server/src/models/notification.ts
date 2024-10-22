import mongoose from "mongoose"
import type { Document } from "mongoose"
const { Schema, model } = mongoose

export interface NotificationDocument extends Document {
  _id: string
  type: string
  email: {
    to: string
    from: string
    subject: string
    template: string
    html: string
    data: {
      name: string
      appName: string
      appLabel: string
      appVersion: string
      jobId: string
      startDate: string
      status: string
      snapshotId: string
      unsubscribeLink: string
      datasetId: string
      datasetName: string
      datasetLabel: string
      versionNumber: string
      dateCreated: string
      commentUserId: string
      commentId: string
      commentContent: string
      commentStatus: string
      changelog: string
      siteUrl: string
    }
  }
  notificationLock: Date
}

const notificationSchema = new Schema({
  _id: String,
  type: String,
  email: {
    to: String,
    from: String,
    subject: String,
    template: String,
    html: String,
    data: {
      name: String,
      appName: String,
      appLabel: String,
      appVersion: String,
      jobId: String,
      startDate: String,
      status: String,
      snapshotId: String,
      unsubscribeLink: String,
      datasetId: String,
      datasetName: String,
      datasetLabel: String,
      versionNumber: String,
      dateCreated: String,
      commentUserId: String,
      commentId: String,
      commentContent: String,
      commentStatus: String,
      changelog: String,
      siteUrl: String,
    },
  },
  notificationLock: { type: Date, default: null },
})

const Notification = model<NotificationDocument>(
  "Notification",
  notificationSchema,
)

export default Notification
