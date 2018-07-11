/**
 * Migrate all user content to generic user ids
 *
 * These items are migrated here:
 * Comments, Datasets, Jobs, Stars, Subscriptions
 */
import path from 'path'
import mongo from '../libs/mongo.js'
import User from '../models/user.js'

const c = mongo.collections

export default {
  id: path.basename(module.filename),
  update: async () => {
    const users = await User.find()
    for (const user of users) {
      c.crn.comments.updateMany(
        { 'user._id': user.providerId },
        { $set: { 'user._id': user.id } },
      )
      c.crn.datasets.updateMany(
        { uploader: user.providerId },
        { $set: { uploader: user.id } },
      )
      c.crn.jobs.updateMany(
        { userId: user.providerId },
        { $set: { userId: user.id } },
      )
      c.crn.stars.updateMany(
        { userId: user.providerId },
        { $set: { userId: user.id } },
      )
      c.crn.subscriptions.updateMany(
        { userId: user.providerId },
        { $set: { userId: user.id } },
      )
    }
  },
}
