import { vi } from "vitest"
import { buildPayload, createDOI, formatBasicAuth } from "../index.js"

vi.mock("ioredis")

describe("DOI minting utils", () => {
  describe("formatBasicAuth()", () => {
    it("returns a base64 basic auth string", () => {
      const doiConfig = { username: "test", password: "12345" }
      expect(formatBasicAuth(doiConfig)).toBe("Basic dGVzdDoxMjM0NQ==")
    })
  })

  describe("createDOI()", () => {
    it("creates a DOI without snapshot", () => {
      const doi = createDOI("ds000001")
      expect(doi).toMatch(/\/openneuro\.ds000001$/)
    })
    it("creates a DOI with snapshot", () => {
      const doi = createDOI("ds000001", "1.0.0")
      expect(doi).toMatch(/\/openneuro\.ds000001\.v1\.0\.0$/)
    })
  })

  describe("buildPayload()", () => {
    const attributes = {
      doi: "10.18112/openneuro.ds000001.v1.0.0",
      url: "https://openneuro.org/datasets/ds000001/versions/1.0.0",
      creators: [{ name: "A. User", nameType: "Personal" as const }],
      titles: [{ title: "Test Dataset" }],
      publisher: { name: "OpenNeuro" },
      publicationYear: "2024",
      types: { resourceTypeGeneral: "Dataset" as const },
      schemaVersion: "http://datacite.org/schema/kernel-4" as const,
    }

    it("builds a valid Datacite JSON API payload", () => {
      const payload = buildPayload(attributes)
      expect(payload.data.type).toBe("dois")
      expect(payload.data.attributes.doi).toBe(
        "10.18112/openneuro.ds000001.v1.0.0",
      )
      expect(payload.data.attributes.event).toBeUndefined()
      expect(payload.data.attributes.schemaVersion).toBe(
        "http://datacite.org/schema/kernel-4",
      )
    })

    it("omits event when not provided", () => {
      const payload = buildPayload(attributes)
      expect(payload.data.attributes.event).toBeUndefined()
    })

    it("preserves all metadata attributes", () => {
      const payload = buildPayload(attributes, "publish")
      expect(payload.data.attributes.creators).toHaveLength(1)
      expect(payload.data.attributes.titles[0].title).toBe("Test Dataset")
      expect(payload.data.attributes.publisher.name).toBe("OpenNeuro")
      expect(payload.data.attributes.publicationYear).toBe("2024")
      expect(payload.data.attributes.types.resourceTypeGeneral).toBe("Dataset")
    })
  })
})
