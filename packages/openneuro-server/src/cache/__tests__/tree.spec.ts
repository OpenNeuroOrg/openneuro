import type { Redis } from "ioredis"
import {
  addDatasetTree,
  addDatasetTrees,
  clearDatasetTrees,
  getCommitTrees,
  getDatasetTrees,
  getTree,
  getTreesBulk,
  setCommitTrees,
  setTree,
  type TreeEntry,
} from "../tree"

function makeEntry(overrides: Partial<TreeEntry> = {}): TreeEntry {
  return {
    n: "README.md",
    h: "abc123",
    s: 42,
    k: "datasets/ds000001/README.md",
    v: "v1",
    b: "",
    p: false,
    d: false,
    ...overrides,
  }
}

function createRedisMock() {
  const store = new Map<string, Buffer>()
  const sets = new Map<string, Set<string>>()

  const pipelineOps: (() => [Error | null, unknown])[] = []
  const pipelineMock = {
    getBuffer(key: string) {
      pipelineOps.push(() => {
        const val = store.get(key)
        return [null, val ?? null]
      })
      return pipelineMock
    },
    del(key: string) {
      pipelineOps.push(() => {
        store.delete(key)
        sets.delete(key)
        return [null, 1]
      })
      return pipelineMock
    },
    exec: vi.fn(async () => {
      const results = pipelineOps.map((op) => op())
      pipelineOps.length = 0
      return results
    }),
  }

  return {
    getBuffer: vi.fn(async (key: string) => store.get(key) ?? null),
    set: vi.fn(async (key: string, value: Buffer) => {
      store.set(key, value)
    }),
    setex: vi.fn(async (key: string, _ttl: number, value: Buffer) => {
      store.set(key, value)
    }),
    sadd: vi.fn(async (key: string, ...members: string[]) => {
      if (!sets.has(key)) sets.set(key, new Set())
      for (const m of members) sets.get(key)!.add(m)
    }),
    smembers: vi.fn(async (key: string) => [...(sets.get(key) ?? [])]),
    pipeline: vi.fn(() => {
      pipelineOps.length = 0
      return pipelineMock
    }),
    // expose internals for assertions
    _store: store,
    _sets: sets,
  } as unknown as Redis
}

describe("tree cache", () => {
  describe("getTree / setTree", () => {
    it("returns null on cache miss", async () => {
      const redis = createRedisMock()
      expect(await getTree(redis, "nonexistent")).toBeNull()
    })

    it("round-trips entries through msgpack", async () => {
      const redis = createRedisMock()
      const entries = [makeEntry(), makeEntry({ n: "sub-01", d: true, s: 0 })]
      await setTree(redis, "hash1", entries)
      const result = await getTree(redis, "hash1")
      expect(result).toEqual(entries)
    })

    it("stores with TTL when provided", async () => {
      const redis = createRedisMock()
      await setTree(redis, "hash2", [makeEntry()], 3600)
      expect(redis.setex).toHaveBeenCalledWith(
        "tree:hash2",
        3600,
        expect.any(Buffer),
      )
      expect(redis.set).not.toHaveBeenCalled()
    })

    it("stores without TTL when omitted", async () => {
      const redis = createRedisMock()
      await setTree(redis, "hash3", [makeEntry()])
      expect(redis.set).toHaveBeenCalledWith("tree:hash3", expect.any(Buffer))
      expect(redis.setex).not.toHaveBeenCalled()
    })
  })

  describe("getTreesBulk", () => {
    it("returns empty map for empty input", async () => {
      const redis = createRedisMock()
      const result = await getTreesBulk(redis, [])
      expect(result.size).toBe(0)
      expect(redis.pipeline).not.toHaveBeenCalled()
    })

    it("fetches multiple trees via pipeline", async () => {
      const redis = createRedisMock()
      const e1 = [makeEntry({ n: "file1" })]
      const e2 = [makeEntry({ n: "file2" })]
      await setTree(redis, "a", e1)
      await setTree(redis, "b", e2)

      const result = await getTreesBulk(redis, ["a", "b", "missing"])
      expect(result.size).toBe(2)
      expect(result.get("a")).toEqual(e1)
      expect(result.get("b")).toEqual(e2)
      expect(result.has("missing")).toBe(false)
    })
  })

  describe("setCommitTrees / getCommitTrees", () => {
    it("returns null on cache miss", async () => {
      const redis = createRedisMock()
      expect(await getCommitTrees(redis, "nonexistent")).toBeNull()
    })

    it("round-trips tree hash lists", async () => {
      const redis = createRedisMock()
      const hashes = ["hash1", "hash2", "hash3"]
      await setCommitTrees(redis, "commit1", hashes)
      const result = await getCommitTrees(redis, "commit1")
      expect(result).toEqual(hashes)
    })

    it("uses correct key prefix and TTL", async () => {
      const redis = createRedisMock()
      await setCommitTrees(redis, "abc", ["h1"])
      expect(redis.set).toHaveBeenCalledWith(
        "ct:abc",
        expect.any(Buffer),
      )
    })
  })

  describe("dataset tree index", () => {
    it("addDatasetTree adds a single hash", async () => {
      const redis = createRedisMock()
      await addDatasetTree(redis, "ds000001", "hash1")
      expect(redis.sadd).toHaveBeenCalledWith("dt:ds000001", "hash1")
      const members = await getDatasetTrees(redis, "ds000001")
      expect(members).toEqual(["hash1"])
    })

    it("addDatasetTrees adds multiple hashes", async () => {
      const redis = createRedisMock()
      await addDatasetTrees(redis, "ds000001", ["h1", "h2", "h3"])
      expect(redis.sadd).toHaveBeenCalledWith("dt:ds000001", "h1", "h2", "h3")
    })

    it("addDatasetTrees skips empty array", async () => {
      const redis = createRedisMock()
      await addDatasetTrees(redis, "ds000001", [])
      expect(redis.sadd).not.toHaveBeenCalled()
    })

    it("getDatasetTrees returns empty array for unknown dataset", async () => {
      const redis = createRedisMock()
      const result = await getDatasetTrees(redis, "ds999999")
      expect(result).toEqual([])
    })
  })

  describe("clearDatasetTrees", () => {
    it("deletes all cached trees and the index", async () => {
      const redis = createRedisMock()
      // Populate tree data and index
      await setTree(redis, "t1", [makeEntry({ n: "a" })])
      await setTree(redis, "t2", [makeEntry({ n: "b" })])
      await addDatasetTrees(redis, "ds000001", ["t1", "t2"])

      await clearDatasetTrees(redis, "ds000001")

      // Individual trees should be gone
      expect(await getTree(redis, "t1")).toBeNull()
      expect(await getTree(redis, "t2")).toBeNull()
      // Index should be gone
      expect(await getDatasetTrees(redis, "ds000001")).toEqual([])
    })

    it("does nothing when dataset has no trees", async () => {
      const redis = createRedisMock()
      await clearDatasetTrees(redis, "ds000001")
      expect(redis.pipeline).not.toHaveBeenCalled()
    })
  })
})
