import { stub } from "../deps.ts"

export function mockFetch(response: Response) {
  return stub(
    globalThis,
    "fetch",
    () => Promise.resolve(response),
  )
}
