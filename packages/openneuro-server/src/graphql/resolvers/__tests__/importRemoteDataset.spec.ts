import { vi } from "vitest"
import { allowedImportUrl, importRemoteDataset } from "../importRemoteDataset"

vi.mock("ioredis")
vi.mock("../../../config")
vi.mock("../../permissions")

describe("importRemoteDataset mutation", () => {
  it("given a user with access, it creates an import record for later processing", async () => {
    await importRemoteDataset(
      {},
      { datasetId: "ds000000", url: "" },
      { user: "1234", userInfo: { admin: true } },
    )
  })
  describe("allowedImportUrl()", () => {
    it("allows brainlife.io", () => {
      expect(
        allowedImportUrl("https://brainlife.io/ezbids/dataset-to-import.zip"),
      ).toBe(true)
    })
    it("allows a test bucket for OpenNeuro use", () => {
      expect(
        allowedImportUrl(
          "https://openneuro-test-import-bucket.s3.us-west-2.amazonaws.com/ds000003.zip",
        ),
      ).toBe(true)
    })
    it("does not allow other URLs", () => {
      expect(allowedImportUrl("https://openneuro.org")).toBe(false)
      expect(allowedImportUrl("iiajsdfoijawe")).toBe(false)
      expect(allowedImportUrl("http://google.com/some-zip-file.zip")).toBe(
        false,
      )
      expect(
        allowedImportUrl("http://github.com/brainlife.io/somewhere-else.zip"),
      ).toBe(false)
    })
  })
})
