import config from "../config"
import notifications from "../libs/notifications"
import User from "../models/user"
import Permission from "../models/permission"
import DataRetention from "../models/dataRetention"
import Deletion from "../models/deletion"
import { getDraftInfo } from "./draft"
import { getSnapshots } from "./snapshots"
import { draftRetentionWarning } from "../libs/email/templates/draft-retention-warning"
import { draftRetentionDeletion } from "../libs/email/templates/draft-retention-deletion"
import { snapshotReminder } from "../libs/email/templates/snapshot-reminder"

const DAY = 24 * 60 * 60 * 1000

/**
 * Notify all users with write or admin access to a dataset.
 */
async function notifyWriteUsers(
  datasetId: string,
  makeEmail: (user: { _id: string; email: string; name: string }) => object,
) {
  const permissions = await Permission.find({
    datasetId,
    level: { $in: ["rw", "admin"] },
  }).exec()
  for (const permission of permissions) {
    const user = await User.findOne({ id: permission.userId }).exec()
    if (user) {
      notifications.send(makeEmail(user))
    }
  }
}

/**
 * Check and send data retention notifications for a dataset.
 *
 * Retention warnings (14-day, 7-day, deletion) are tied to the current draft
 * hexsha and reset whenever the draft changes. The no-snapshot 24h notice is
 * sent once regardless of future draft changes.
 */
export async function checkDataRetentionNotifications(
  datasetId: string,
): Promise<void> {
  // Skip datasets that have been marked as deleted
  const deleted = await Deletion.findOne({ datasetId }).exec()
  if (deleted) return

  const draft = await getDraftInfo(datasetId)
  const snapshots = await getSnapshots(datasetId)
  const lastSnapshot = snapshots?.length
    ? snapshots[snapshots.length - 1]
    : null

  // Draft is in sync with the last snapshot — no retention action needed
  if (lastSnapshot && draft.hexsha === lastSnapshot.hexsha) {
    return
  }

  const now = new Date()
  const age = now.getTime() - new Date(draft.modified).getTime()

  // Upsert the retention record, resetting retention notices on hexsha change
  let record = await DataRetention.findOne({ datasetId }).exec()
  if (!record) {
    record = await DataRetention.create({ datasetId, hexsha: draft.hexsha })
  } else if (record.hexsha !== draft.hexsha) {
    await DataRetention.updateOne(
      { datasetId },
      {
        hexsha: draft.hexsha,
        notifiedAt14Days: null,
        notifiedAt7Days: null,
        notifiedAtDeletion: null,
      },
    ).exec()
    record = await DataRetention.findOne({ datasetId }).exec()
  }

  // One-time notice: no snapshot created within 24h of initial upload
  if (
    !lastSnapshot && age >= DAY && age < 14 * DAY && !record.notifiedNoSnapshot
  ) {
    await notifyWriteUsers(datasetId, (user) => ({
      _id: `${datasetId}_${user._id}_no_snapshot_reminder`,
      type: "email",
      email: {
        to: user.email,
        name: user.name,
        subject: "Reminder: Create a Snapshot",
        html: snapshotReminder({
          name: user.name,
          datasetName: datasetId,
          datasetId,
          siteUrl: config.url,
        }),
      },
    }))
    await DataRetention.updateOne({ datasetId }, { notifiedNoSnapshot: now })
      .exec()
  }

  // Retention warnings sent in order from 14 days, 7 days, and 0 days.
  if (age >= 14 * DAY && !record.notifiedAt14Days) {
    await notifyWriteUsers(datasetId, (user) => ({
      _id: `${datasetId}_${user._id}_retention_14day`,
      type: "email",
      email: {
        to: user.email,
        name: user.name,
        subject: "Dataset Draft Deletion Warning: 14 Days Remaining",
        html: draftRetentionWarning({
          name: user.name,
          datasetId,
          daysRemaining: 14,
          siteUrl: config.url,
        }),
      },
    }))
    await DataRetention.updateOne({ datasetId }, { notifiedAt14Days: now })
      .exec()
  } else if (
    record.notifiedAt14Days &&
    !record.notifiedAt7Days &&
    now.getTime() - new Date(record.notifiedAt14Days).getTime() >= 7 * DAY
  ) {
    await notifyWriteUsers(datasetId, (user) => ({
      _id: `${datasetId}_${user._id}_retention_7day`,
      type: "email",
      email: {
        to: user.email,
        name: user.name,
        subject: "Dataset Draft Deletion Warning: 7 Days Remaining",
        html: draftRetentionWarning({
          name: user.name,
          datasetId,
          daysRemaining: 7,
          siteUrl: config.url,
        }),
      },
    }))
    await DataRetention.updateOne({ datasetId }, { notifiedAt7Days: now })
      .exec()
  } else if (
    record.notifiedAt7Days &&
    !record.notifiedAtDeletion &&
    now.getTime() - new Date(record.notifiedAt7Days).getTime() >= 7 * DAY
  ) {
    await notifyWriteUsers(datasetId, (user) => ({
      _id: `${datasetId}_${user._id}_retention_deletion`,
      type: "email",
      email: {
        to: user.email,
        name: user.name,
        subject: "Dataset Draft Pending Deletion",
        html: draftRetentionDeletion({
          name: user.name,
          datasetId,
          siteUrl: config.url,
        }),
      },
    }))
    await DataRetention.updateOne({ datasetId }, { notifiedAtDeletion: now })
      .exec()
  }
}
