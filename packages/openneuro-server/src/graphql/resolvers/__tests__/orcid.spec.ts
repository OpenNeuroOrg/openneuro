import { vi } from "vitest"
import type * as OrcidTokenModule from "../../../libs/orcid/token"
import type * as OrcidWorksModule from "../../../libs/orcid/works"

vi.mock("ioredis")
vi.mock("@sentry/node", () => ({ captureException: vi.fn() }))
vi.mock("../../../config", () => ({
  default: {
    url: "https://openneuro.org",
    auth: {
      orcid: { clientID: "APP-OPENNEURO", apiURI: "https://api.orcid.org" },
    },
  },
}))

const userFindOne = vi.fn()
vi.mock("../../../models/user", () => ({
  default: { findOne: (...args) => userFindOne(...args) },
}))

const orcidWorkFindOne = vi.fn()
const orcidWorkUpdateOne = vi.fn()
vi.mock("../../../models/orcidWork", () => ({
  default: {
    findOne: (...args) => orcidWorkFindOne(...args),
    updateOne: (...args) => orcidWorkUpdateOne(...args),
  },
}))

const getOrcidAccessToken = vi.fn()
vi.mock("../../../libs/orcid/token", async () => {
  const actual = await vi.importActual<typeof OrcidTokenModule>(
    "../../../libs/orcid/token",
  )
  return {
    ...actual,
    getOrcidAccessToken: (...args) => getOrcidAccessToken(...args),
  }
})

const getWorkSummaries = vi.fn()
const createWork = vi.fn()
const updateWork = vi.fn()
vi.mock("../../../libs/orcid/works", async () => {
  const actual = await vi.importActual<typeof OrcidWorksModule>(
    "../../../libs/orcid/works",
  )
  return {
    ...actual,
    getWorkSummaries: (...args) => getWorkSummaries(...args),
    createWork: (...args) => createWork(...args),
    updateWork: (...args) => updateWork(...args),
  }
})

const eligibleDatasets = vi.fn()
const isDataciteContributor = vi.fn()
const latestUndeprecatedSnapshot = vi.fn()
vi.mock("../../../libs/orcid/eligible-datasets", () => ({
  eligibleDatasets: (...args) => eligibleDatasets(...args),
  isDataciteContributor: (...args) => isDataciteContributor(...args),
  latestUndeprecatedSnapshot: (...args) => latestUndeprecatedSnapshot(...args),
  snapshotRevision: vi.fn().mockResolvedValue("abcdef1"),
}))

const assembleMetadata = vi.fn()
vi.mock("../../../libs/doi/metadata", () => ({
  assembleMetadata: (...args) => assembleMetadata(...args),
}))

import { syncOrcidWorks } from "../orcid"

const ORCID = "0000-0002-1825-0097"
const DATASET_URL = "https://openneuro.org/datasets/ds000001"

const context = { user: "user-1", userInfo: { id: "user-1" } } as never

const mockUser = (overrides = {}) => {
  userFindOne.mockReturnValue({
    exec: () =>
      Promise.resolve({
        id: "user-1",
        orcid: ORCID,
        orcidConsent: true,
        ...overrides,
      }),
  })
}

const mockDataset = (kind = "uploader") => {
  eligibleDatasets.mockResolvedValue({
    candidates: new Map([["ds000001", kind]]),
    searchError: null,
  })
  latestUndeprecatedSnapshot.mockResolvedValue({
    tag: "1.0.1",
    hexsha: "abcdef1",
    created: new Date("2024-03-05T12:00:00Z"),
  })
  assembleMetadata.mockResolvedValue({
    doi: "10.18112/openneuro.ds000001.v1.0.1",
    url: `${DATASET_URL}/versions/1.0.1`,
    creators: [{ name: "Doe, Jane", nameType: "Personal" }],
    titles: [{ title: "A Test Dataset" }],
    publisher: { name: "OpenNeuro" },
    publicationYear: "2024",
    types: { resourceTypeGeneral: "Dataset" },
  })
}

