import { promiseTimeout } from "../promiseTimeout"

describe("withTimeout", () => {
  it("rejects with null when the promise exceeds timeout milliseconds", async () => {
    const slowPromise = new Promise((resolve) =>
      setTimeout(() => resolve("Slow Result"), 500)
    )
    expect(await promiseTimeout(slowPromise, 100)).toBeNull()
  })
  it("resolves when the promise returns before timeout", async () => {
    const slowPromise = new Promise((resolve) =>
      setTimeout(() => resolve("Fast Result"), 10)
    )
    expect(await promiseTimeout(slowPromise, 500)).toBe("Fast Result")
  })
})
