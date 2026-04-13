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
    await queueDataRetentionCheck(dataset.id)
  }
}

/**
 * Ensure the scheduler state document exists in MongoDB.
 */
async function initSchedulerState(): Promise<void> {
  try {
    await SchedulerState.updateOne(
      { key: SCHEDULER_KEY },
      { $setOnInsert: { lastRun: null } },
      { upsert: true },
    )
  } catch (err) {
    // Ignore duplicate key errors on insert race condition
    if (!(err instanceof Error && "code" in err && err.code === 11000)) {
      throw err
    }
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
    { new: true },
  )
  return result !== null
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
export async function startDailySchedule(): Promise<void> {
  const run = () => {
    runDailyCheck().catch((err) => {
      Sentry.captureException(err)
      // eslint-disable-next-line no-console
      console.error(err)
    })
  }

  await initSchedulerState()

  // Check shortly after startup, then poll every 30 minutes
  setTimeout(run, 60 * 1000)
  setInterval(run, POLL_INTERVAL_MS)
}
