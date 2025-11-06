import {
  afterAll,
  beforeAll,
  beforeEach,
  describe,
  expect,
  it,
  vi,
} from "vitest"
import { MongoMemoryServer } from "mongodb-memory-server"
import mongoose, { Types } from "mongoose"
import User from "../../../models/user"
import { users } from "../user.js"
import type { GraphQLContext } from "../user.js"

vi.mock("ioredis")

let mongod: MongoMemoryServer

// Test data loaded before each test
const testUsersSeedData = [
  {
    _id: new Types.ObjectId("60f0f0f0f0f0f0f0f0f0f0f1"),
    id: "u1",
    email: "atest1@example.com",
    name: "Alice Admin",
    admin: true,
    blocked: false,
    migrated: false,
    updatedAt: new Date("2023-01-05T00:00:00.000Z"),
    providerId: "0000-0000-0000-0001",
    provider: "orcid",
    orcid: "0000-0000-0000-0001",
  },
  {
    _id: new Types.ObjectId("60f0f0f0f0f0f0f0f0f0f0f2"),
    id: "u2",
    email: "btest2@example.com",
    name: "Test User",
    admin: false,
    blocked: false,
    migrated: false,
    updatedAt: new Date("2023-01-04T00:00:00.000Z"),
    providerId: "google2",
    provider: "google",
  },
  {
    _id: new Types.ObjectId("60f0f0f0f0f0f0f0f0f0f0f3"),
    id: "u3",
    email: "ctest3@example.com",
    name: "Test User",
    admin: false,
    blocked: true,
    migrated: false,
    updatedAt: new Date("2023-01-03T00:00:00.000Z"),
    providerId: "0000-0000-0000-0003",
    provider: "orcid",
  },
  {
    _id: new Types.ObjectId("60f0f0f0f0f0f0f0f0f0f0f4"),
    id: "u4",
    email: "dtest4@example.com",
    name: "Test Admin User",
    admin: true,
    blocked: true,
    migrated: false,
    updatedAt: new Date("2023-01-02T00:00:00.000Z"),
    providerId: "0000-0000-0000-0004",
    provider: "orcid",
    orcid: "0000-0000-0000-0004",
  },
  {
    _id: new Types.ObjectId("60f0f0f0f0f0f0f0f0f0f0f5"),
    id: "u5",
    email: "etest2@example.com",
    name: "Test User",
    admin: false,
    blocked: false,
    migrated: true,
    updatedAt: new Date("2023-01-04T00:00:00.000Z"),
    providerId: "google2",
    provider: "google",
  },
  {
    _id: new Types.ObjectId("60f0f0f0f0f0f0f0f0f0f0f6"),
    id: "u6",
    email: "ftest6@example.com",
    name: "Test Admin User",
    admin: true,
    blocked: false,
    migrated: false,
    updatedAt: new Date("2023-01-06T00:00:00.000Z"),
    providerId: "orcid6",
    provider: "orcid",
    orcid: "0000-0000-0000-0006",
  }, // Most recent
  {
    _id: new Types.ObjectId("60f0f0f0f0f0f0f0f0f0f0f7"),
    id: "u7",
    email: "gtest7@example.com",
    name: "Test User",
    admin: false,
    blocked: false,
    migrated: false,
    updatedAt: new Date("2023-01-05T00:00:00.000Z"),
  }, // Same updatedAt as u1, for secondary sort testing
]

// Admin context for tests
const adminContext: GraphQLContext = {
  userInfo: { userId: "admin-user", admin: true, username: "adminUser" },
}
// Non-admin context for tests
const nonAdminContext: GraphQLContext = {
  userInfo: { userId: "normal-user", admin: false, username: "normalUser" },
}

