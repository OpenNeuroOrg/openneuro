import { vi } from "vitest"
import { MongoMemoryServer } from "mongodb-memory-server"
import { connect } from "mongoose"
import request from "superagent"
import * as ds from "../dataset"

vi.mock("superagent")
vi.mock("ioredis")
vi.mock("../../../config.ts")
vi.mock("../../../libs/notifications.ts")

describe("dataset resolvers", () => {
  let mongod
  beforeAll(async () => {
    // Setup MongoDB with mongodb-memory-server
    mongod = await MongoMemoryServer.create()
    connect(mongod.getUri())
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
    beforeEach(() => {
      request.post.mockClear()
    })
    it("makes correct delete call to datalad", () => {
      // capture and check datalad delete request
      request.del = (url) => ({
        set: (header1, headerValue1) => ({
          set: () => ({
            send: ({ filenames }) => {
              expect(url).toEqual("http://datalad-0/datasets/ds999999/files")
              expect(filenames).toEqual([":sub-99"])
              expect(header1).toEqual("Cookie")
              expect(headerValue1).toMatch(/^accessToken=/)
            },
          }),
        }),
      })

      return ds.deleteFiles(
        null,
        { datasetId: "ds999999", files: [{ path: "/sub-99" }] },
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
    })
  })
})
