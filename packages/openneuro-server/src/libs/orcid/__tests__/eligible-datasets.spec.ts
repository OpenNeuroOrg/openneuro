import { vi } from "vitest"

vi.mock("ioredis")
vi.mock("@sentry/node", () => ({
  captureException: vi.fn(),
  captureMessage: vi.fn(),
}))
vi.mock("../../../config", () => ({
  default: {
    url: "https://openneuro.org",
    auth: {
      orcid: { clientID: "APP-OPENNEURO", apiURI: "https://api.orcid.org" },
    },
  },
}))

const getSnapshots = vi.fn()
vi.mock("../../../datalad/snapshots", () => ({
  getSnapshots: (...args) => getSnapshots(...args),
}))

const deprecatedFind = vi.fn()
vi.mock("../../../models/deprecatedSnapshot", () => ({
  default: { find: (...args) => deprecatedFind(...args) },
}))

const datasetFind = vi.fn()
vi.mock("../../../models/dataset", () => ({
  default: { find: (...args) => datasetFind(...args) },
}))

const snapshotFindOne = vi.fn()
vi.mock("../../../models/snapshot", () => ({
  default: { findOne: (...args) => snapshotFindOne(...args) },
}))

const contributors = vi.fn()
vi.mock("../../../datalad/contributors", () => ({
  contributors: (...args) => contributors(...args),
}))

const search = vi.fn()
vi.mock("../../../elasticsearch/elastic-client", () => ({
  getElasticClient: () => ({ search: (...args) => search(...args) }),
}))

import {
  eligibleDatasets,
  isDataciteContributor,
  latestUndeprecatedSnapshot,
  searchContributorDatasetIds,
} from "../eligible-datasets"

const ORCID = "0000-0002-1825-0097"

const leanExec = (value) => ({ lean: () => ({ exec: () => value }) })

const mockDeprecated = (ids: string[]) =>
  deprecatedFind.mockReturnValue(leanExec(ids.map((id) => ({ id }))))

const snapshot = (tag: string, created: string) => ({
  tag,
  created: new Date(created),
  hexsha: `sha-${tag}`,
})

describe("latestUndeprecatedSnapshot()", () => {
  it("returns the newest snapshot when none are deprecated", async () => {
    getSnapshots.mockResolvedValue([
      snapshot("1.0.0", "2024-01-01"),
      snapshot("1.0.2", "2024-03-01"),
      snapshot("1.0.1", "2024-02-01"),
    ])
    mockDeprecated([])
    const latest = await latestUndeprecatedSnapshot("ds000001")
    expect(latest.tag).toBe("1.0.2")
  })

  it("falls back past deprecated snapshots", async () => {
    getSnapshots.mockResolvedValue([
      snapshot("1.0.0", "2024-01-01"),
      snapshot("1.0.1", "2024-02-01"),
      snapshot("1.0.2", "2024-03-01"),
    ])
    mockDeprecated(["ds000001:1.0.2", "ds000001:1.0.1"])
    const latest = await latestUndeprecatedSnapshot("ds000001")
    expect(latest.tag).toBe("1.0.0")
  })

  it("returns null when every snapshot is deprecated", async () => {
    getSnapshots.mockResolvedValue([snapshot("1.0.0", "2024-01-01")])
    mockDeprecated(["ds000001:1.0.0"])
    expect(await latestUndeprecatedSnapshot("ds000001")).toBeNull()
  })

  it("returns null for a dataset with no snapshots", async () => {
    getSnapshots.mockResolvedValue([])
    expect(await latestUndeprecatedSnapshot("ds000001")).toBeNull()
  })

  it("returns null when the dataset does not exist", async () => {
    getSnapshots.mockResolvedValue(null)
    expect(await latestUndeprecatedSnapshot("ds000001")).toBeNull()
  })
})

describe("searchContributorDatasetIds()", () => {
  it("filters the index to public datasets listing this ORCID iD", async () => {
    search.mockResolvedValue({
      hits: { total: { value: 2 }, hits: [{ _source: { id: "ds000001" } }] },
    })
    expect(await searchContributorDatasetIds(ORCID)).toEqual(["ds000001"])
    expect(search).toHaveBeenCalledWith(
      expect.objectContaining({
        index: "datasets",
        query: {
          bool: {
            filter: [
              { term: { public: true } },
              { term: { "latestSnapshot.contributors.orcid.keyword": ORCID } },
            ],
          },
        },
      }),
    )
  })
})

describe("eligibleDatasets()", () => {
  // Mongo is only queried a second time when the index adds new candidates, so
  // drop any unconsumed queued results between cases
  beforeEach(() => datasetFind.mockReset())

  it("combines uploads with confirmed public search hits", async () => {
    datasetFind
      .mockReturnValueOnce(leanExec([{ id: "ds000001" }]))
      .mockReturnValueOnce(leanExec([{ id: "ds000002" }]))
    search.mockResolvedValue({
      hits: {
        total: { value: 2 },
        hits: [{ _source: { id: "ds000002" } }, {
          _source: { id: "ds000003" },
        }],
      },
    })

    const { candidates, searchError } = await eligibleDatasets("user-1", ORCID)
    expect(searchError).toBeNull()
    expect([...candidates]).toEqual([
      ["ds000001", "uploader"],
      ["ds000002", "contributor"],
    ])
    // ds000003 was in the index but Mongo did not confirm it as public
    expect(candidates.has("ds000003")).toBe(false)
    expect(datasetFind).toHaveBeenCalledWith(
      { uploader: "user-1", public: true },
      "id",
    )
  })

  it("keeps uploads as uploader matches even when also in the index", async () => {
    datasetFind
      .mockReturnValueOnce(leanExec([{ id: "ds000001" }]))
      .mockReturnValueOnce(leanExec([]))
    search.mockResolvedValue({
      hits: { total: { value: 1 }, hits: [{ _source: { id: "ds000001" } }] },
    })
    const { candidates } = await eligibleDatasets("user-1", ORCID)
    expect(candidates.get("ds000001")).toBe("uploader")
  })

  it("reports a search failure but still returns uploads", async () => {
    datasetFind.mockReturnValueOnce(leanExec([{ id: "ds000001" }]))
    search.mockRejectedValue(new Error("connect ECONNREFUSED"))
    const { candidates, searchError } = await eligibleDatasets("user-1", ORCID)
    expect(candidates.get("ds000001")).toBe("uploader")
    expect(searchError).toMatch(/ECONNREFUSED/)
  })
})

describe("isDataciteContributor()", () => {
  it("reads contributors at the snapshot revision", async () => {
    contributors.mockResolvedValue([{ name: "Doe, Jane", orcid: ORCID }])
    expect(
      await isDataciteContributor("ds000001", "1.0.1", "sha-1.0.1", ORCID),
    ).toBe(true)
    expect(contributors).toHaveBeenCalledWith({
      id: "ds000001:1.0.1",
      tag: "1.0.1",
      hexsha: "sha-1.0.1",
    })
  })

  it("is false when the ORCID iD is absent", async () => {
    contributors.mockResolvedValue([
      { name: "Roe, Richard", orcid: undefined },
    ])
    expect(
      await isDataciteContributor("ds000001", "1.0.1", "sha-1.0.1", ORCID),
    ).toBe(false)
  })
})
