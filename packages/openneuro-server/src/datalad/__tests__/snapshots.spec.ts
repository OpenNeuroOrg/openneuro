import { vi } from "vitest"
vi.mock("ioredis")
import { MongoMemoryServer } from "mongodb-memory-server"
import request from "superagent"
import { createDataset } from "../dataset"
import { createSnapshot, downloadFiles } from "../snapshots"
import { getDatasetWorker } from "../../libs/datalad-service"
import { connect } from "mongoose"
import Dataset from "../../models/dataset"

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
vi.mock("../../libs/events.ts")

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

  describe("downloadFiles()", () => {
    const datasetId = "ds000001"
    const tag = "1.0.0"
    const workerUrl = `http://${
      getDatasetWorker(datasetId)
    }/datasets/${datasetId}/tree/${tag}?recursive=true`

    beforeEach(() => {
      vi.spyOn(Dataset, "findOne").mockImplementation(() =>
        ({
          lean: () => ({ exec: () => Promise.resolve({ public: true }) }),
        }) as any
      )
    })

    afterEach(() => {
      vi.restoreAllMocks()
    })

    it("returns the parsed JSON body on a successful response", async () => {
      const mockFiles = [
        { filename: "sub-01/anat/T1w.nii.gz", size: 1234 },
        { filename: "dataset_description.json", size: 56 },
      ]
      vi.spyOn(globalThis, "fetch").mockResolvedValue(
        new Response(JSON.stringify(mockFiles), { status: 200 }),
      )
      const result = await downloadFiles(datasetId, tag)
      expect(result).toEqual(mockFiles)
      expect(globalThis.fetch).toHaveBeenCalledWith(workerUrl, {
        signal: expect.any(AbortSignal),
      })
    })

    it("returns null when the worker responds with 202 (cache populating)", async () => {
      vi.spyOn(globalThis, "fetch").mockResolvedValue(
        new Response(null, { status: 202 }),
      )
      const result = await downloadFiles(datasetId, tag)
      expect(result).toBeNull()
    })

    it("throws when the worker responds with a non-ok status", async () => {
      vi.spyOn(globalThis, "fetch").mockResolvedValue(
        new Response("Internal Server Error", { status: 500 }),
      )
      await expect(downloadFiles(datasetId, tag)).rejects.toThrow(
        "Failed to fetch downloadFiles for ds000001:1.0.0 (500)",
      )
    })

    it("returns null for non-public datasets", async () => {
      vi.spyOn(Dataset, "findOne").mockImplementation(() =>
        ({
          lean: () => ({ exec: () => Promise.resolve({ public: false }) }),
        }) as any
      )
      const result = await downloadFiles(datasetId, tag)
      expect(result).toBeNull()
    })
  })
})
