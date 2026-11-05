import { vi } from "vitest"
import { MongoMemoryServer } from "mongodb-memory-server"
import { connect } from "mongoose"
import * as ds from "../dataset"
import { getDatasetWorker } from "../../../libs/datalad-service"

vi.mock("ioredis")
vi.mock("../../../config.ts")
vi.mock("../../../libs/notifications.ts")

const fetchMock = vi.fn()

describe("dataset resolvers", () => {
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
  describe("createDataset()", () => {
    it("createDataset mutation succeeds", async () => {
      const { id: dsId } = await ds.createDataset(
        null,
        { affirmedDefaced: true, affirmedConsent: false },
        {
          user: "123456",
          userInfo: { id: "123456", userId: "123456", admin: false },
        },
      )
      expect(dsId).toEqual(expect.stringMatching(/^ds[0-9]{6}$/))
    })
  })
  describe("deleteFiles", () => {
    it("makes correct delete call to datalad", async () => {
      const { id: dsId } = await ds.createDataset(
        null,
        { affirmedDefaced: true, affirmedConsent: false },
        {
          user: "123456",
          userInfo: { id: "123456", userId: "123456", admin: false },
        },
      )
      fetchMock.mockClear()
      const deleted = await ds.deleteFiles(
        null,
        { datasetId: dsId, files: [{ path: "/sub-99" }] },
        {
          user: "a_user_id",
          userInfo: {
            // bypass permission checks
            id: "a_user_id",
            userId: "a_user_id",
            admin: true,
          },
        },
      )
      expect(deleted).toBe(true)
      expect(fetchMock).toHaveBeenCalledWith(
        `http://${getDatasetWorker(dsId)}/datasets/${dsId}/files`,
        expect.objectContaining({
          method: "DELETE",
          headers: expect.objectContaining({
            Cookie: expect.stringMatching(/^accessToken=/),
            Accept: "application/json",
            "Content-Type": "application/json",
          }),
          body: JSON.stringify({ filenames: [":sub-99"] }),
        }),
      )
    })
  })
})
