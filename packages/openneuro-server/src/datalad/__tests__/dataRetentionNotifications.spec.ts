import { vi } from "vitest"

vi.mock("ioredis")
vi.mock("../../config.ts")
vi.mock("../../libs/notifications.ts", () => ({
  default: { send: vi.fn() },
}))
vi.mock("../../libs/email/templates/draft-retention-warning", () => ({
  draftRetentionWarning: vi.fn(() => "<html>warning</html>"),
}))
vi.mock("../../libs/email/templates/draft-retention-deletion", () => ({
  draftRetentionDeletion: vi.fn(() => "<html>deletion</html>"),
}))
vi.mock("../../libs/email/templates/snapshot-reminder", () => ({
  snapshotReminder: vi.fn(() => "<html>snapshot</html>"),
}))

import { MongoMemoryServer } from "mongodb-memory-server"
import { connect, disconnect } from "mongoose"
import notifications from "../../libs/notifications"
import DataRetention from "../../models/dataRetention"
import Permission from "../../models/permission"
import User from "../../models/user"
import { checkDataRetentionNotifications } from "../dataRetentionNotifications"
import * as draftModule from "../draft"
import * as snapshotsModule from "../snapshots"

const DAY = 24 * 60 * 60 * 1000

const TEST_DATASET = "ds000001"
const TEST_HEXSHA = "abc123"
const TEST_USER = {
  id: "user1",
  email: "test@example.com",
  name: "Test User",
}

function daysAgo(days: number): Date {
  return new Date(Date.now() - days * DAY)
}

