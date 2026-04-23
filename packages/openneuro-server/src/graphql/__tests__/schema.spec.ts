import { vi } from "vitest"

vi.mock("ioredis", () => {
  const RedisMock = vi.fn()
  RedisMock.prototype.on = vi.fn()
  RedisMock.prototype.connect = vi.fn()
  return { default: RedisMock }
})
vi.mock("../../elasticsearch/elastic-client", () => ({
  elasticClient: {},
}))
vi.mock("../../config", () => ({
  default: {
    url: "http://localhost",
    auth: { jwt: { secret: "test-secret-for-schema-smoke" } },
    datalad: { uri: "http://localhost" },
    mongo: { url: "mongodb://localhost", dbName: "test" },
    redis: {},
  },
}))

import schema from "../schema"

it("builds the schema without error", () => {
  expect(schema).toBeDefined()
  expect(schema.getQueryType()).toBeDefined()
  expect(schema.getMutationType()).toBeDefined()
})