describe("user resolvers", () => {
  beforeAll(async () => {
    mongod = await MongoMemoryServer.create()
    const uri = mongod.getUri()
    await mongoose.connect(uri)
  })

  afterAll(async () => {
    await mongoose.disconnect()
    await mongod.stop()
  })

  beforeEach(async () => {
    await User.deleteMany({})
    await User.insertMany(testUsersSeedData)
  })

  describe("users()", () => {
    it("returns sanitized data for non-admin context", async () => {
      const result = await users(null, {}, nonAdminContext)

      // Should return all non-migrated users (same as admin)
      expect(result.users.length).toBe(6)
      expect(result.totalCount).toBe(6)

      // Sensitive fields should be hidden
      result.users.forEach((u) => {
        expect(u.email).toBeNull()
        expect(u.blocked).toBeNull()
        expect(u.admin).toBeNull()
      })

      // Non-sensitive fields should still be populated
      const userIds = result.users.map((u) => u.id)
      expect(userIds).toEqual(
        expect.arrayContaining(["u1", "u2", "u3", "u4", "u6", "u7"]),
      )
    })

    it("returns all non-migrated users by default, sorted by updatedAt desc then _id desc", async () => {
      const result = await users(null, {}, adminContext)
      // u5 is migrated. 6 non-migrated users: u1, u2, u3, u4, u6, u7
      expect(result.users.length).toBe(6)
      expect(result.totalCount).toBe(6)

      const dbSortedUsers = await User.find({ migrated: { $ne: true } })
        .sort({ updatedAt: -1, _id: -1 })
        .exec()
      const expectedIds = dbSortedUsers.map((u) => u.id)
      expect(result.users.map((u) => u.id)).toEqual(expectedIds)
      // Expected order based on seed data _ids: u6, u7, u1, u2, u3, u4
      // (u7 _id > u1 _id, so u7 comes before u1 in _id desc sort when updatedAt is same)
      expect(expectedIds).toEqual(["u6", "u7", "u1", "u2", "u3", "u4"])
    })

    it("handles pagination with limit", async () => {
      const dbSortedUsers = await User.find({ migrated: { $ne: true } })
        .sort({ updatedAt: -1, _id: -1 })
        .exec()
      const expectedLimitedIds = dbSortedUsers.slice(0, 2).map((u) => u.id)

      const result = await users(null, { limit: 2 }, adminContext)
      expect(result.users.length).toBe(2)
      expect(result.totalCount).toBe(6)
      expect(result.users.map((u) => u.id)).toEqual(expectedLimitedIds)
    })

    it("handles pagination with offset", async () => {
      const dbSortedUsers = await User.find({ migrated: { $ne: true } })
        .sort({ updatedAt: -1, _id: -1 })
        .exec()
      const expectedOffsetIds = dbSortedUsers.slice(4).map((u) => u.id) // Skips 4

      const result = await users(null, { offset: 4 }, adminContext)
      expect(result.users.length).toBe(2) // Total 6, offset 4, so 2 remaining
      expect(result.totalCount).toBe(6)
      expect(result.users.map((u) => u.id)).toEqual(expectedOffsetIds) // Should be ['u3', 'u4']
    })

    it("handles pagination with limit and offset", async () => {
      const dbSortedUsers = await User.find({ migrated: { $ne: true } })
        .sort({ updatedAt: -1, _id: -1 })
        .exec()
      const expectedPaginatedIds = dbSortedUsers.slice(1, 1 + 2).map((u) =>
        u.id
      ) // Skip 1, take 2

      const result = await users(null, { limit: 2, offset: 1 }, adminContext)
      expect(result.users.length).toBe(2)
      expect(result.totalCount).toBe(6)
      expect(result.users.map((u) => u.id)).toEqual(expectedPaginatedIds) // Should be ['u7', 'u1']
    })

    it("filters by isAdmin: true", async () => {
      const result = await users(null, { isAdmin: true }, adminContext)
      expect(result.users.length).toBe(3)
      expect(result.totalCount).toBe(3)
      const ids = result.users.map((u) => u.id)
      expect(ids).toEqual(expect.arrayContaining(["u1", "u4", "u6"]))
    })

    it("filters by isAdmin: false", async () => {
      const result = await users(null, { isAdmin: false }, adminContext)
      expect(result.users.length).toBe(3)
      expect(result.totalCount).toBe(3)
      const ids = result.users.map((u) => u.id)
      expect(ids).toEqual(expect.arrayContaining(["u2", "u3", "u7"]))
    })

    it("filters by isBlocked: true", async () => {
      const result = await users(null, { isBlocked: true }, adminContext)
      expect(result.users.length).toBe(2)
      expect(result.totalCount).toBe(2)
      const ids = result.users.map((u) => u.id)
      expect(ids).toEqual(expect.arrayContaining(["u3", "u4"]))
    })

    it("filters by isBlocked: false", async () => {
      const result = await users(null, { isBlocked: false }, adminContext)
      // Not blocked (non-migrated): u1, u2, u6, u7 -> 4 users
      expect(result.users.length).toBe(4)
      expect(result.totalCount).toBe(4)
      const ids = result.users.map((u) => u.id)
      expect(ids).toEqual(expect.arrayContaining(["u1", "u2", "u6", "u7"]))
    })

    it("searches by name (case-insensitive, partial)", async () => {
      const result = await users(null, { search: "Alice" }, adminContext)
      expect(result.users.length).toBe(1)
      expect(result.totalCount).toBe(1)
      expect(result.users[0].id).toBe("u1")
    })

    it("searches by email (case-insensitive, partial)", async () => {
      const result = await users(
        null,
        { search: "btest2@EXAMPLE" },
        adminContext,
      )
      expect(result.users.length).toBe(1)
      expect(result.totalCount).toBe(1)
      expect(result.users[0].id).toBe("u2")
    })

    it("search returns empty if no match", async () => {
      const result = await users(null, { search: "NoSuchUser" }, adminContext)
      expect(result.users.length).toBe(0)
      expect(result.totalCount).toBe(0)
    })

    it("combines search with other filters (e.g., isAdmin)", async () => {
      await User.create({
        _id: new Types.ObjectId(),
        id: "u8",
        email: "search_admin@example.com",
        name: "Searchable Admin",
        admin: true,
        blocked: false,
        migrated: false,
        updatedAt: new Date("2023-01-07T00:00:00.000Z"),
      })
      // Search for "Admin" (matches u1 name, u6 name, u8 name) and isAdmin: true
      const result = await users(
        null,
        { search: "Admin", isAdmin: true },
        adminContext,
      )
      expect(result.users.length).toBe(4) // u1, u6, u8
      expect(result.totalCount).toBe(4)
      const ids = result.users.map((u) => u.id)
      expect(ids).toEqual(expect.arrayContaining(["u1", "u6", "u8"]))
    })

    it("sorts by name ascending (with _id ascending as secondary)", async () => {
      const result = await users(null, {
        orderBy: [{ field: "name", order: "ascending" }],
      }, adminContext)
      const dbSortedUsers = await User.find({ migrated: { $ne: true } })
        .sort({ name: 1, _id: 1 })
        .exec()
      expect(result.users.map((u) => u.id)).toEqual(
        dbSortedUsers.map((u) => u.id),
      )
      // Expected: u1, u4, u6, u2, u3, u7
      expect(dbSortedUsers.map((u) => u.id)).toEqual([
        "u1",
        "u4",
        "u6",
        "u2",
        "u3",
        "u7",
      ])
    })

    it("sorts by email descending (with _id descending as secondary)", async () => {
      const result = await users(null, {
        orderBy: [{ field: "email", order: "descending" }],
      }, adminContext)
      const dbSortedUsers = await User.find({ migrated: { $ne: true } })
        .sort({ email: -1, _id: -1 })
        .exec()
      expect(result.users.map((u) => u.id)).toEqual(
        dbSortedUsers.map((u) => u.id),
      )
      // Expected: u7, u6, u4, u3, u2, u1
      expect(dbSortedUsers.map((u) => u.id)).toEqual([
        "u7",
        "u6",
        "u4",
        "u3",
        "u2",
        "u1",
      ])
    })

    it("handles multiple sort fields specified in orderBy (e.g. admin asc, name asc)", async () => {
      const result = await users(null, {
        orderBy: [
          { field: "admin", order: "ascending" },
          { field: "name", order: "ascending" },
        ],
      }, adminContext)
      // Mongoose sort: { admin: 1, name: 1, _id: 1 } (since _id is added based on first sort field's order)
      const dbSortedUsers = await User.find({ migrated: { $ne: true } })
        .sort({ admin: 1, name: 1, _id: 1 })
        .exec()
      expect(result.users.map((u) => u.id)).toEqual(
        dbSortedUsers.map((u) => u.id),
      )
      expect(dbSortedUsers.map((u) => u.id)).toEqual([
        "u2",
        "u3",
        "u7",
        "u1",
        "u4",
        "u6",
      ])
    })

    it("correctly calculates totalCount regardless of pagination", async () => {
      const result = await users(
        null,
        { isAdmin: true, limit: 1 },
        adminContext,
      )
      expect(result.users.length).toBe(1)
      expect(result.totalCount).toBe(3) // u1, u4, u6 are admins
    })
  })
})
