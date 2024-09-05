import { stub } from "@std/testing/mock"

export function mockFetch(response: Response) {
  return stub(
    globalThis,
    "fetch",
    () => Promise.resolve(response),
  )
}
