import mongoose from "mongoose"
import User from "../../models/user"
import UserMigration from "../../models/userMigration"
import Dataset from "../../models/dataset"
import Permission from "../../models/permission"
import Comment from "../../models/comment"
import Deletion from "../../models/deletion"
import * as Sentry from "@sentry/node"

/**
 * Move content from a Google account to an ORCID one
 *
 * Automatic rollback and error reporting if anything here fails
 *
 * Records the migration steps taken in the UserMigration model
 *
 * @param orcid ORCID iD of the user's primary account
 * @param userId Account being merged with the ORCID account
 */
export async function userMigration(orcid: string, userId: string) {
  const session = await mongoose.startSession()
  try {
    await session.withTransaction(async () => {
      try {
        // Load both original records
        const orcidUser = await User.findOne({
          providerId: orcid,
          provider: "orcid",
        })
        const googleUser = await User.findOne({
          id: userId,
          provider: "google",
        })

        // Save the original user records
        const migration = new UserMigration({ session })
        migration.users.push(orcidUser.toObject())
        migration.users.push(googleUser.toObject())
        await migration.save({ session })

        // Migrate dataset ownership
        const datasets = await Dataset.find({ uploader: googleUser.id }, {
          session,
        })
        for (const dataset of datasets) {
          dataset.uploader = orcidUser.id
          // Record this dataset uploader as migrated
          migration.datasets.push(dataset.id)
          await dataset.save({ session })
        }

        // Migrate dataset permissions
        const permissions = await Permission.find({ userId: googleUser.id }, {
          session,
        })
        for (const permission of permissions) {
          permission.userId = orcidUser.id
          // Record this permission as migrated
          migration.permissions.push(permission.toObject())
          await permission.save({ session })
        }

        // Migrate dataset deletions
        const deletions = await Deletion.find({ userId: googleUser.id }, {
          session,
        })
        for (const deletion of deletions) {
          deletion.user._id = orcidUser.id
          // Record this deletion as migrated
          migration.deletions.push(deletion.toObject())
          await deletion.save({ session })
        }

        // Migrate comments
        const comments = await Comment.find({ userId: googleUser.id }, {
          session,
        })
        for (const comment of comments) {
          comment.user._id = orcidUser.id
          // Record this comment as migrated
          migration.comments.push(comment.toObject())
          await comment.save({ session })
        }

        // Migrate admin permissions if different
        if (googleUser.admin) {
          orcidUser.admin = true
        }
        // If either account is blocked should we even migrate?
        if (googleUser.blocked) {
          orcidUser.blocked = true
        }
        await orcidUser.save({ session })
        googleUser.migrated = true
        await googleUser.save({ session })
        // Save success
        migration.success = true
        await migration.save({ session })
      } catch (err) {
        Sentry.captureException(err)
        throw err
      }
    })
  } finally {
    await session.endSession()
  }
}
