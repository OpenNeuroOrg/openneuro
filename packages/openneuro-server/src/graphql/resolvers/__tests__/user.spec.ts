import { vi } from "vitest"
import { users } from "../user.js"
import { UserInfo } from "../user.js" // Import your UserInfo interface

vi.mock("ioredis")

describe("user resolvers", () => {
  describe("users()", () => {
    it("throws an error for non-admins when no filter is provided", () => {
      const mockUserInfo: UserInfo = { userId: "testId", admin: false } // Provide a non-admin userInfo

      expect(
        users(
          null,
          { isAdmin: null, isBlocked: false },
          { userInfo: mockUserInfo },
        ),
      ).rejects.toEqual(new Error("You must be a site admin to retrieve users"))
    })

    it("throws an error for non-admins when a filter is provided", () => {
      const mockUserInfo: UserInfo = { userId: "testId", admin: false } // Provide a non-admin userInfo

      expect(
        users(
          null,
          { isAdmin: true, isBlocked: false },
          { userInfo: mockUserInfo },
        ),
      ).rejects.toEqual(new Error("You must be a site admin to retrieve users"))
    })

    it("allows admins to retrieve users", () => {
      const mockAdminInfo: UserInfo = { userId: "adminId", admin: true } // Provide an admin userInfo

      // Mock the User.find().exec() to return a dummy array of users
      const mockFind = vi.fn().mockReturnValue({
        exec: vi.fn().mockResolvedValue([{ id: "1" }, { id: "2" }]),
      })
      vi.spyOn(require("../../models/user.js"), "default").mockReturnValue({
        find: mockFind,
      })

      expect(
        users(
          null,
          { isAdmin: null, isBlocked: false },
          { userInfo: mockAdminInfo },
        ),
      ).resolves.toEqual([{ id: "1" }, { id: "2" }])

      // Restore the original mock
      vi.restoreAllMocks()
    })
  })
})
