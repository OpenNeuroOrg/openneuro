import { vi } from "vitest"
import type { HasId } from "../../../utils/datasetOrSnapshot"
import { brainlifeQuery } from "../brainlife"

vi.mock("ioredis")

describe("brainlife resolvers", () => {
  it("correctly queries drafts", () => {
    expect(brainlifeQuery({ id: "ds000001" } as HasId).toString()).toEqual(
      "https://brainlife.io/api/warehouse/datalad/datasets?find=%7B%22removed%22%3Afalse%2C%22path%22%3A%7B%22%24regex%22%3A%22%5EOpenNeuro%2Fds000001%22%7D%7D",
    )
  })
  it("correctly queries versioned datasets", () => {
    expect(
      brainlifeQuery({ id: "ds000001:1.0.0", tag: "1.0.0" }).toString(),
    ).toEqual(
      "https://brainlife.io/api/warehouse/datalad/datasets?find=%7B%22removed%22%3Afalse%2C%22path%22%3A%7B%22%24regex%22%3A%22%5EOpenNeuro%2Fds000001%22%7D%2C%22version%22%3A%221.0.0%22%7D",
    )
  })
})
