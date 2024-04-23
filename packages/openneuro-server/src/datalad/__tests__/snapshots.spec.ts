import { vi } from "vitest"
vi.mock("ioredis")
import { MongoMemoryServer } from "mongodb-memory-server"
import request from "superagent"
import { createDataset } from "../dataset"
import { createSnapshot } from "../snapshots"
import { getDatasetWorker } from "../../libs/datalad-service"
import { connect } from "mongoose"

// Mock requests to Datalad service
vi.mock("superagent")
vi.mock("../../libs/redis.js", () => ({
  redis: {
    del: vi.fn(),
  },
  redlock: {
    lock: vi.fn().mockImplementation(() => ({ unlock: vi.fn() })),
  },
}))
// Mock draft files calls
vi.mock("../draft.ts", () => ({
  updateDatasetRevision: () => () => Promise.resolve(),
}))
vi.mock("../../config.ts")
vi.mock("../../libs/notifications.ts")

describe("snapshot model operations", () => {
  describe("createSnapshot()", () => {
    let mongod
    beforeAll(async () => {
      // Setup MongoDB with mongodb-memory-server
      mongod = await MongoMemoryServer.create()
      connect(mongod.getUri())
    })
    it("posts to the DataLad /datasets/{dsId}/snapshots/{snapshot} endpoint", async () => {
      const user = { id: "1234" }
      const tag = "snapshot"
      const { id: dsId } = await createDataset(user.id, user, {
        affirmedDefaced: true,
        affirmedConsent: true,
      })
      // Reset call count for request.post
      request.post.mockClear()
      request.__setMockResponse({ body: {} })
      await createSnapshot(dsId, tag, false)
      expect(request.post).toHaveBeenCalledTimes(1)
      expect(request.post).toHaveBeenCalledWith(
        expect.stringContaining(
          `${getDatasetWorker(dsId)}/datasets/${dsId}/snapshots/${tag}`,
        ),
      )
    })
  })
})
