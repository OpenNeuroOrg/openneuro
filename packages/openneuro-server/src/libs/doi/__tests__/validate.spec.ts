import { vi } from "vitest"
import { validateDataciteMetadata } from "../validate.js"

vi.mock("ioredis")

describe("validateDataciteMetadata", () => {
  const validAttrs = {
    doi: "10.18112/openneuro.ds000001.v1.0.0",
    url: "https://openneuro.org/datasets/ds000001/versions/1.0.0",
    creators: [{ name: "A. User", nameType: "Personal" as const }],
    titles: [{ title: "Test Dataset" }],
    publisher: { name: "OpenNeuro" },
    publicationYear: "2024",
    types: { resourceTypeGeneral: "Dataset" as const },
    schemaVersion: "http://datacite.org/schema/kernel-4" as const,
  }

  it("returns no errors for valid metadata", () => {
    expect(validateDataciteMetadata(validAttrs)).toEqual([])
  })

  it("requires at least one creator", () => {
    const errors = validateDataciteMetadata({ ...validAttrs, creators: [] })
    expect(errors).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ field: "creators" }),
      ]),
    )
  })

  it("requires each creator to have a name", () => {
    const errors = validateDataciteMetadata({
      ...validAttrs,
      creators: [{ name: "", nameType: "Personal" }],
    })
    expect(errors).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ field: "creators" }),
      ]),
    )
  })

  it("requires at least one title", () => {
    const errors = validateDataciteMetadata({ ...validAttrs, titles: [] })
    expect(errors).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ field: "titles" }),
      ]),
    )
  })

  it("requires a non-empty title", () => {
    const errors = validateDataciteMetadata({
      ...validAttrs,
      titles: [{ title: "" }],
    })
    expect(errors).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ field: "titles" }),
      ]),
    )
  })

  it("requires publisher name", () => {
    const errors = validateDataciteMetadata({
      ...validAttrs,
      publisher: { name: "" },
    })
    expect(errors).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ field: "publisher" }),
      ]),
    )
  })

  it("requires a four-digit year string for publicationYear", () => {
    const errors = validateDataciteMetadata({
      ...validAttrs,
      publicationYear: "0",
    })
    expect(errors).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ field: "publicationYear" }),
      ]),
    )
  })

  it("requires resourceTypeGeneral", () => {
    const errors = validateDataciteMetadata({
      ...validAttrs,
      types: {
        resourceTypeGeneral:
          "" as unknown as import("../../../types/datacite/datacite-v4.5").ResourceTypeGeneral,
      },
    })
    expect(errors).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ field: "types" }),
      ]),
    )
  })

  it("returns multiple errors when multiple fields are invalid", () => {
    const errors = validateDataciteMetadata({
      doi: "10.18112/test",
      url: "https://example.com",
    })
    expect(errors.length).toBeGreaterThanOrEqual(4)
  })
})
