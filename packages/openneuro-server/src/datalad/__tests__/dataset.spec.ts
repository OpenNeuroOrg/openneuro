/* eslint-disable @typescript-eslint/no-explicit-any */
import { vi } from "vitest"
import request from "superagent"
import {
  createDataset,
  datasetsFilter,
  getDraftRetentionAge,
  testBlacklist,
} from "../dataset"
import { getDraftInfo } from "../draft"
import { getSnapshots } from "../snapshots"
import { getDatasetWorker } from "../../libs/datalad-service"
import { connect } from "mongoose"
import { MongoMemoryServer } from "mongodb-memory-server"

// Mock requests to Datalad service
vi.mock("superagent")
vi.mock("ioredis")
vi.mock("../../libs/redis")
vi.mock("../../config.ts")
vi.mock("../../libs/notifications")
vi.mock("../draft")
vi.mock("../snapshots")

describe("dataset model operations", () => {
  describe("createDataset()", () => {
    let mongod
    beforeAll(async () => {
      // Setup MongoDB with mongodb-memory-server
      mongod = await MongoMemoryServer.create()
      connect(mongod.getUri())
    })
    it("resolves to dataset id string", async () => {
      const user = { id: "1234" }
      const { id: dsId } = await createDataset(user.id, user, {
        affirmedDefaced: true,
        affirmedConsent: true,
      })
      expect(dsId).toHaveLength(8)
      expect(dsId.slice(0, 2)).toBe("ds")
    })
    it("posts to the DataLad /datasets/{dsId} endpoint", async () => {
      const user = { id: "1234" }
      // Reset call count for request.post
      request.post.mockClear()
      const { id: dsId } = await createDataset(user.id, user, {
        affirmedDefaced: true,
        affirmedConsent: true,
      })
      expect(request.post).toHaveBeenCalledTimes(1)
      expect(request.post).toHaveBeenCalledWith(
        expect.stringContaining(`${getDatasetWorker(dsId)}/datasets/`),
      )
    })
  })
  describe("datasetsFilter()", () => {
    describe("filterBy: {all: true} ", () => {
      it("returns the specified match for regular users", () => {
        const testMatch = { test: "match" }
        expect(
          datasetsFilter({
            userId: "1234",
            admin: false,
            filterBy: { all: true },
          })(testMatch)[0].$match,
        ).toBe(testMatch)
      })
      it("excludes match argument for admins", () => {
        const testMatch = { test: "match" }
        expect(
          datasetsFilter({
            userId: "5678",
            admin: true,
            filterBy: { all: true },
          })(testMatch),
        ).not.toBe(testMatch)
      })
    })
    describe("filterBy: {invalid: true}", () => {
      it("returns the correct number of stages", () => {
        expect(
          datasetsFilter({ filterBy: { invalid: true } })({}),
        ).toHaveLength(4)
      })
    })
    describe("filterBy: {invalid: true, public: true}", () => {
      it("returns the same number of stages as invalid: true", () => {
        expect(
          datasetsFilter({ filterBy: { invalid: true, public: true } })({}),
        ).toHaveLength(4)
      })
      it("returns one less stage for admins with all", () => {
        expect(
          datasetsFilter({
            admin: true,
            filterBy: { invalid: true, public: true, all: true },
          })({}),
        ).toHaveLength(3)
      })
    })
    describe("testBlacklist", () => {
      it("returns false for .bidsignore", () => {
        expect(testBlacklist("", ".bidsignore")).toBe(false)
      })
      it("returns true for .git paths", () => {
        expect(testBlacklist(".git", "HEAD")).toBe(true)
      })
      it("returns true for root level .DS_Store files", () => {
        expect(testBlacklist("", ".DS_Store")).toBe(true)
      })
      it("returns true for nested .DS_Store files", () => {
        expect(testBlacklist("sub-01/anat/", ".DS_Store")).toBe(true)
      })
      // https://github.com/OpenNeuroOrg/openneuro/issues/2519
      it("skips ._ prefixed files created by macOS", () => {
        expect(testBlacklist("", "._.DS_Store")).toBe(true)
        expect(testBlacklist("stimuli/", "._1002.png")).toBe(true)
        expect(testBlacklist("stimuli/", "test._1002.png")).toBe(false)
      })
    })
  })
  describe("getDraftRetentionAge()", () => {
    const mockGetDraftInfo = vi.mocked(getDraftInfo)
    const mockGetSnapshots = vi.mocked(getSnapshots)

    it("returns null when the draft hexsha matches the latest snapshot", async () => {
      mockGetDraftInfo.mockResolvedValue({
        ref: "abc123",
        hexsha: "abc123",
        tree: "tree1",
        message: "test commit",
        modified: new Date(Date.now() - 5000),
      })
      mockGetSnapshots.mockResolvedValue([
        { hexsha: "old456", tag: "1.0.0" } as any,
        { hexsha: "abc123", tag: "1.1.0" } as any,
      ])
      await expect(getDraftRetentionAge("ds000001")).resolves.toBeNull()
    })

    it("returns milliseconds since draft modification when there are no snapshots", async () => {
      const fiveMinutesAgo = new Date(Date.now() - 5 * 60 * 1000)
      mockGetDraftInfo.mockResolvedValue({
        ref: "abc123",
        hexsha: "abc123",
        tree: "tree1",
        message: "test commit",
        modified: fiveMinutesAgo,
      })
      mockGetSnapshots.mockResolvedValue([])
      const age = await getDraftRetentionAge("ds000001")
      expect(age).toBeGreaterThan(0)
      expect(age).toBeCloseTo(5 * 60 * 1000, -3)
    })

    it("returns milliseconds since draft modification when the draft diverges from the latest snapshot", async () => {
      const tenMinutesAgo = new Date(Date.now() - 10 * 60 * 1000)
      mockGetDraftInfo.mockResolvedValue({
        ref: "def456",
        hexsha: "def456",
        tree: "tree2",
        message: "unpublished work",
        modified: tenMinutesAgo,
      })
      mockGetSnapshots.mockResolvedValue([
        { hexsha: "abc123", tag: "1.0.0" } as any,
      ])
      const age = await getDraftRetentionAge("ds000001")
      expect(age).toBeGreaterThan(0)
      expect(age).toBeCloseTo(10 * 60 * 1000, -3)
    })

    it("returns age when getSnapshots returns null (no dataset found)", async () => {
      const oneHourAgo = new Date(Date.now() - 60 * 60 * 1000)
      mockGetDraftInfo.mockResolvedValue({
        ref: "abc123",
        hexsha: "abc123",
        tree: "tree1",
        message: "test commit",
        modified: oneHourAgo,
      })
      mockGetSnapshots.mockResolvedValue(null)
      const age = await getDraftRetentionAge("ds000001")
      expect(age).toBeGreaterThan(0)
      expect(age).toBeCloseTo(60 * 60 * 1000, -3)
    })
  })
})
