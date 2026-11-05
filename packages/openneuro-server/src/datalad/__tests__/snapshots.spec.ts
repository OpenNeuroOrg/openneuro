import { vi } from "vitest"
vi.mock("ioredis")
import { MongoMemoryServer } from "mongodb-memory-server"
import { createDataset } from "../dataset"
import { createSnapshot } from "../snapshots"
import { getDatasetWorker } from "../../libs/datalad-service"
import { connect } from "mongoose"

// Mock requests to Datalad service
vi.mock("../../libs/redis.js", () => ({
  getRedis: () => ({
    del: vi.fn(),
  }),
  getRedlock: () => ({
    lock: vi.fn().mockImplementation(() => ({ unlock: vi.fn() })),
  }),
}))
// Mock draft files calls
vi.mock("../draft.ts", () => ({
  updateDatasetRevision: () => () => Promise.resolve(),
}))
vi.mock("../files.ts", () => ({
  getFiles: () => Promise.resolve([]),
}))
vi.mock("../../config.ts")
vi.mock("../../libs/notifications.ts")
vi.mock("../../libs/events.ts")

const fetchMock = vi.fn()

describe("snapshot model operations", () => {
  describe("createSnapshot()", () => {
    let mongod
    beforeAll(async () => {
      // Setup MongoDB with mongodb-memory-server
      mongod = await MongoMemoryServer.create()
      connect(mongod.getUri())
    })
    beforeEach(() => {
      fetchMock.mockReset()
      fetchMock.mockResolvedValue({
        ok: true,
        json: async () => ({}),
      })
      vi.stubGlobal("fetch", fetchMock)
    })
    afterEach(() => {
      vi.unstubAllGlobals()
    })
    it("posts to the DataLad /datasets/{dsId}/snapshots/{snapshot} endpoint", async () => {
      const user = { id: "1234", userId: "1234", admin: false }
      const tag = "snapshot"
      const { id: dsId } = await createDataset(user.id, user, {
        affirmedDefaced: true,
        affirmedConsent: true,
      })
      fetchMock.mockClear()
      await createSnapshot(dsId, tag, false)
      expect(fetchMock).toHaveBeenCalledWith(
        expect.stringContaining(
          `http://${getDatasetWorker(dsId)}/datasets/${dsId}/snapshots/${tag}`,
        ),
        expect.objectContaining({ method: "POST" }),
      )
    })
  })
})
