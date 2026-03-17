import * as Sentry from "@sentry/node"
import Dataset from "../models/dataset"
import SchedulerState from "../models/schedulerState"
import { queueDataRetentionCheck } from "./producer-methods"

const DAY_MS = 24 * 60 * 60 * 1000
const POLL_INTERVAL_MS = 30 * 60 * 1000 // Check every 30 minutes
const SCHEDULER_KEY = "dataRetentionScan"

/**
 * Iterate over all datasets and enqueue any per dataset actions.
 */
async function enqueueAllDatasetChecks(): Promise<void> {
  const cursor = Dataset.find({}, "id").cursor()
  for await (const dataset of cursor) {
    // Check data retention policy status and send notifications
    queueDataRetentionCheck(dataset.id)
  }
}

/**
 * Attempt to atomically claim the daily data retention scan run.
 * Returns true if this instance successfully claimed the run.
 */
async function claimDailyRun(): Promise<boolean> {
  const threshold = new Date(Date.now() - DAY_MS)
  const result = await SchedulerState.findOneAndUpdate(
    {
      key: SCHEDULER_KEY,
      $or: [{ lastRun: null }, { lastRun: { $lt: threshold } }],
    },
    { $set: { lastRun: new Date() } },
    { upsert: true, new: false, rawResult: true },
  ).catch((err) => {
    // Duplicate key on upsert race — another instance just claimed it
    if (err.code === 11000) return null
    throw err
  })
  if (!result) return false
  return (
    result.lastErrorObject?.updatedExisting === true ||
    result.lastErrorObject?.upserted != null
  )
}

async function runDailyCheck(): Promise<void> {
  const claimed = await claimDailyRun()
  if (!claimed) return
  await enqueueAllDatasetChecks()
}

/**
 * Start the daily per dataset check schedule.
 * Polls every 30 minutes; uses a MongoDB distributed lock so only one server
 * instance runs the scan per day, durable across restarts.
 */
export function startDailySchedule(): void {
  const run = () => {
    runDailyCheck().catch((err) => {
      Sentry.captureException(err)
    })
  }

  // Check shortly after startup, then poll every 30 minutes
  setTimeout(run, 60 * 1000)
  setInterval(run, POLL_INTERVAL_MS)
}
