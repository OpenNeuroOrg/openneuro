import type { GraphQLContext } from "../../builder"
import { SCAN_COUNT } from "../../../cache/tree"
import { cacheClear } from "../cache"

const mockRedisState = {
  keys: new Set<string>(),
  sets: new Map<string, Set<string>>(),
}

const unlinkKey = (key: string) => {
  mockRedisState.keys.delete(key)
  mockRedisState.sets.delete(key)
}

const mockRedis = {
  sscanStream: vi.fn((key: string) => {
    const members = [...(mockRedisState.sets.get(key) ?? [])]
    return (async function* () {
      if (members.length > 0) yield members
    })()
  }),
  scanStream: vi.fn(({ match }: { match: string; count?: number }) => {
    const needle = match.replace(/^\*|\*$/g, "")
    const matched = [...mockRedisState.keys].filter((k) => k.includes(needle))
    return (async function* () {
      if (matched.length > 0) yield matched
    })()
  }),
  unlink: vi.fn(async (...keys: string[]) => {
    for (const key of keys) unlinkKey(key)
    return keys.length
  }),
  pipeline: vi.fn(() => {
    const ops: (() => void)[] = []
    const pipe = {
      unlink(...keys: string[]) {
        ops.push(() => {
          for (const key of keys) unlinkKey(key)
        })
        return pipe
      },
      exec: vi.fn(async () => {
        for (const op of ops) op()
        return []
      }),
    }
    return pipe
  }),
}

vi.mock("../../../libs/redis.js", () => ({
  getRedis: () => mockRedis,
}))

describe("cacheClear resolver", () => {
  beforeEach(() => {
    mockRedisState.keys.clear()
    mockRedisState.sets.clear()
    vi.clearAllMocks()
  })

  it("rejects non-admin users", async () => {
    const result = await cacheClear(
      null,
      { datasetId: "ds000001" },
      { userInfo: { admin: false } } as unknown as GraphQLContext,
    )
    expect(result).toBe(false)
    expect(mockRedis.scanStream).not.toHaveBeenCalled()
  })

  it("rejects invalid dataset IDs", async () => {
    const result = await cacheClear(
      null,
      { datasetId: "invalid" },
      { userInfo: { admin: true } } as unknown as GraphQLContext,
    )
    expect(result).toBe(false)
    expect(mockRedis.scanStream).not.toHaveBeenCalled()
  })

  it("clears dataset trees and non-lock dataset keys via batched unlink", async () => {
    mockRedisState.sets.set("dt:ds000001", new Set(["treehash1"]))
    mockRedisState.keys.add("tree:treehash1")
    mockRedisState.keys.add("ct:treehash1")
    mockRedisState.keys.add("dt:ds000001")
    mockRedisState.keys.add("snapshot:ds000001:1.0.0")
    mockRedisState.keys.add("description:ds000001:abc1234")
    mockRedisState.keys.add("openneuro:create-snapshot-lock:ds000001:1.0.1")
    mockRedisState.keys.add("snapshot:ds000002:1.0.0")

    const result = await cacheClear(
      null,
      { datasetId: "ds000001" },
      { userInfo: { admin: true } } as unknown as GraphQLContext,
    )

    expect(result).toBe(true)
    expect(mockRedis.scanStream).toHaveBeenCalledWith({
      match: "*ds000001*",
      count: SCAN_COUNT,
    })
    expect(mockRedisState.keys.has("tree:treehash1")).toBe(false)
    expect(mockRedisState.keys.has("ct:treehash1")).toBe(false)
    expect(mockRedisState.keys.has("dt:ds000001")).toBe(false)
    expect(mockRedisState.keys.has("snapshot:ds000001:1.0.0")).toBe(false)
    expect(mockRedisState.keys.has("description:ds000001:abc1234")).toBe(false)
    // Preserves active snapshot locks and other datasets' keys
    expect(
      mockRedisState.keys.has("openneuro:create-snapshot-lock:ds000001:1.0.1"),
    ).toBe(true)
    expect(mockRedisState.keys.has("snapshot:ds000002:1.0.0")).toBe(true)
  })
})
