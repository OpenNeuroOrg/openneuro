import { vi } from "vitest"
import type { OrcidWorkSummary } from "../../../types/orcid"

vi.mock("ioredis")
vi.mock("../../../config", () => ({
  default: {
    url: "https://openneuro.org",
    auth: {
      orcid: { clientID: "APP-OPENNEURO", apiURI: "https://api.orcid.org" },
    },
  },
}))

import {
  createWork,
  getWorkSummaries,
  isOpenNeuroWork,
  openNeuroWorkPutCodes,
  putCodeFromLocation,
  updateWork,
} from "../works"

const summary = (
  putCode: number,
  clientId: string,
  externalIdValue: string,
): OrcidWorkSummary => ({
  "put-code": putCode,
  source: {
    "source-client-id": {
      uri: `https://orcid.org/client/${clientId}`,
      path: clientId,
      host: "orcid.org",
    },
  },
  "external-ids": {
    "external-id": [
      {
        "external-id-type": "uri",
        "external-id-value": externalIdValue,
        "external-id-relationship": "self",
      },
    ],
  },
})

const work = {
  title: { title: { value: "A Test Dataset" } },
  type: "data-set",
  "external-ids": {
    "external-id": [
      {
        "external-id-type": "uri" as const,
        "external-id-value": "https://openneuro.org/datasets/ds000001",
        "external-id-relationship": "self" as const,
      },
    ],
  },
}

describe("putCodeFromLocation()", () => {
  it("reads the put-code out of a creation Location header", () => {
    expect(
      putCodeFromLocation(
        "https://api.orcid.org/v3.0/0000-0002-1825-0097/work/12345",
      ),
    ).toBe(12345)
  })
  it("returns null without a Location header", () => {
    expect(putCodeFromLocation(null)).toBeNull()
  })
  it("returns null for an unexpected Location header", () => {
    expect(putCodeFromLocation("https://api.orcid.org/v3.0/works")).toBeNull()
  })
})

describe("isOpenNeuroWork()", () => {
  it("matches works created by this client", () => {
    expect(isOpenNeuroWork(summary(1, "APP-OPENNEURO", "uri"))).toBe(true)
  })
  it("rejects works created by other systems", () => {
    expect(isOpenNeuroWork(summary(1, "APP-CROSSREF", "uri"))).toBe(false)
  })
})

describe("openNeuroWorkPutCodes()", () => {
  const datasetUrl = "https://openneuro.org/datasets/ds000001"

  it("indexes our own works by external id", () => {
    const putCodes = openNeuroWorkPutCodes([
      summary(42, "APP-OPENNEURO", datasetUrl),
    ])
    expect(putCodes.get(datasetUrl)).toBe(42)
  })

  it("ignores works from other sources so they are never overwritten", () => {
    const putCodes = openNeuroWorkPutCodes([
      summary(7, "APP-CROSSREF", datasetUrl),
    ])
    expect(putCodes.has(datasetUrl)).toBe(false)
  })

  it("converges on the lowest put-code when a work was added twice", () => {
    const putCodes = openNeuroWorkPutCodes([
      summary(90, "APP-OPENNEURO", datasetUrl),
      summary(11, "APP-OPENNEURO", datasetUrl),
    ])
    expect(putCodes.get(datasetUrl)).toBe(11)
  })
})

describe("ORCID works API", () => {
  const fetchMock = vi.fn()

  beforeEach(() => {
    fetchMock.mockReset()
    vi.stubGlobal("fetch", fetchMock)
  })

  afterEach(() => {
    vi.unstubAllGlobals()
  })

  it("flattens work summary groups", async () => {
    fetchMock.mockResolvedValue({
      ok: true,
      json: async () => ({
        group: [
          { "work-summary": [summary(1, "APP-OPENNEURO", "a")] },
          { "work-summary": [summary(2, "APP-OPENNEURO", "b")] },
          {},
        ],
      }),
    })
    const summaries = await getWorkSummaries("0000-0002-1825-0097", "token")
    expect(summaries.map((s) => s["put-code"])).toEqual([1, 2])
    expect(fetchMock).toHaveBeenCalledWith(
      "https://api.orcid.org/v3.0/0000-0002-1825-0097/works",
      expect.objectContaining({
        headers: expect.objectContaining({
          Authorization: "Bearer token",
        }),
      }),
    )
  })

  it("returns the put-code assigned to a new work", async () => {
    fetchMock.mockResolvedValue({
      ok: true,
      headers: {
        get: () => "https://api.orcid.org/v3.0/0000-0002-1825-0097/work/987654",
      },
    })
    await expect(createWork("0000-0002-1825-0097", "token", work)).resolves
      .toBe(987654)
    const [url, options] = fetchMock.mock.calls[0]
    expect(url).toBe("https://api.orcid.org/v3.0/0000-0002-1825-0097/work")
    expect(options.method).toBe("POST")
  })

  it("sends the put-code in the body when updating a work", async () => {
    fetchMock.mockResolvedValue({ ok: true })
    await updateWork("0000-0002-1825-0097", "token", 987654, work)
    const [url, options] = fetchMock.mock.calls[0]
    expect(url).toBe(
      "https://api.orcid.org/v3.0/0000-0002-1825-0097/work/987654",
    )
    expect(options.method).toBe("PUT")
    expect(JSON.parse(options.body)["put-code"]).toBe(987654)
  })

  it("raises the ORCID response body on failure", async () => {
    fetchMock.mockResolvedValue({
      ok: false,
      status: 409,
      text: async () => "conflict: work already exists",
    })
    await expect(createWork("0000-0002-1825-0097", "token", work)).rejects
      .toThrow(/409.*work already exists/)
  })
})
