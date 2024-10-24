import { vi } from "vitest"
import { MongoMemoryServer } from "mongodb-memory-server"
import { connect } from "mongoose"
import { getAccessionNumber } from "../dataset"

vi.mock("ioredis")

describe("libs/dataset", () => {
  describe("getAccessionNumber", () => {
    let mongod
    beforeAll(async () => {
      // Setup MongoDB with mongodb-memory-server
      mongod = await MongoMemoryServer.create()
      await connect(mongod.getUri())
    })
    it('returns strings starting with "ds"', async () => {
      const ds = await getAccessionNumber()
      expect(ds.slice(0, 2)).toEqual("ds")
    })
    it("generates sequential numbers", async () => {
      const first = await getAccessionNumber()
      const second = await getAccessionNumber()
      const fNum = parseInt(first.slice(2))
      const sNum = parseInt(second.slice(2))
      expect(fNum).toBeLessThan(sNum)
    })
    it("returns 6 digits for ds ids", async () => {
      const ds = await getAccessionNumber()
      const num = ds.slice(2)
      expect(num).toHaveLength(6)
      expect(parseInt(num))
    })
  })
})
