import CacheItem from "../item"
import { CacheType } from "../types"

const redisMock = vi.fn(() => ({
  getBuffer: vi.fn(),
  setex: vi.fn(),
  set: vi.fn(),
}))

describe("CacheItem", () => {
  it("should succeed when the cache miss sets doNotCache but throws an exception", async () => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const item = new CacheItem(redisMock() as any, CacheType.commitFiles, [
      "ds000001",
      "12345678",
    ])
    let fail = true
    expect(
      await item.get(async (doNotCache) => {
        // On the first try
        if (fail) {
          fail = false
          doNotCache(true)
          throw new Error("expected failure")
        } else {
          doNotCache(false)
          return true
        }
      }),
    ).toBe(true)
  })
})
