import mongoose from 'mongoose'

const notificationSchema = new mongoose.Schema({
  _id: String,
  type: String,
  email: {
    to: String,
    from: String,
    subject: String,
    template: String,
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
      lastName: String,
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
})

const Notification = mongoose.model('Notification', notificationSchema)

export default Notification