beforeEach(() => {
  getOrcidAccessToken.mockResolvedValue("access-token")
  getWorkSummaries.mockResolvedValue([])
  orcidWorkFindOne.mockReturnValue({ lean: () => ({ exec: () => null }) })
  orcidWorkUpdateOne.mockResolvedValue({})
  createWork.mockResolvedValue(1000)
  isDataciteContributor.mockResolvedValue(true)
})

describe("syncOrcidWorks()", () => {
  it("rejects unauthenticated requests", async () => {
    await expect(
      syncOrcidWorks(null, {}, { user: null, userInfo: null } as never),
    ).rejects.toThrow(/must be logged in/)
    expect(userFindOne).not.toHaveBeenCalled()
  })

  it("rejects a token whose user no longer exists", async () => {
    userFindOne.mockReturnValue({ exec: () => Promise.resolve(null) })
    await expect(syncOrcidWorks(null, {}, context)).rejects.toThrow(
      /must be logged in/,
    )
  })

  it("requires a linked ORCID iD", async () => {
    mockUser({ orcid: undefined })
    await expect(syncOrcidWorks(null, {}, context)).rejects.toThrow(
      /Link an ORCID iD/,
    )
  })

  it("requires consent before writing to a record", async () => {
    mockUser({ orcidConsent: null })
    await expect(syncOrcidWorks(null, {}, context)).rejects.toThrow(/Consent/)
    expect(createWork).not.toHaveBeenCalled()
  })

  it("creates a work for a dataset with no existing record", async () => {
    mockUser()
    mockDataset()
    const result = await syncOrcidWorks(null, {}, context)
    expect(result.orcid).toBe(ORCID)
    expect(result.works).toEqual([
      {
        datasetId: "ds000001",
        snapshotTag: "1.0.1",
        putCode: "1000",
        action: "created",
        reason: null,
      },
    ])
    expect(createWork).toHaveBeenCalledWith(
      ORCID,
      "access-token",
      expect.objectContaining({ type: "data-set" }),
    )
    expect(orcidWorkUpdateOne).toHaveBeenCalledWith(
      { userId: "user-1", datasetId: "ds000001" },
      expect.objectContaining({
        $set: expect.objectContaining({ putCode: 1000, snapshotTag: "1.0.1" }),
      }),
      { upsert: true },
    )
  })

  it("makes no ORCID write when the dataset has not changed", async () => {
    mockUser()
    mockDataset()
    // Reuse the hash the resolver would compute by syncing once first
    const first = await syncOrcidWorks(null, {}, context)
    const hash = orcidWorkUpdateOne.mock.calls[0][1].$set.hash
    expect(first.works[0].action).toBe("created")

    orcidWorkFindOne.mockReturnValue({
      lean: () => ({ exec: () => ({ putCode: 1000, hash }) }),
    })
    createWork.mockClear()
    updateWork.mockClear()

    const second = await syncOrcidWorks(null, {}, context)
    expect(second.works[0].action).toBe("unchanged")
    expect(second.works[0].putCode).toBe("1000")
    expect(createWork).not.toHaveBeenCalled()
    expect(updateWork).not.toHaveBeenCalled()
  })

  it("updates the existing work when the metadata changed", async () => {
    mockUser()
    mockDataset()
    orcidWorkFindOne.mockReturnValue({
      lean: () => ({ exec: () => ({ putCode: 1000, hash: "stale" }) }),
    })
    const result = await syncOrcidWorks(null, {}, context)
    expect(result.works[0]).toMatchObject({
      action: "updated",
      putCode: "1000",
    })
    expect(updateWork).toHaveBeenCalledWith(
      ORCID,
      "access-token",
      1000,
      expect.objectContaining({ type: "data-set" }),
    )
    expect(createWork).not.toHaveBeenCalled()
  })

  it("adopts a work already on the record instead of duplicating it", async () => {
    mockUser()
    mockDataset()
    getWorkSummaries.mockResolvedValue([
      {
        "put-code": 555,
        source: {
          "source-client-id": {
            uri: "https://orcid.org/client/APP-OPENNEURO",
            path: "APP-OPENNEURO",
            host: "orcid.org",
          },
        },
        "external-ids": {
          "external-id": [
            {
              "external-id-type": "uri",
              "external-id-value": DATASET_URL,
              "external-id-relationship": "self",
            },
          ],
        },
      },
    ])
    const result = await syncOrcidWorks(null, {}, context)
    expect(result.works[0]).toMatchObject({ action: "updated", putCode: "555" })
    expect(createWork).not.toHaveBeenCalled()
    expect(updateWork).toHaveBeenCalledWith(
      ORCID,
      "access-token",
      555,
      expect.anything(),
    )
  })

  it("fails rather than risking duplicates when the record cannot be read", async () => {
    mockUser()
    mockDataset()
    getWorkSummaries.mockRejectedValue(new Error("ORCID API error 503"))
    await expect(syncOrcidWorks(null, {}, context)).rejects.toThrow(
      /Could not read existing works/,
    )
    expect(createWork).not.toHaveBeenCalled()
  })

  it("skips datasets whose only snapshots are deprecated", async () => {
    mockUser()
    mockDataset()
    latestUndeprecatedSnapshot.mockResolvedValue(null)
    const result = await syncOrcidWorks(null, {}, context)
    expect(result.works[0]).toMatchObject({
      action: "skipped",
      snapshotTag: null,
    })
    expect(createWork).not.toHaveBeenCalled()
  })

  it("skips search hits the snapshot datacite.yml does not confirm", async () => {
    mockUser()
    mockDataset("contributor")
    isDataciteContributor.mockResolvedValue(false)
    const result = await syncOrcidWorks(null, {}, context)
    expect(result.works[0].action).toBe("skipped")
    expect(result.works[0].reason).toMatch(/datacite\.yml/)
    expect(createWork).not.toHaveBeenCalled()
  })

  it("does not recheck datacite.yml for datasets the user uploaded", async () => {
    mockUser()
    mockDataset("uploader")
    await syncOrcidWorks(null, {}, context)
    expect(isDataciteContributor).not.toHaveBeenCalled()
    expect(createWork).toHaveBeenCalled()
  })

  it("reports the intended action without writing on a dry run", async () => {
    mockUser()
    mockDataset()
    const result = await syncOrcidWorks(null, { dryRun: true }, context)
    expect(result.works[0]).toMatchObject({ action: "created", putCode: null })
    expect(createWork).not.toHaveBeenCalled()
    expect(orcidWorkUpdateOne).not.toHaveBeenCalled()
  })

  it("reports a failed dataset without aborting the rest of the sync", async () => {
    mockUser()
    mockDataset()
    eligibleDatasets.mockResolvedValue({
      candidates: new Map([
        ["ds000001", "uploader"],
        ["ds000002", "uploader"],
      ]),
      searchError: null,
    })
    assembleMetadata.mockRejectedValueOnce(new Error("no metadata"))
    const result = await syncOrcidWorks(null, {}, context)
    expect(result.works).toHaveLength(2)
    expect(result.works[0]).toMatchObject({
      datasetId: "ds000001",
      action: "error",
    })
    expect(result.works[1]).toMatchObject({
      datasetId: "ds000002",
      action: "created",
    })
  })

  it("passes through a search index failure so uploads still sync", async () => {
    mockUser()
    mockDataset()
    eligibleDatasets.mockResolvedValue({
      candidates: new Map([["ds000001", "uploader"]]),
      searchError: "Error: connect ECONNREFUSED",
    })
    const result = await syncOrcidWorks(null, {}, context)
    expect(result.searchError).toMatch(/ECONNREFUSED/)
    expect(result.works[0].action).toBe("created")
  })
})
