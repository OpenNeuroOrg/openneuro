import { vi } from "vitest"
import { connect } from "mongoose"
import { deleteComment, flatten } from "../resolvers/comment"
import Comment from "../../models/comment"

vi.mock("ioredis")

describe("comment resolver helpers", () => {
  describe("deleteComment", () => {
    let aId
    const adminUser = {
      user: "1234",
      userInfo: { admin: true },
    }
    const nonAdminUser = {
      user: "5678",
      userInfo: { admin: false },
    }
    beforeAll(async () => {
      await connect(globalThis.__MONGO_URI__)
      const comment = new Comment({
        text: "a",
        createDate: new Date().toISOString(),
        user: { id: "5678" },
      })
      await comment.save()
      aId = comment.id
    })

    it("returns an array of the deleted comment ids", async () => {
      const deletedIds = (
        await deleteComment({}, { commentId: aId }, adminUser)
      ).map((id) => id.toString())
      expect(deletedIds[0]).toEqual(aId)
    })

    it("prevents non-admin users from deleting comments", () => {
      return expect(
        deleteComment({}, { commentId: aId }, nonAdminUser),
      ).rejects.toMatch("You do not have admin access to this dataset.")
    })
  })

  describe("flatten", () => {
    it("unrolls an array", () => {
      const arrarr = [
        [1, 2, 3],
        [4, 5],
      ]
      const arr = flatten(arrarr)
      expect(arr).toEqual([1, 2, 3, 4, 5])
    })
  })
})