describe("checkDataRetentionNotifications", () => {
  let mongod: MongoMemoryServer

  beforeAll(async () => {
    mongod = await MongoMemoryServer.create()
    await connect(mongod.getUri())
  })

  afterAll(async () => {
    await disconnect()
    await mongod.stop()
  })

  beforeEach(async () => {
    await DataRetention.deleteMany({})
    await Permission.deleteMany({})
    await User.deleteMany({})
    vi.mocked(notifications.send).mockClear()

    // Seed a user with write permission
    await User.create(TEST_USER)
    await Permission.create({
      datasetId: TEST_DATASET,
      userId: TEST_USER.id,
      level: "rw",
    })
  })

  function mockDraft(modified: Date, hexsha = TEST_HEXSHA) {
    vi.spyOn(draftModule, "getDraftInfo").mockResolvedValue({
      modified,
      hexsha,
    } as any)
  }

  function mockSnapshots(snapshots: { hexsha: string }[] = []) {
    vi.spyOn(snapshotsModule, "getSnapshots").mockResolvedValue(
      snapshots as any,
    )
  }

  it("does nothing when draft matches the latest snapshot", async () => {
    mockDraft(daysAgo(30), TEST_HEXSHA)
    mockSnapshots([{ hexsha: TEST_HEXSHA }])

    await checkDataRetentionNotifications(TEST_DATASET)
    expect(notifications.send).not.toHaveBeenCalled()
  })

  it("does nothing when draft is less than 1 day old", async () => {
    mockDraft(new Date()) // just now
    mockSnapshots([])

    await checkDataRetentionNotifications(TEST_DATASET)
    expect(notifications.send).not.toHaveBeenCalled()
  })

  it("sends snapshot reminder after 1 day with no snapshot", async () => {
    mockDraft(daysAgo(2))
    mockSnapshots([])

    await checkDataRetentionNotifications(TEST_DATASET)
    expect(notifications.send).toHaveBeenCalledTimes(1)
    expect(notifications.send).toHaveBeenCalledWith(
      expect.objectContaining({
        _id: expect.stringContaining("no_snapshot_reminder"),
      }),
    )
  })

  it("skips snapshot reminder when draft is already 14+ days old", async () => {
    mockDraft(daysAgo(15))
    mockSnapshots([])

    await checkDataRetentionNotifications(TEST_DATASET)
    // Should send only the 14-day retention warning, not the snapshot reminder
    expect(notifications.send).toHaveBeenCalledTimes(1)
    expect(notifications.send).toHaveBeenCalledWith(
      expect.objectContaining({
        _id: expect.stringContaining("retention_14day"),
      }),
    )
  })

  it("sends 14-day warning when draft is 14+ days old", async () => {
    mockDraft(daysAgo(15))
    mockSnapshots([{ hexsha: "other" }])

    await checkDataRetentionNotifications(TEST_DATASET)
    expect(notifications.send).toHaveBeenCalledTimes(1)
    expect(notifications.send).toHaveBeenCalledWith(
      expect.objectContaining({
        _id: expect.stringContaining("retention_14day"),
      }),
    )
  })

  it("sends notices in order even when draft is already past 28 days", async () => {
    mockDraft(daysAgo(35))
    mockSnapshots([{ hexsha: "other" }])

    // First call: should send 14-day warning, NOT deletion
    await checkDataRetentionNotifications(TEST_DATASET)
    expect(notifications.send).toHaveBeenCalledTimes(1)
    expect(notifications.send).toHaveBeenCalledWith(
      expect.objectContaining({
        _id: expect.stringContaining("retention_14day"),
      }),
    )

    const record = await DataRetention.findOne({ datasetId: TEST_DATASET })
      .exec()
    expect(record.notifiedAt14Days).toBeTruthy()
    expect(record.notifiedAt7Days).toBeNull()
    expect(record.notifiedAtDeletion).toBeNull()
  })

  it("does not send 7-day warning until 7 days after 14-day notice", async () => {
    mockDraft(daysAgo(35))
    mockSnapshots([{ hexsha: "other" }])

    // Seed a 14-day notice sent only 3 days ago
    await DataRetention.create({
      datasetId: TEST_DATASET,
      hexsha: TEST_HEXSHA,
      notifiedAt14Days: daysAgo(3),
    })

    await checkDataRetentionNotifications(TEST_DATASET)
    // No new notice should be sent (14-day already sent, 7-day not due yet)
    expect(notifications.send).not.toHaveBeenCalled()
  })

  it("sends 7-day warning 7 days after 14-day notice", async () => {
    mockDraft(daysAgo(35))
    mockSnapshots([{ hexsha: "other" }])

    // Seed a 14-day notice sent 8 days ago
    await DataRetention.create({
      datasetId: TEST_DATASET,
      hexsha: TEST_HEXSHA,
      notifiedAt14Days: daysAgo(8),
    })

    await checkDataRetentionNotifications(TEST_DATASET)
    expect(notifications.send).toHaveBeenCalledTimes(1)
    expect(notifications.send).toHaveBeenCalledWith(
      expect.objectContaining({
        _id: expect.stringContaining("retention_7day"),
      }),
    )
  })

  it("sends deletion notice 7 days after 7-day warning", async () => {
    mockDraft(daysAgo(40))
    mockSnapshots([{ hexsha: "other" }])

    // Seed both prior notices
    await DataRetention.create({
      datasetId: TEST_DATASET,
      hexsha: TEST_HEXSHA,
      notifiedAt14Days: daysAgo(15),
      notifiedAt7Days: daysAgo(8),
    })

    await checkDataRetentionNotifications(TEST_DATASET)
    expect(notifications.send).toHaveBeenCalledTimes(1)
    expect(notifications.send).toHaveBeenCalledWith(
      expect.objectContaining({
        _id: expect.stringContaining("retention_deletion"),
      }),
    )
  })

  it("does not send deletion notice until 7 days after 7-day warning", async () => {
    mockDraft(daysAgo(40))
    mockSnapshots([{ hexsha: "other" }])

    await DataRetention.create({
      datasetId: TEST_DATASET,
      hexsha: TEST_HEXSHA,
      notifiedAt14Days: daysAgo(10),
      notifiedAt7Days: daysAgo(3),
    })

    await checkDataRetentionNotifications(TEST_DATASET)
    expect(notifications.send).not.toHaveBeenCalled()
  })

  it("resets retention notices when draft hexsha changes", async () => {
    mockDraft(daysAgo(15), "new_hexsha")
    mockSnapshots([{ hexsha: "other" }])

    // Pre-existing record with old hexsha and all notices sent
    await DataRetention.create({
      datasetId: TEST_DATASET,
      hexsha: "old_hexsha",
      notifiedAt14Days: daysAgo(10),
      notifiedAt7Days: daysAgo(3),
      notifiedAtDeletion: daysAgo(1),
    })

    await checkDataRetentionNotifications(TEST_DATASET)

    // Should send 14-day notice again (reset due to new hexsha)
    expect(notifications.send).toHaveBeenCalledTimes(1)
    expect(notifications.send).toHaveBeenCalledWith(
      expect.objectContaining({
        _id: expect.stringContaining("retention_14day"),
      }),
    )

    const record = await DataRetention.findOne({ datasetId: TEST_DATASET })
      .exec()
    expect(record.hexsha).toBe("new_hexsha")
    expect(record.notifiedAt14Days).toBeTruthy()
    expect(record.notifiedAt7Days).toBeNull()
    expect(record.notifiedAtDeletion).toBeNull()
  })

  it("walks through the full notification sequence with real delays", async () => {
    mockSnapshots([{ hexsha: "other" }])

    // Day 14: first warning
    mockDraft(daysAgo(15))
    await checkDataRetentionNotifications(TEST_DATASET)
    expect(notifications.send).toHaveBeenCalledTimes(1)
    expect(notifications.send).toHaveBeenLastCalledWith(
      expect.objectContaining({
        _id: expect.stringContaining("retention_14day"),
      }),
    )

    // Simulate 7 days passing by backdating the 14-day notice
    await DataRetention.updateOne(
      { datasetId: TEST_DATASET },
      { notifiedAt14Days: daysAgo(8) },
    ).exec()
    vi.mocked(notifications.send).mockClear()

    // Day 21: 7-day warning
    mockDraft(daysAgo(22))
    await checkDataRetentionNotifications(TEST_DATASET)
    expect(notifications.send).toHaveBeenCalledTimes(1)
    expect(notifications.send).toHaveBeenLastCalledWith(
      expect.objectContaining({
        _id: expect.stringContaining("retention_7day"),
      }),
    )

    // Simulate 7 more days passing
    await DataRetention.updateOne(
      { datasetId: TEST_DATASET },
      { notifiedAt7Days: daysAgo(8) },
    ).exec()
    vi.mocked(notifications.send).mockClear()

    // Day 28: deletion notice
    mockDraft(daysAgo(30))
    await checkDataRetentionNotifications(TEST_DATASET)
    expect(notifications.send).toHaveBeenCalledTimes(1)
    expect(notifications.send).toHaveBeenLastCalledWith(
      expect.objectContaining({
        _id: expect.stringContaining("retention_deletion"),
      }),
    )

    // No further notices after deletion
    vi.mocked(notifications.send).mockClear()
    await checkDataRetentionNotifications(TEST_DATASET)
    expect(notifications.send).not.toHaveBeenCalled()
  })
})
