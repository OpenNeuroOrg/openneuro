/**
 * Script to dump the GraphQL schema to a file.
 * This was written during the transition to Pothos-generated schema,
 * for comparison with the hand-written schema.
 *
 * It is written as a test because the schema's imports are entangled
 * with the rest of the server code, and this allows us to mock out the dependencies.
 */
import { vi } from "vitest"

vi.mock("ioredis", () => {
  const RedisMock = vi.fn()
  RedisMock.prototype.on = vi.fn()
  RedisMock.prototype.connect = vi.fn()
  return { default: RedisMock }
})
vi.mock("../src/elasticsearch/elastic-client", () => ({
  elasticClient: {},
}))
vi.mock("../src/config", () => ({
  default: {
    url: "http://localhost",
    auth: { jwt: { secret: "test-secret-for-schema-dump" } },
    datalad: { uri: "http://localhost" },
    mongo: { url: "mongodb://localhost", dbName: "test" },
    redis: {},
  },
}))

import { writeFileSync } from "fs"
import { dirname, join } from "path"
import { fileURLToPath } from "url"
import { lexicographicSortSchema, printSchema } from "graphql/index.js"
import schema from "../src/graphql/schema"

it("dumps Pothos schema to SDL", () => {
  const sdl = printSchema(lexicographicSortSchema(schema))
  const dir = dirname(fileURLToPath(import.meta.url))
  writeFileSync(join(dir, "..", "schema.graphql"), sdl + "\n")
})
