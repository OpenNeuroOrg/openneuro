import { datasetCanonicalUrl } from "../dataset-canonical-url"
import { dataset } from "../../fixtures/dataset-query"
import { vitest } from "vitest"

vitest.mock("../../config", () => ({
  config: { url: "http://localhost:9876" },
}))

describe("datasetCanonicalUrl", () => {
  it("returns the canonical URL for a dataset with snapshots", () => {
    const url = datasetCanonicalUrl(dataset)
    expect(url.href).toBe("http://localhost:9876/datasets/ds001032/versions/2.0.0")
  })

  it("returns the canonical URL for a draft dataset", () => {
    const draftDataset = { ...dataset, snapshots: [] }
    const url = datasetCanonicalUrl(draftDataset)
    expect(url.href).toBe("http://localhost:9876/datasets/ds001032")
  })
})