import { vi } from "vitest"
import type { DataCite } from "../../../types/datacite"

vi.mock("ioredis")
vi.mock("../../../config", () => ({
  default: {
    url: "https://openneuro.org",
    auth: { orcid: { clientID: "APP-TEST", apiURI: "https://api.orcid.org" } },
  },
}))

import { buildOrcidWork, datasetExternalIdValue } from "../work-metadata"

const attributes: DataCite = {
  doi: "10.18112/openneuro.ds000001.v1.0.1",
  url: "https://openneuro.org/datasets/ds000001/versions/1.0.1",
  creators: [
    {
      name: "Doe, Jane",
      nameType: "Personal",
      nameIdentifiers: [
        {
          nameIdentifier: "https://orcid.org/0000-0002-1825-0097",
          nameIdentifierScheme: "ORCID",
        },
      ],
    },
    { name: "Roe, Richard", nameType: "Personal" },
  ],
  titles: [{ title: "A Test Dataset" }],
  publisher: { name: "OpenNeuro" },
  publicationYear: "2024",
  types: { resourceTypeGeneral: "Dataset" },
  schemaVersion: "http://datacite.org/schema/kernel-4",
  descriptions: [
    { description: "An abstract.", descriptionType: "Abstract" },
  ],
}

describe("buildOrcidWork()", () => {
  const snapshotDate = new Date("2024-03-05T12:00:00Z")

  it("maps Datacite metadata onto an ORCID data-set work", () => {
    const work = buildOrcidWork("ds000001", attributes, snapshotDate)
    expect(work.type).toBe("data-set")
    expect(work.title.title.value).toBe("A Test Dataset")
    expect(work["short-description"]).toBe("An abstract.")
    expect(work.url).toEqual({ value: attributes.url })
    expect(work["journal-title"]).toEqual({ value: "OpenNeuro" })
  })

  it("uses a zero padded publication date from the snapshot", () => {
    const work = buildOrcidWork("ds000001", attributes, snapshotDate)
    expect(work["publication-date"]).toEqual({
      year: { value: "2024" },
      month: { value: "03" },
      day: { value: "05" },
    })
  })

  it("includes a version independent external id for the dataset", () => {
    const work = buildOrcidWork("ds000001", attributes, snapshotDate)
    const externalIds = work["external-ids"]["external-id"]
    expect(externalIds).toContainEqual({
      "external-id-type": "uri",
      "external-id-value": "https://openneuro.org/datasets/ds000001",
      "external-id-url": { value: "https://openneuro.org/datasets/ds000001" },
      "external-id-relationship": "self",
    })
    expect(externalIds).toContainEqual({
      "external-id-type": "doi",
      "external-id-value": "10.18112/openneuro.ds000001.v1.0.1",
      "external-id-url": {
        value: "https://doi.org/10.18112/openneuro.ds000001.v1.0.1",
      },
      "external-id-relationship": "self",
    })
  })

  it("keeps the same stable external id across snapshots", () => {
    const later = buildOrcidWork(
      "ds000001",
      { ...attributes, doi: "10.18112/openneuro.ds000001.v2.0.0" },
      new Date("2025-01-01T00:00:00Z"),
    )
    expect(later["external-ids"]["external-id"][0]["external-id-value"]).toBe(
      datasetExternalIdValue("ds000001"),
    )
  })

  it("attaches ORCID iDs to creators that have one", () => {
    const work = buildOrcidWork("ds000001", attributes, snapshotDate)
    const [first, second] = work.contributors.contributor
    expect(first["contributor-orcid"]).toEqual({
      uri: "https://orcid.org/0000-0002-1825-0097",
      path: "0000-0002-1825-0097",
      host: "orcid.org",
    })
    expect(first["contributor-attributes"]).toEqual({
      "contributor-sequence": "first",
      "contributor-role": "author",
    })
    expect(second["contributor-orcid"]).toBeUndefined()
    expect(second["credit-name"]).toEqual({ value: "Roe, Richard" })
  })

  it("truncates descriptions ORCID would reject", () => {
    const work = buildOrcidWork(
      "ds000001",
      {
        ...attributes,
        descriptions: [{
          description: "x".repeat(6000),
          descriptionType: "Abstract",
        }],
      },
      snapshotDate,
    )
    expect(work["short-description"].length).toBe(5000)
  })

  it("falls back to the accession number when no title is present", () => {
    const work = buildOrcidWork(
      "ds000001",
      { ...attributes, titles: [] },
      snapshotDate,
    )
    expect(work.title.title.value).toBe("ds000001")
  })
})
